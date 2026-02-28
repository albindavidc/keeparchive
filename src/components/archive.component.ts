
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../services/status.service';
import { StatusCardComponent } from './status-card.component';
import { staggerList, slideUp } from '../animations';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, StatusCardComponent, FormsModule],
  animations: [staggerList, slideUp],
  template: `
    <div class="w-full max-w-7xl mx-auto px-4 pb-20 pt-8" @slideUp>
      
      <!-- Archive Header -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Your Library</h2>
          <div class="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/50">
              {{ statusService.totalArchived() }} Items
            </span>
            <span>•</span>
            <span>{{ statusService.storageUsedMB() }} MB Saved</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <!-- Search -->
          <div class="relative group flex-1">
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              placeholder="Search by name..." 
              class="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-full sm:w-64 transition-shadow shadow-sm dark:text-white dark:placeholder-slate-600"
            />
          </div>
          
          <!-- Type Filter -->
           <div class="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button 
              (click)="filterType.set('all')"
              [class]="filterType() === 'all' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'"
              class="px-4 py-1.5 rounded-lg text-sm transition-colors">All</button>
            <button 
              (click)="filterType.set('image')"
              [class]="filterType() === 'image' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'"
              class="px-4 py-1.5 rounded-lg text-sm transition-colors">Photos</button>
             <button 
              (click)="filterType.set('video')"
              [class]="filterType() === 'video' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'"
              class="px-4 py-1.5 rounded-lg text-sm transition-colors">Videos</button>
          </div>
        </div>
      </div>

      <!-- Archive Grid -->
      <div [@staggerList]="filteredItems().length" class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
        @for (item of filteredItems(); track item.id) {
          <div class="relative group">
            <app-status-card 
              [status]="item" 
              (onDownload)="noop()" 
            />
            <!-- Delete Action -->
             <button 
              (click)="removeItem(item.id)"
              class="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-red-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-full z-10 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
              title="Remove from Archive">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
             <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             </div>
             <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300">Library is empty</h3>
             <p class="text-sm max-w-xs text-center mt-2 text-slate-500 dark:text-slate-400">Downloaded statuses will appear here safe and sound.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ArchiveComponent {
  statusService = inject(StatusService);
  
  searchQuery = signal('');
  filterType = signal<'all' | 'image' | 'video'>('all');

  filteredItems = computed(() => {
    let items = this.statusService.archivedStatuses();
    const query = this.searchQuery().toLowerCase();
    const type = this.filterType();

    if (query) {
      items = items.filter(i => i.contactName.toLowerCase().includes(query));
    }

    if (type !== 'all') {
      items = items.filter(i => i.type === type);
    }

    return items;
  });

  removeItem(id: string) {
    if(confirm('Are you sure you want to remove this from your archive?')) {
      this.statusService.removeFromArchive(id);
    }
  }

  noop() {} 
}
