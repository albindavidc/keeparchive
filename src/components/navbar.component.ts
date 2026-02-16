import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="w-full h-16 glass border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8">
      <div class="flex items-center gap-2 cursor-pointer" (click)="navigate.emit('home')">
        <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <span class="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          KeepArchive
        </span>
      </div>

      <div class="flex gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200">
        <button 
          (click)="navigate.emit('home')"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          [class]="currentTab() === 'home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
          Download
        </button>
        <button 
          (click)="navigate.emit('archive')"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
          [class]="currentTab() === 'archive' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
          Archive
        </button>
      </div>
      
      <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentTab = input.required<'home' | 'archive'>();
  navigate = output<'home' | 'archive'>();
}