
import { Component, input, output, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusItem } from '../services/status.service';
import { fadeAnimation, slideUp } from '../animations';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeAnimation, slideUp],
  template: `
    <div @fadeAnimation class="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-4 text-white z-10">
        <div class="flex items-center gap-3">
          <button (click)="close.emit()" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <h3 class="font-semibold text-sm">{{ status().contactName }}</h3>
            <p class="text-xs text-white/60">{{ status().timestamp | date:'medium' }}</p>
          </div>
        </div>
        
        <!-- Top Actions -->
        <div class="flex gap-2">
          <button class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex items-center justify-center p-4 relative overflow-hidden" (click)="toggleControls()">
        @if (status().type === 'video') {
          <video 
            #videoPlayer
            [src]="status().contentUrl" 
            class="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            autoplay
            controls
            playsinline
          ></video>
        } @else {
          <img 
            [src]="status().contentUrl" 
            class="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            alt="Status"
          />
        }
      </div>

      <!-- Bottom Actions Bar -->
      <div @slideUp class="bg-black/50 backdrop-blur-md border-t border-white/10 p-6 pb-8 z-10">
        <div class="flex items-center justify-center gap-6 max-w-md mx-auto">
          
          <!-- Save Button -->
          <button 
            (click)="onDownload.emit(status().id)"
            class="flex flex-col items-center gap-2 group">
            <div class="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white transition-all group-active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <span class="text-xs font-medium text-white/80">Save</span>
          </button>

          <!-- Share to WhatsApp -->
          <button 
            (click)="shareToWhatsApp()"
            class="flex flex-col items-center gap-2 group">
            <div class="w-14 h-14 rounded-full bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-all group-active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <span class="text-xs font-medium text-white">Repost</span>
          </button>

          <!-- Native Share -->
          <button 
            (click)="nativeShare()"
            class="flex flex-col items-center gap-2 group">
            <div class="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white transition-all group-active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </div>
            <span class="text-xs font-medium text-white/80">Share</span>
          </button>

        </div>
      </div>
    </div>
  `
})
export class MediaViewerComponent {
  status = input.required<StatusItem>();
  close = output<void>();
  onDownload = output<string>();
  
  videoPlayer = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  showControls = signal(true);

  constructor() {
    effect(() => {
      const video = this.videoPlayer()?.nativeElement;
      if (video && this.status().type === 'video') {
        video.play().catch(e => console.log('Autoplay prevented', e));
      }
    });
  }

  toggleControls() {
    this.showControls.update(v => !v);
  }

  async shareToWhatsApp() {
    // In a real app, this would use the Web Share API or Capacitor Share plugin
    // specifically targeting WhatsApp package if possible, or generic share
    if (navigator.share) {
      try {
        const blob = await fetch(this.status().contentUrl).then(r => r.blob());
        const file = new File([blob], `status.${this.status().type === 'video' ? 'mp4' : 'jpg'}`, { type: blob.type });
        
        await navigator.share({
          files: [file],
          title: 'Share Status',
          text: 'Shared via KeepArchive'
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      alert('Sharing is not supported on this browser/device.');
    }
  }

  async nativeShare() {
     if (navigator.share) {
      try {
        const blob = await fetch(this.status().contentUrl).then(r => r.blob());
        const file = new File([blob], `status.${this.status().type === 'video' ? 'mp4' : 'jpg'}`, { type: blob.type });
        
        await navigator.share({
          files: [file],
          title: 'Share Status',
          text: 'Check out this status!'
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      alert('Sharing is not supported on this browser/device.');
    }
  }
}
