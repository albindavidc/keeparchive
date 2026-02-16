
import { Component, signal, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService } from '../services/status.service';
import { StatusCardComponent } from './status-card.component';

@Component({
  selector: 'app-downloader',
  standalone: true,
  imports: [CommonModule, StatusCardComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto px-4 pb-20 animate-fade-in">
      
      <!-- Permission & Scan Section -->
      @if (!hasScanned()) {
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 max-w-2xl mx-auto text-center mt-6">
          
          <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>

          <h3 class="text-2xl font-bold text-slate-900 mb-3">Select Status Folder</h3>
          <p class="text-slate-600 mb-6 leading-relaxed max-w-md mx-auto text-base">
            Due to browser security, you must manually select the WhatsApp Status folder to view files.
          </p>

          <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left max-w-md mx-auto mb-8 text-sm text-amber-800">
            <p class="font-bold mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              How to find it:
            </p>
            <ol class="list-decimal list-inside space-y-1 ml-1 opacity-90">
              <li>Tap <strong>Select Folder</strong> below.</li>
              <li>Navigate to <strong>Android > media > com.whatsapp > WhatsApp > Media</strong>.</li>
              <li>Select <strong>.Statuses</strong> (You may need to enable "Show Hidden Files" in your file manager settings first).</li>
            </ol>
            <p class="mt-3 text-xs opacity-75">
              *Note: If you can't find .Statuses, you can select any folder with images to test functionality.
            </p>
          </div>
          
          <button 
            (click)="requestPermissionAndScan()"
            [disabled]="isScanning()"
            class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200">
            @if (isScanning()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            } @else {
              Select Folder & Scan
            }
          </button>
        </div>
      }

      <!-- Results Section -->
      @if (hasScanned()) {
        <div class="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm sticky top-0 z-30">
          
          <!-- Title & Counter -->
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
             </div>
             <div>
               <h2 class="text-lg font-bold text-slate-800 leading-none">Found Statuses</h2>
               <p class="text-xs text-slate-500 mt-1">{{ filteredStatuses().length }} items found</p>
             </div>
          </div>
          
          <!-- Tabs & Actions -->
          <div class="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            
            <!-- Filter Tabs -->
            <div class="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button 
                (click)="filterType.set('all')"
                [class]="filterType() === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">
                All
              </button>
              <button 
                (click)="filterType.set('image')"
                [class]="filterType() === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1">
                Photos
              </button>
              <button 
                (click)="filterType.set('video')"
                [class]="filterType() === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1">
                Videos
              </button>
            </div>

            <div class="w-px h-8 bg-slate-200 hidden md:block"></div>

            <button (click)="reset()" class="text-sm text-slate-500 hover:text-red-600 font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors">
              Reset
            </button>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in pb-20">
          @for (item of filteredStatuses(); track item.id) {
            <app-status-card 
              [status]="item" 
              (onDownload)="downloadItem($event)"
            />
          } @empty {
             <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
               <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               </div>
               <p class="text-lg font-medium text-slate-600">No {{ filterType() !== 'all' ? filterType() + 's' : 'files' }} found</p>
               <p class="text-sm text-center max-w-xs text-slate-400 mt-2">
                 We couldn't find any media files in the folder you selected. Please try selecting a different folder containing images or videos.
               </p>
             </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `]
})
export class DownloaderComponent {
  statusService = inject(StatusService);
  platformName = input<string>('WhatsApp');
  
  isScanning = signal(false);
  hasScanned = signal(false);
  
  // Tab Filter State
  filterType = signal<'all' | 'image' | 'video'>('all');

  // Computed Filtered List
  filteredStatuses = computed(() => {
    const all = this.statusService.availableStatuses();
    const type = this.filterType();
    
    if (type === 'all') return all;
    return all.filter(item => item.type === type);
  });

  async requestPermissionAndScan() {
    this.isScanning.set(true);
    
    try {
      await this.statusService.scanLocalDevice();
      this.hasScanned.set(true);
    } catch (err) {
      // Error handled in service (e.g., cancelled)
    } finally {
      this.isScanning.set(false);
    }
  }

  downloadItem(id: string) {
    this.statusService.toggleArchive(id);
  }

  reset() {
    this.hasScanned.set(false);
    this.statusService.clearAvailable();
    this.filterType.set('all');
  }
}
