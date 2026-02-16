import { Injectable, signal, computed } from '@angular/core';

export interface StatusItem {
  id: string;
  type: 'image' | 'video';
  thumbnailUrl: string;
  contentUrl: string; // Ideally same as thumbnail for this demo
  contactName: string;
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
        contactName: 'Sarah J.',
        timestamp: new Date(Date.now() - 86400000),
        viewCount: 124,
        isArchived: true
      }
    ]);
  }

  // Mock function to simulate scanning/fetching statuses
  async scanForStatuses(urlOrNumber: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock results
    const newStatuses: StatusItem[] = Array.from({ length: 6 }).map((_, i) => ({
      id: crypto.randomUUID(),
      type: Math.random() > 0.7 ? 'video' : 'image',
      thumbnailUrl: `https://picsum.photos/400/700?random=${Date.now() + i}`,
      contentUrl: `https://picsum.photos/400/700?random=${Date.now() + i}`,
      contactName: ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona'][i],
      timestamp: new Date(),
      viewCount: Math.floor(Math.random() * 200),
      isArchived: false
    }));

    this._availableStatuses.set(newStatuses);
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