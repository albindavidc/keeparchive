
import { Component, signal, inject, computed, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService } from '../services/status.service';
import { StatusCardComponent } from './status-card.component';
import { staggerList, slideUp, fadeAnimation } from '../animations';

@Component({
  selector: 'app-downloader',
  standalone: true,
  imports: [CommonModule, StatusCardComponent],
  animations: [staggerList, slideUp, fadeAnimation],
  template: `
    <div class="w-full max-w-7xl mx-auto px-4 pb-20" @slideUp>
      
      <!-- Permission & Scan Section -->
      @if (!hasScanned()) {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8 max-w-2xl mx-auto text-center mt-8 transition-colors duration-300">
          
          <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-indigo-50/50 dark:ring-indigo-900/20 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><path d="M15 11h-3v3"></path></svg>
          </div>

          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            @if(statusService.isNativePlatform()) {
              Access Status Folder
            } @else if(statusService.hasStoredHandle()) {
              Restore Access
            } @else {
              System Permission Required
            }
          </h3>
          
          <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto text-base">
            @if(statusService.isNativePlatform()) {
              KeepArchive needs permission to read your WhatsApp status folder directly.
            } @else if(statusService.hasStoredHandle()) {
              Click below to grant read permission to the previously selected folder.
            } @else {
              KeepArchive needs you to manually locate the WhatsApp status folder to read files.
            }
          </p>

          <!-- Guide for new users (Web Only) -->
          @if(!statusService.isNativePlatform() && !statusService.hasStoredHandle()) {
            <div class="bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-5 text-left max-w-md mx-auto mb-8 transition-colors duration-300">
              <h4 class="font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Setup Instructions:
              </h4>
              
              <div class="bg-white dark:bg-slate-950 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm mb-4 transition-colors duration-300">
                <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">Browser Folder Picker</p>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">When prompted, navigate to:</p>
                <code class="block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-xs break-all transition-colors duration-300">
                  Android > media > com.whatsapp > WhatsApp > Media > .Statuses
                </code>
              </div>

              <div class="bg-indigo-100/50 dark:bg-indigo-900/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 transition-colors duration-300">
                <p class="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2 uppercase flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  File Manager (Android)
                </p>
                <p class="text-xs text-indigo-900/90 dark:text-indigo-300/90 leading-relaxed">
                  Open your file manager, enable <strong>"Show hidden files"</strong> in settings, and navigate to <code class="bg-white/50 dark:bg-black/20 px-1 rounded text-indigo-800 dark:text-indigo-300 font-bold">WhatsApp > Media > .Statuses</code> to find the files.
                </p>
              </div>
            </div>
          }
          
          <button 
            (click)="requestPermissionAndScan()"
            [disabled]="isScanning()"
            class="group relative inline-flex items-center justify-center px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-2xl overflow-hidden transition-all hover:bg-indigo-700 dark:hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 w-full sm:w-auto">
            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            @if (isScanning()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying Access...
            } @else {
              @if(statusService.isNativePlatform()) {
                Grant Permission
              } @else if(statusService.hasStoredHandle()) {
                Reconnect Folder
              } @else {
                Open System Picker
              }
            }
          </button>

          <!-- Reset Link (Web Only) -->
           @if(!statusService.isNativePlatform() && statusService.hasStoredHandle()) {
             <button (click)="fullReset()" class="block mx-auto mt-6 text-xs text-slate-400 hover:text-red-500 underline">
               Change Folder Location
             </button>
           }
        </div>
      }

      <!-- Results Section -->
      @if (hasScanned()) {
        <!-- Sticky Header Controls -->
        <div @fadeAnimation class="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-2xl border border-white/50 dark:border-slate-800 shadow-sm sticky top-2 z-30 ring-1 ring-slate-900/5 dark:ring-white/5 transition-colors duration-300">
          
          <!-- Counter (Left) -->
          <div class="px-2">
             <span class="text-slate-900 dark:text-white font-bold text-lg">{{ filteredStatuses().length }}</span>
             <span class="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1.5">items found</span>
          </div>
          
          <!-- Controls (Right) -->
          <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300 w-full sm:w-auto">
            <button 
              (click)="filterType.set('all')"
              [class]="filterType() === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'"
              class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200">
              All
            </button>
            <button 
              (click)="filterType.set('image')"
              [class]="filterType() === 'image' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'"
              class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200">
              Photos
            </button>
            <button 
              (click)="filterType.set('video')"
              [class]="filterType() === 'video' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'"
              class="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200">
              Videos
            </button>
          </div>
        </div>

        <!-- Grid -->
        <div [@staggerList]="filteredStatuses().length" class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 pb-24">
          @for (item of filteredStatuses(); track item.id) {
            <app-status-card 
              [status]="item" 
              (onDownload)="downloadItem($event)"
              (click)="viewItem(item)"
            />
          } @empty {
             <div class="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
               <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50 dark:ring-slate-800/50 transition-colors duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               </div>
               <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No {{ filterType() !== 'all' ? filterType() + 's' : 'files' }} found</h3>
               <p class="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                 We have access to the folder, but it appears empty. Ensure you have viewed some statuses in WhatsApp recently.
               </p>
               @if(!statusService.isNativePlatform()) {
                 <button (click)="fullReset()" class="mt-6 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-sm">Select Different Folder</button>
               }
             </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `]
})
export class DownloaderComponent {
  statusService = inject(StatusService);
  platformName = input<string>('WhatsApp');
  
  isScanning = signal(false);
  hasScanned = signal(false);
  filterType = signal<'all' | 'image' | 'video'>('all');

  constructor() {
    effect(() => {
      if (this.statusService.availableStatuses().length > 0) {
        this.hasScanned.set(true);
      }
    });
  }

  ngOnInit() {
    // Auto-scan if we have a stored handle and permission was previously granted
    if (this.statusService.hasStoredHandle() && this.statusService.hasPersistedPermission()) {
      this.requestPermissionAndScan();
    }
  }

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
      // Only set hasScanned if we actually got results or successfully tried
      // If native permission was denied, service shows toast, we don't necessarily show empty grid
      if (this.statusService.availableStatuses().length > 0 || this.statusService.isNativePlatform()) {
         this.hasScanned.set(true);
      }
    } catch (err) {
      // Error handling delegated to service/toast
    } finally {
      this.isScanning.set(false);
    }
  }

  async fullReset() {
    await this.statusService.resetPermission();
    this.reset();
  }

  onViewItem = output<any>();

  downloadItem(id: string) {
    this.statusService.toggleArchive(id);
  }

  viewItem(item: any) {
    this.onViewItem.emit(item);
  }

  reset() {
    this.hasScanned.set(false);
    this.statusService.clearAvailable();
    this.filterType.set('all');
  }
}
