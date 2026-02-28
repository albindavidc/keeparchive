
import { Component, signal, inject } from '@angular/core';
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
      <div class="flex flex-col h-full bg-slate-50 relative overflow-hidden text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        
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
        <div class="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div class="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <!-- Navbar -->
        <app-navbar 
          [currentTab]="currentView()" 
          (navigate)="navigate($event)"
          (platformChange)="startDownloadFlow($event)"
        ></app-navbar>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto relative z-10 scroll-smooth">
          
          <div [@fadeAnimation]="currentView()" class="min-h-full">
            
            @switch (currentView()) {
              @case ('home') {
                 <div class="flex flex-col min-h-[calc(100vh-4rem)]">
                    <!-- Compact Header when downloader is active -->
                    <div @fadeAnimation class="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 py-3 shadow-sm">
                       <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
                         <div class="flex items-center gap-2">
                           <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-emerald-200 shadow-lg"></span>
                           <h2 class="text-sm font-bold text-slate-800">{{ selectedPlatform() }} Downloader</h2>
                         </div>
                       </div>
                    </div>
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
            <footer class="py-8 text-center text-slate-400 text-sm mt-auto border-t border-slate-100 bg-white/50">
              <div class="flex items-center justify-center gap-2 mb-2">
                 <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                 <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                 <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              </div>
              <p>&copy; 2026 KeepArchive. Your memories, secure & local.</p>
            </footer>
            
          </div>

        </main>
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
}
