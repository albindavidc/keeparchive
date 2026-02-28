
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeAnimation],
  template: `
    <div @fadeAnimation class="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center">
      <div class="relative mb-8">
        <div class="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 relative z-10 animate-[bounce_2s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
      </div>
      
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 tracking-tight">
        KeepArchive
      </h1>
      <p class="text-slate-400 font-medium tracking-wide text-sm uppercase">Your Memories, Local & Safe</p>
      
      <div class="absolute bottom-12 flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-xs text-slate-400">Loading v1.0.0...</p>
      </div>
    </div>
  `
})
export class SplashComponent {
  finished = output<void>();

  ngOnInit() {
    setTimeout(() => {
      this.finished.emit();
    }, 2500);
  }
}
