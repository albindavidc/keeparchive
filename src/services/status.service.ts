
import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface StatusItem {
  id: string;
  type: 'image' | 'video';
  thumbnailUrl: string; 
  contentUrl: string;   
  contactName: string; 
  timestamp: Date;
  size: number;
  isArchived: boolean;
  selected?: boolean;
  fileHandle?: any; 
  nativePath?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private toast = inject(ToastService);

  // State
  private _availableStatuses = signal<StatusItem[]>([]);
  private _archivedStatuses = signal<StatusItem[]>([]);
  
  // Readonly signals
  availableStatuses = this._availableStatuses.asReadonly();
  archivedStatuses = this._archivedStatuses.asReadonly();
  
  // Computed
  totalArchived = computed(() => this._archivedStatuses().length);
  storageUsedMB = computed(() => {
    const totalBytes = this._archivedStatuses().reduce((acc, item) => acc + item.size, 0);
    return (totalBytes / (1024 * 1024)).toFixed(1);
  });

  // Native Config
  private readonly WHATSAPP_STATUS_PATH = '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses';
  private readonly DOWNLOAD_FOLDER = 'KeepArchive';

  // Web DB Config
  private readonly DB_NAME = 'KeepArchiveDB';
  private readonly STORE_NAME = 'handles';
  private readonly HANDLE_KEY = 'whatsapp_dir_handle';
  private readonly SAVE_HANDLE_KEY = 'save_dir_handle';

  hasStoredHandle = signal(false);
  saveDirectoryName = signal<string>('Internal Storage');
  private saveHandle: any = null;
  
  isNativePlatform = signal(Capacitor.isNativePlatform());

  constructor() {
    if (this.isNativePlatform()) {
      // On native, we can try to scan immediately as permissions might already be granted
      this.scanNative();
    } else {
      this.initDB().then(() => {
        this.checkStoredHandle();
        this.checkSaveHandle();
      });
    }
  }

  // --- Main Entry Point ---

  async scanLocalDevice(): Promise<void> {
    if (this.isNativePlatform()) {
      await this.scanNative();
    } else {
      await this.scanWeb();
    }
  }

  // --- Native Android Implementation (Capacitor) ---

  private async scanNative() {
    try {
      // 1. Check Permissions
      const permissions = await Filesystem.requestPermissions();
      
      if (permissions.publicStorage !== 'granted') {
        this.toast.show('Storage permission denied', 'error');
        return;
      }

      // 2. Read Directory
      // Note: On Android 11+, this requires MANAGE_EXTERNAL_STORAGE to be granted via native intent usually.
      // We attempt to read using the specific path provided.
      const result = await Filesystem.readdir({
        path: this.WHATSAPP_STATUS_PATH,
        // We use External storage but providing full path usually overrides if allowed
        directory: Directory.External 
      });

      console.log('Native files found:', result.files);

      const newStatuses: StatusItem[] = [];

      for (const file of result.files) {
        if (this.isMediaFile(file.name)) {
          // Construct a displayable URL (Capacitor specific)
          // Ideally we read the file to get a blob, or use the webview-friendly path
          const fullPath = `${this.WHATSAPP_STATUS_PATH}/${file.name}`;
          const safeUrl = Capacitor.convertFileSrc(fullPath); 
          
          newStatuses.push({
            id: file.name,
            type: file.name.endsWith('.mp4') ? 'video' : 'image',
            thumbnailUrl: safeUrl,
            contentUrl: safeUrl,
            contactName: file.name,
            timestamp: new Date(Number(file.mtime || Date.now())),
            size: Number(file.size || 0),
            isArchived: false,
            nativePath: fullPath
          });
        }
      }

      this.processResults(newStatuses);

    } catch (err) {
      console.error('Native scan error:', err);
      this.toast.show('Failed to scan. Ensure WhatsApp is installed and permissions granted.', 'error');
    }
  }

  private isMediaFile(name: string): boolean {
    return /\.(jpg|jpeg|png|mp4)$/i.test(name);
  }

  // --- Web Implementation (File System Access API) ---

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e);
    });
  }

  private async checkStoredHandle() {
    const handle = await this.getStoredItem(this.HANDLE_KEY);
    this.hasStoredHandle.set(!!handle);
  }

  private async checkSaveHandle() {
    const handle = await this.getStoredItem(this.SAVE_HANDLE_KEY);
    if (handle) {
      this.saveHandle = handle;
      this.saveDirectoryName.set(handle.name);
    }
  }

  private async getStoredItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const query = store.get(key);
        query.onsuccess = () => resolve(query.result);
        query.onerror = () => reject(query.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async saveStoredItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        store.put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }

  private async deleteStoredItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }

  private async scanWeb() {
    try {
      // @ts-ignore
      if (typeof window.showDirectoryPicker !== 'function') {
        this.toast.show('Browser not supported. Please use Chrome on Android.', 'error');
        return;
      }

      let dirHandle = await this.getStoredItem(this.HANDLE_KEY);

      if (dirHandle) {
        // @ts-ignore
        const permission = await dirHandle.queryPermission({ mode: 'read' });
        if (permission !== 'granted') {
          // @ts-ignore
          const newPermission = await dirHandle.requestPermission({ mode: 'read' });
          if (newPermission !== 'granted') {
            this.toast.show('Access denied.', 'error');
            return;
          }
        }
      } else {
        // @ts-ignore
        dirHandle = await window.showDirectoryPicker({
          id: 'whatsapp-status-folder',
          mode: 'read',
          startIn: 'documents' 
        });
        if (dirHandle) await this.saveStoredItem(this.HANDLE_KEY, dirHandle);
      }

      const newStatuses: StatusItem[] = [];
      // @ts-ignore
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const objectUrl = URL.createObjectURL(file);
            newStatuses.push({
              id: entry.name,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              thumbnailUrl: objectUrl,
              contentUrl: objectUrl,
              contactName: entry.name,
              timestamp: new Date(file.lastModified),
              size: file.size,
              isArchived: false,
              fileHandle: entry
            });
          }
        }
      }
      this.processResults(newStatuses);

    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Web scan error:', err);
        this.toast.show('Failed to open folder.', 'error');
      }
    }
  }

  async resetPermission() {
    if (this.isNativePlatform()) return; // Not applicable for native logic mostly
    await this.deleteStoredItem(this.HANDLE_KEY);
    this.hasStoredHandle.set(false);
    this.clearAvailable();
  }

  async changeSaveLocation() {
    try {
      // @ts-ignore
      const handle = await window.showDirectoryPicker({
        id: 'keep-archive-save-folder',
        mode: 'readwrite',
        startIn: 'documents'
      });
      
      if (handle) {
        this.saveHandle = handle;
        this.saveDirectoryName.set(handle.name);
        await this.saveStoredItem(this.SAVE_HANDLE_KEY, handle);
        this.toast.show(`Save location set to: ${handle.name}`, 'success');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Change save location error:', err);
        this.toast.show('Failed to change save location.', 'error');
      }
    }
  }

  async resetSaveLocation() {
    this.saveHandle = null;
    this.saveDirectoryName.set('Internal Storage');
    await this.deleteStoredItem(this.SAVE_HANDLE_KEY);
    this.toast.show('Reset to default storage', 'info');
  }

  private processResults(items: StatusItem[]) {
    const validStatuses = items.filter(s => s.size > 10000); 
    validStatuses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    this._availableStatuses.set(validStatuses);
    
    if (validStatuses.length > 0) {
      this.toast.show(`Success! Found ${validStatuses.length} statuses.`, 'success');
    } else {
      this.toast.show('Folder is empty.', 'info');
    }
  }

  // --- Common Actions ---

  async toggleArchive(id: string) {
    const available = this._availableStatuses();
    const itemToArchive = available.find(s => s.id === id);

    if (this._archivedStatuses().some(s => s.id === id)) {
      this.toast.show('Already in library', 'info');
      return; 
    }

    if (itemToArchive) {
      if (this.isNativePlatform() && itemToArchive.nativePath) {
        // Native copy logic
        try {
          await this.nativeCopy(itemToArchive);
          this.addToArchiveState(itemToArchive);
        } catch (e) {
          console.error(e);
          this.toast.show('Failed to save file to Documents', 'error');
        }
      } else {
        // Web Download logic
        if (this.saveHandle) {
          try {
            await this.saveToCustomFolder(itemToArchive);
            this.addToArchiveState(itemToArchive);
          } catch (e) {
            console.error(e);
            this.toast.show('Failed to save to custom folder', 'error');
          }
        } else {
          this.addToArchiveState(itemToArchive);
          this.triggerBrowserDownload(itemToArchive);
        }
      }
    }
  }

  private async saveToCustomFolder(item: StatusItem) {
    // Verify permission
    // @ts-ignore
    const permission = await this.saveHandle.queryPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
      // @ts-ignore
      const newPermission = await this.saveHandle.requestPermission({ mode: 'readwrite' });
      if (newPermission !== 'granted') {
        throw new Error('Permission denied');
      }
    }

    // Get file data
    const file = await item.fileHandle.getFile();
    
    // Create file in destination
    // @ts-ignore
    const newFileHandle = await this.saveHandle.getFileHandle(item.id, { create: true });
    // @ts-ignore
    const writable = await newFileHandle.createWritable();
    await writable.write(file);
    await writable.close();
  }

  private addToArchiveState(item: StatusItem) {
    const archivedItem = { ...item, isArchived: true, selected: false };
    this._archivedStatuses.update(prev => [archivedItem, ...prev]);
    this._availableStatuses.update(prev => 
      prev.map(s => s.id === item.id ? { ...s, isArchived: true } : s)
    );
    this.toast.show('Saved to Library', 'success');
  }

  private async nativeCopy(item: StatusItem) {
    const fileName = item.id;
    const destPath = `${this.DOWNLOAD_FOLDER}/${fileName}`;
    
    try {
      // 1. Explicitly create the directory to ensure it exists
      try {
        await Filesystem.mkdir({
          path: this.DOWNLOAD_FOLDER,
          directory: Directory.Documents,
          recursive: true
        });
      } catch (e) {
        // Directory might already exist, which is fine
      }

      // 2. Read the source file
      // We use the absolute path from the item
      const file = await Filesystem.readFile({
        path: item.nativePath!
      });
      
      // 3. Write to the destination in Documents/KeepArchive
      await Filesystem.writeFile({
        path: destPath,
        data: file.data,
        directory: Directory.Documents,
        recursive: true
      });

    } catch (err) {
      console.error('Native save failed:', err);
      throw new Error('Failed to save file to device storage');
    }
  }

  removeFromArchive(id: string) {
    this._archivedStatuses.update(prev => prev.filter(s => s.id !== id));
    this._availableStatuses.update(prev => 
      prev.map(s => s.id === id ? { ...s, isArchived: false } : s)
    );
    this.toast.show('Removed from library', 'info');
  }

  clearAvailable() {
    this._availableStatuses().forEach(s => {
      if (!this.isNativePlatform()) URL.revokeObjectURL(s.contentUrl);
    });
    this._availableStatuses.set([]);
  }

  private triggerBrowserDownload(item: StatusItem) {
    const a = document.createElement('a');
    a.href = item.contentUrl;
    a.download = `KA_${item.id.substring(0, 10)}`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
