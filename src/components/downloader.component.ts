import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusService } from '../services/status.service';
import { StatusCardComponent } from './status-card.component';

@Component({
  selector: 'app-downloader',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusCardComponent],
  template: `
    <div class="w-full max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      
      <!-- Input Section -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 max-w-2xl mx-auto">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Paste Status Link or Phone Number
        </label>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <input 
              type="text" 
              [(ngModel)]="inputValue"
              (keyup.enter)="startScan()"
              placeholder="e.g. https://wa.me/status/..."
              class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm" 
            />
          </div>
          <button 
            (click)="startScan()"
            [disabled]="isLoading() || !inputValue()"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            } @else {
              Find Status
            }
          </button>
        </div>
        <p class="mt-2 text-xs text-slate-500">
          <span class="text-indigo-600 font-medium">Tip:</span> Make sure you have viewed the status in WhatsApp first.
        </p>
      </div>

      <!-- Results Section -->
      @if (hasSearched()) {
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800">Available Statuses</h2>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-100">All</button>
            <button class="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Photos</button>
            <button class="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Videos</button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          @for (item of statusService.availableStatuses(); track item.id) {
            <app-status-card 
              [status]="item" 
              (onDownload)="downloadItem($event)"
            />
          } @empty {
             <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
               <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               </div>
               <p class="text-lg font-medium text-slate-600">No statuses found</p>
               <p class="text-sm">Try checking the link or viewing the status again.</p>
             </div>
          }
        </div>
      }
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
export class DownloaderComponent {
  statusService = inject(StatusService);
  
  inputValue = signal('');
  isLoading = signal(false);
  hasSearched = signal(false);

  async startScan() {
    if (!this.inputValue()) return;
    
    this.isLoading.set(true);
    this.hasSearched.set(true); // Show results area immediately or after? After is better UX typically, but skeleton is nice.
    
    try {
      await this.statusService.scanForStatuses(this.inputValue());
    } finally {
      this.isLoading.set(false);
    }
  }

  downloadItem(id: string) {
    this.statusService.toggleArchive(id);
    // Add toast notification logic here in real app
  }
}