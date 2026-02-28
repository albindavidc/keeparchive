
import { Component, output, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../services/pwa.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="w-full h-16 glass border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer group" (click)="navigate.emit('home')">
        <span class="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hidden sm:block">
          KeepArchive
        </span>
      </div>

      <!-- Nav Links -->
      <div class="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-300">
        <button 
          (click)="navigate.emit('home')"
          class="px-3 sm:px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
          [class]="currentTab() === 'home' ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-600 dark:ring-indigo-500' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span class="hidden sm:block">Download</span>
        </button>
        <button 
          (click)="navigate.emit('archive')"
          class="px-3 sm:px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
          [class]="currentTab() === 'archive' ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-600 dark:ring-indigo-500' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
          <span class="hidden sm:block">Library</span>
        </button>
      </div>
      
      <!-- Right Side Actions -->
      <div class="flex items-center gap-3">
        
        <!-- Theme Toggle / PWA Install -->
        
        <!-- Desktop: Install PWA (if available) -->
        @if (pwaService.installable()) {
          <button 
            (click)="pwaService.promptInstall()"
            class="hidden md:flex w-10 h-10 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30 mr-2"
            title="Install App">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        }

        <!-- Desktop: Always Theme Toggle -->
        <button 
          (click)="toggleTheme.emit()"
          class="hidden md:flex w-10 h-10 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30">
          @if(isDarkMode()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          }
        </button>

        <!-- Mobile: Install PWA if available, else Theme Toggle -->
        <div class="md:hidden">
          @if (pwaService.installable()) {
            <button 
              (click)="pwaService.promptInstall()"
              class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          } @else {
            <button 
              (click)="toggleTheme.emit()"
              class="w-10 h-10 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30">
              @if(isDarkMode()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              }
            </button>
          }
        </div>

        <!-- Platform Dropdown -->
        <div class="relative">
          <button 
            (click)="toggleDropdown()"
            class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800/50 shadow-sm active:scale-95">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center" 
              [class.bg-emerald-100]="selectedPlatform() === 'WhatsApp'"
              [class.text-emerald-600]="selectedPlatform() === 'WhatsApp'"
              [class.bg-pink-100]="selectedPlatform() === 'Instagram'"
              [class.text-pink-600]="selectedPlatform() === 'Instagram'"
              [class.bg-blue-100]="selectedPlatform() === 'Facebook'"
              [class.text-blue-600]="selectedPlatform() === 'Facebook'"
              [class.dark:bg-emerald-900/30]="selectedPlatform() === 'WhatsApp'"
              [class.dark:text-emerald-400]="selectedPlatform() === 'WhatsApp'"
              [class.dark:bg-pink-900/30]="selectedPlatform() === 'Instagram'"
              [class.dark:text-pink-400]="selectedPlatform() === 'Instagram'"
              [class.dark:bg-blue-900/30]="selectedPlatform() === 'Facebook'"
              [class.dark:text-blue-400]="selectedPlatform() === 'Facebook'">
              @if(selectedPlatform() === 'WhatsApp') {
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              } @else if(selectedPlatform() === 'Instagram') {
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              }
            </div>
            <span class="hidden sm:inline">{{ selectedPlatform() }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 transition-transform duration-200" [class.rotate-180]="isDropdownOpen()"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          @if (isDropdownOpen()) {
            <div class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 py-2 z-[101] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div class="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Platform</div>
              
              <button (click)="selectPlatform('WhatsApp')" class="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors">
                <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                WhatsApp
                @if(selectedPlatform() === 'WhatsApp') {
                  <svg class="ml-auto text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                }
              </button>
              
              <button disabled class="w-full text-left px-4 py-3 text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed flex items-center gap-3 transition-colors opacity-75">
                <div class="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/10 text-pink-300 dark:text-pink-800/50 flex items-center justify-center grayscale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                Instagram
                <span class="ml-auto text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 px-2 py-0.5 rounded-full tracking-wide">SOON</span>
              </button>
              
              <button disabled class="w-full text-left px-4 py-3 text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed flex items-center gap-3 transition-colors opacity-75">
                <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-300 dark:text-blue-800/50 flex items-center justify-center grayscale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                Facebook
                <span class="ml-auto text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 px-2 py-0.5 rounded-full tracking-wide">SOON</span>
              </button>
            </div>
            <!-- Backdrop to close -->
            <div class="fixed inset-0 z-[100]" (click)="toggleDropdown()"></div>
          }
        </div>

        <!-- Settings -->
        <button 
          (click)="navigate.emit('settings')"
          [class.bg-slate-200]="currentTab() === 'settings'"
          [class.dark:bg-slate-700]="currentTab() === 'settings'"
          [class.text-indigo-600]="currentTab() === 'settings'"
          [class.dark:text-indigo-400]="currentTab() === 'settings'"
          class="w-10 h-10 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentTab = input.required<'home' | 'archive' | 'settings'>();
  isDarkMode = input<boolean>(false);
  navigate = output<'home' | 'archive' | 'settings'>();
  platformChange = output<string>();
  toggleTheme = output<void>();

  isDropdownOpen = signal(false);
  selectedPlatform = signal('WhatsApp');
  
  pwaService = inject(PwaService);

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  selectPlatform(platform: string) {
    this.selectedPlatform.set(platform);
    this.platformChange.emit(platform);
    this.isDropdownOpen.set(false);
  }
}
