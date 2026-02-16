import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService } from '../services/status.service';
import { StatusCardComponent } from './status-card.component';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, StatusCardComponent],
  template: `
    <div class="w-full max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      
      <!-- Archive Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Your Library</h2>
          <p class="text-slate-500 text-sm mt-1">
            {{ statusService.totalArchived() }} items saved • {{ statusService.storageUsedMB() }} MB used
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative group">
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search..." 
              class="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
          
          <button class="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Archive Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        @for (item of statusService.archivedStatuses(); track item.id) {
          <div class="relative group">
            <app-status-card 
              [status]="item" 
              (onDownload)="noop()" 
            />
            <!-- Delete Action for Archive (Overlay override) -->
             <button 
              (click)="removeItem(item.id)"
              class="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove from Archive">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
             <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             </div>
             <h3 class="text-lg font-medium text-slate-700">No items saved yet</h3>
             <p class="text-sm max-w-md text-center mt-2">Downloaded statuses and stories will appear here for safekeeping.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
  `]
})
export class ArchiveComponent {
  statusService = inject(StatusService);

  removeItem(id: string) {
    if(confirm('Are you sure you want to remove this from your archive?')) {
      this.statusService.removeFromArchive(id);
    }
  }

  noop() {} // No-op for the card output event
}