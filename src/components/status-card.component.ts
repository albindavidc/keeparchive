
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusItem } from '../services/status.service';
import { cardAnimation } from '../animations';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  animations: [cardAnimation],
  template: `
    <div 
      class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer transition-all duration-300 ring-2 ring-transparent"
      [class.ring-indigo-500]="status().selected"
      [@cardAnimation]="isHovered() ? 'hovered' : 'initial'"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      <!-- Media Content -->
       @if (status().type === 'video') {
         <video 
          [src]="status().thumbnailUrl" 
          class="object-cover w-full h-full transform transition-transform duration-700 will-change-transform"
          [class.scale-105]="isHovered()"
          muted
          loop
          playsinline
          onmouseover="this.play()"
          onmouseout="this.pause()"
         ></video>
       } @else {
        <img 
          [src]="status().thumbnailUrl" 
          [alt]="status().contactName"
          class="object-cover w-full h-full transform transition-transform duration-700 will-change-transform"
          [class.scale-105]="isHovered()"
          loading="lazy"
        />
       }
      
      <!-- Video Indicator (Top Left) -->
      @if (status().type === 'video') {
        <div class="absolute top-3 left-3 z-20 pointer-events-none">
          <div class="bg-black/40 backdrop-blur-md text-white p-1.5 md:p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
      }

      <!-- Saved Indicator (Top Right) -->
      @if (status().isArchived) {
        <div class="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          SAVED
        </div>
      }

      <!-- Mobile Download FAB (Bottom Right) -->
      @if (!status().isArchived) {
        <button 
          (click)="onDownload.emit(status().id); $event.stopPropagation()"
          class="md:hidden absolute bottom-3 right-3 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-30 active:scale-95 transition-transform"
          aria-label="Download">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      } @else {
        <div class="md:hidden absolute bottom-3 right-3 bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-30">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      }

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none md:pointer-events-auto">
        
        <!-- File Info -->
        <div class="text-white mb-1 md:mb-3 hidden md:block">
          <h3 class="font-medium text-xs truncate w-full opacity-90" [title]="status().contactName">{{ status().contactName }}</h3>
          <div class="flex items-center gap-2 text-[10px] text-slate-300 mt-1">
             <span>{{ status().timestamp | date:'MMM d' }}</span>
             <span>•</span>
             <span>{{ (status().size / 1024).toFixed(0) }} KB</span>
          </div>
        </div>

        <!-- Action Buttons (Desktop Only) -->
        <div class="hidden md:flex gap-2">
          @if (!status().isArchived) {
            <button 
              (click)="onDownload.emit(status().id); $event.stopPropagation()"
              class="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer pointer-events-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Save
            </button>
          } @else {
            <button class="flex-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 text-emerald-100 py-2.5 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-default pointer-events-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              In Library
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class StatusCardComponent {
  status = input.required<StatusItem>();
  onDownload = output<string>();
  isHovered = signal(false);
}
