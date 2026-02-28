
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideUp } from '../animations';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  animations: [slideUp],
  template: `
    <div @slideUp class="w-full max-w-2xl mx-auto px-4 py-8 pb-20">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h2>

      <!-- Preferences Section -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-6 transition-colors duration-300">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">General</h3>
        </div>
        
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
          <div class="flex items-center justify-between p-6">
             <div>
               <p class="font-medium text-slate-900 dark:text-white">Auto-save to Gallery</p>
               <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatically save downloaded items to device gallery</p>
             </div>
             <button 
                (click)="toggleSetting('autosave')"
                [class.bg-indigo-600]="settings.autosave" 
                [class.bg-slate-200]="!settings.autosave"
                [class.dark:bg-indigo-500]="settings.autosave"
                [class.dark:bg-slate-700]="!settings.autosave"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
               <span 
                [class.translate-x-5]="settings.autosave"
                [class.translate-x-0]="!settings.autosave"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
             </button>
          </div>

          <div class="flex items-center justify-between p-6">
             <div>
               <p class="font-medium text-slate-900 dark:text-white">High Quality Downloads</p>
               <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Always save media in original resolution</p>
             </div>
             <button 
                (click)="toggleSetting('highQuality')"
                [class.bg-indigo-600]="settings.highQuality" 
                [class.bg-slate-200]="!settings.highQuality"
                [class.dark:bg-indigo-500]="settings.highQuality"
                [class.dark:bg-slate-700]="!settings.highQuality"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
               <span 
                [class.translate-x-5]="settings.highQuality"
                [class.translate-x-0]="!settings.highQuality"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
             </button>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">About</h3>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">KeepArchive</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">Version 1.0.0 (Beta)</p>
            </div>
          </div>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            KeepArchive allows you to save and organize temporary social media statuses locally. 
            All data stays on your device and is never uploaded to any server.
          </p>
          <div class="flex gap-4 mt-6">
             <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium hover:underline">Privacy Policy</a>
             <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  toast = inject(ToastService);
  
  // Mock settings state
  settings = {
    autosave: true,
    highQuality: true
  };

  toggleSetting(key: 'autosave' | 'highQuality') {
    this.settings[key] = !this.settings[key];
    this.toast.show('Settings updated', 'success', 2000);
  }
}
