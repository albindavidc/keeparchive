
import { Injectable, signal, computed } from '@angular/core';

export interface StatusItem {
  id: string;
  type: 'image' | 'video';
  thumbnailUrl: string; // Will be a blob URL
  contentUrl: string;   // Will be a blob URL
  contactName: string; 
  timestamp: Date;
  viewCount: number; // Not available from file system, will default to 0
  isArchived: boolean;
  fileHandle?: any; // FileSystemFileHandle
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  // State for available statuses (discovered via "scan")
  private _availableStatuses = signal<StatusItem[]>([]);
  
  // State for archived statuses
  private _archivedStatuses = signal<StatusItem[]>([]);
  
  // Public signals
  availableStatuses = this._availableStatuses.asReadonly();
  archivedStatuses = this._archivedStatuses.asReadonly();
  
  // Computed stats
  totalArchived = computed(() => this._archivedStatuses().length);
  // Mock size calculation based on count since we don't persist blobs permanently in this demo
  storageUsedMB = computed(() => (this._archivedStatuses().length * 2.5).toFixed(1)); 

  constructor() {
    // Start empty - no dummy data
  }

  /**
   * Request directory access and scan for media files.
   * Uses the File System Access API.
   */
  async scanLocalDevice(): Promise<void> {
    try {
      // @ts-ignore - verify API existence
      if (typeof window.showDirectoryPicker !== 'function') {
        alert('Your browser does not support the File System Access API. Please use Chrome or Edge on Android/Desktop.');
        return;
      }

      // 1. Prompt user to select directory
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker({
        id: 'whatsapp-status-folder',
        mode: 'read'
      });

      const newStatuses: StatusItem[] = [];

      // 2. Iterate through files
      // @ts-ignore
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          
          // Filter for images and videos
          if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const objectUrl = URL.createObjectURL(file);
            
            newStatuses.push({
              id: entry.name, // Use filename as ID
              type: file.type.startsWith('video/') ? 'video' : 'image',
              thumbnailUrl: objectUrl,
              contentUrl: objectUrl,
              contactName: entry.name,
              timestamp: new Date(file.lastModified),
              viewCount: 0,
              isArchived: false,
              fileHandle: entry
            });
          }
        }
      }

      // Sort by date modified (newest first)
      newStatuses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      this._availableStatuses.set(newStatuses);

    } catch (err) {
      console.error('Error accessing file system:', err);
      // User likely cancelled the picker
      if ((err as Error).name !== 'AbortError') {
        alert('Failed to access folder. Please try again.');
      }
      throw err; // Re-throw to handle UI state in component
    }
  }

  clearAvailable() {
    // Revoke URLs to free memory
    this._availableStatuses().forEach(s => {
      URL.revokeObjectURL(s.contentUrl);
    });
    this._availableStatuses.set([]);
  }

  toggleArchive(id: string) {
    const available = this._availableStatuses();
    const itemToArchive = available.find(s => s.id === id);

    // Check if already archived to avoid duplicates
    if (this._archivedStatuses().some(s => s.id === id)) {
      return; 
    }

    if (itemToArchive) {
      // Create a copy for the archive
      // In a real app, we would write this file to a new 'Saved' directory handle.
      // For this demo, we keep the blob URL reference in the 'Saved' list.
      const archivedItem = { ...itemToArchive, isArchived: true };

      this._archivedStatuses.update(prev => [archivedItem, ...prev]);
      
      // Update local state to reflect it's archived
      this._availableStatuses.update(prev => 
        prev.map(s => s.id === id ? { ...s, isArchived: true } : s)
      );
    }
  }

  removeFromArchive(id: string) {
    this._archivedStatuses.update(prev => prev.filter(s => s.id !== id));
    
    // If it's currently in available list, uncheck it
    this._availableStatuses.update(prev => 
      prev.map(s => s.id === id ? { ...s, isArchived: false } : s)
    );
  }
}
