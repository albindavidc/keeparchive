
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
    <div @fadeAnimation class="fixed inset-0 z-[60] bg-black flex flex-col">
      
      <!-- Floating Close Button -->
      <button (click)="close.emit()" class="absolute top-4 left-4 z-50 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <!-- Main Content -->
      <div class="flex-1 flex items-center justify-center relative overflow-hidden w-full h-full" (click)="toggleControls()">
        @if (status().type === 'video') {
          <video 
            #videoPlayer
            [src]="status().contentUrl" 
            class="w-full h-full object-contain"
            autoplay
            controls
            playsinline
          ></video>
        } @else {
          <img 
            [src]="status().contentUrl" 
            class="w-full h-full object-contain"
            alt="Status"
          />
        }
      </div>

      <!-- Bottom Actions Bar (Toggleable) -->
      @if (showControls()) {
        <div @slideUp class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-8 z-40">
          <div class="flex items-center justify-center gap-8 max-w-md mx-auto">
            
            <!-- Save Button -->
            <button 
              (click)="onDownload.emit(status().id); $event.stopPropagation()"
              class="flex flex-col items-center gap-2 group min-w-[64px]">
              <div class="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white transition-all group-active:scale-95 ring-1 ring-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <span class="text-xs font-medium text-white/90 shadow-black drop-shadow-md">Save</span>
            </button>
  
            <!-- Share to WhatsApp -->
            <button 
              (click)="shareToWhatsApp(); $event.stopPropagation()"
              class="flex flex-col items-center gap-2 group min-w-[64px]">
              <div class="w-14 h-14 rounded-full bg-[#25D366] group-hover:bg-[#20bd5a] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 transition-all group-active:scale-95 ring-2 ring-[#25D366]/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <span class="text-xs font-medium text-white shadow-black drop-shadow-md">WhatsApp</span>
            </button>
  
            <!-- Native Share -->
            <button 
              (click)="nativeShare(); $event.stopPropagation()"
              class="flex flex-col items-center gap-2 group min-w-[64px]">
              <div class="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white transition-all group-active:scale-95 ring-1 ring-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <span class="text-xs font-medium text-white/90 shadow-black drop-shadow-md">Share</span>
            </button>
  
          </div>
        </div>
      }
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
          text: 'Shared via Archive'
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
