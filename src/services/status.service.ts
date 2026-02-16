
import { Injectable, signal, computed } from '@angular/core';

export interface StatusItem {
  id: string;
  type: 'image' | 'video';
  thumbnailUrl: string;
  contentUrl: string;
  contactName: string; // Will act as file name or generic identifier for local files
  timestamp: Date;
  viewCount: number;
  isArchived: boolean;
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
  storageUsedMB = computed(() => (this._archivedStatuses().length * 1.5).toFixed(1)); // Mock calculation

  constructor() {
    // Load mock initial data for archive
    this._archivedStatuses.set([
      {
        id: '101',
        type: 'image',
        thumbnailUrl: 'https://picsum.photos/400/700?random=101',
        contentUrl: 'https://picsum.photos/400/700?random=101',
        contactName: 'Saved_Status_01.jpg',
        timestamp: new Date(Date.now() - 86400000),
        viewCount: 0,
        isArchived: true
      }
    ]);
  }

  // Mock function to simulate scanning local device storage
  async scanLocalDevice(): Promise<void> {
    // Simulate file system read delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock local files from the .Statuses folder
    const newStatuses: StatusItem[] = Array.from({ length: 8 }).map((_, i) => ({
      id: crypto.randomUUID(),
      type: Math.random() > 0.7 ? 'video' : 'image',
      thumbnailUrl: `https://picsum.photos/400/700?random=${Date.now() + i}`,
      contentUrl: `https://picsum.photos/400/700?random=${Date.now() + i}`,
      contactName: `Status_${Date.now()}_${i + 1}.${Math.random() > 0.7 ? 'mp4' : 'jpg'}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
      viewCount: 0, // Local files don't show view counts usually
      isArchived: false
    }));

    this._availableStatuses.set(newStatuses);
  }

  clearAvailable() {
    this._availableStatuses.set([]);
  }

  toggleArchive(id: string) {
    const available = this._availableStatuses();
    const itemToArchive = available.find(s => s.id === id);

    if (itemToArchive) {
      // Add to archive
      this._archivedStatuses.update(prev => [
        { ...itemToArchive, isArchived: true }, 
        ...prev
      ]);
      
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
