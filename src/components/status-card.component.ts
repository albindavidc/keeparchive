
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusItem } from '../services/status.service';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <!-- Image/Content -->
       @if (status().type === 'video') {
         <video 
          [src]="status().thumbnailUrl" 
          class="object-cover w-full h-full"
          muted
          loop
          onmouseover="this.play()"
          onmouseout="this.pause()"
         ></video>
       } @else {
        <img 
          [src]="status().thumbnailUrl" 
          [alt]="status().contactName"
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
       }
      
      <!-- Type Indicator Badge -->
      @if (status().type === 'video') {
        <div class="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      }

      <!-- Overlay (Visible on Hover) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        
        <div class="text-white mb-3">
          <h3 class="font-semibold text-xs truncate w-full" [title]="status().contactName">{{ status().contactName }}</h3>
          <p class="text-xs text-slate-300">{{ status().timestamp | date:'shortDate' }}</p>
        </div>

        <div class="flex gap-2">
          @if (!status().isArchived) {
            <button 
              (click)="onDownload.emit(status().id); $event.stopPropagation()"
              class="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Save
            </button>
          } @else {
            <div class="flex-1 bg-emerald-500 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Saved
            </div>
          }
        </div>
      </div>
      
      <!-- Already Saved Indicator (Top Left) -->
      @if (status().isArchived) {
        <div class="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">
          SAVED
        </div>
      }
    </div>
  `
})
export class StatusCardComponent {
  status = input.required<StatusItem>();
  onDownload = output<string>();
}
