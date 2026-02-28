
import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar.component';
import { DownloaderComponent } from './components/downloader.component';
import { ArchiveComponent } from './components/archive.component';
import { SettingsComponent } from './components/settings.component';
import { ToastComponent } from './components/toast.component';
import { SplashComponent } from './components/splash.component';
import { MediaViewerComponent } from './components/media-viewer.component';
import { fadeAnimation } from './animations';
import { StatusItem, StatusService } from './services/status.service';

type AppView = 'home' | 'archive' | 'settings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    DownloaderComponent, 
    ArchiveComponent, 
    SettingsComponent, 
    ToastComponent,
    SplashComponent,
    MediaViewerComponent
  ],
  animations: [fadeAnimation],
  template: `
    @if (showSplash()) {
      <app-splash (finished)="onSplashFinished()" />
    } @else {
      <div class="h-full">
        <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
          
          <!-- Global Toasts -->
          <app-toast />

          <!-- Media Viewer Overlay -->
          @if (viewingItem()) {
            <app-media-viewer 
              [status]="viewingItem()!" 
              (close)="closeViewer()"
              (onDownload)="downloadFromViewer($event)"
            />
          }

          <!-- Background Ambient Elements -->
          <div class="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0 transition-colors duration-500"></div>
          <div class="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0 transition-colors duration-500"></div>

          <!-- Navbar -->
          <app-navbar 
            [currentTab]="currentView()" 
            [isDarkMode]="isDarkMode()"
            (navigate)="navigate($event)"
            (platformChange)="startDownloadFlow($event)"
            (toggleTheme)="toggleTheme()"
          ></app-navbar>

          <!-- Main Content Area -->
          <main class="flex-1 overflow-y-auto relative z-10 scroll-smooth">
            
            <div [@fadeAnimation]="currentView()" class="min-h-full">
              
              @switch (currentView()) {
                @case ('home') {
                   <div class="flex flex-col min-h-[calc(100vh-4rem)] pt-6">
                      <app-downloader 
                        [platformName]="selectedPlatform()"
                        (onViewItem)="openViewer($event)"
                      ></app-downloader>
                   </div>
                }
                @case ('archive') {
                  <app-archive></app-archive>
                }
                @case ('settings') {
                  <app-settings></app-settings>
                }
              }

              <!-- Footer -->
              <footer class="py-8 text-center text-slate-400 dark:text-slate-600 text-sm mt-auto border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors duration-300">
                <div class="flex items-center justify-center gap-2 mb-2">
                   <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                   <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                   <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                </div>
                <p>&copy; 2026 Archive. Your memories, secure & local.</p>
              </footer>
              
            </div>

          </main>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class AppComponent {
  statusService = inject(StatusService);
  currentView = signal<AppView>('home');
  selectedPlatform = signal('WhatsApp');
  showSplash = signal(true);
  viewingItem = signal<StatusItem | null>(null);
  isDarkMode = signal(true);

  constructor() {
    // Check system preference initially, but default to true if no preference or if dark is preferred
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // We want dark mode by default, so we only set to false if user explicitly prefers light? 
    // Or just default to true as requested.
    // The user asked "make dark theme as default".
    
    // Let's initialize based on localStorage if available, otherwise default to true.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(true);
    }

    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  onSplashFinished() {
    this.showSplash.set(false);
  }

  navigate(view: AppView) {
    this.currentView.set(view);
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  startDownloadFlow(platform: string) {
    this.selectedPlatform.set(platform.charAt(0).toUpperCase() + platform.slice(1));
    this.currentView.set('home');
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openViewer(item: StatusItem) {
    this.viewingItem.set(item);
  }

  closeViewer() {
    this.viewingItem.set(null);
  }

  downloadFromViewer(id: string) {
    this.statusService.toggleArchive(id);
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}
