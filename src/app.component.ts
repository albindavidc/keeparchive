
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar.component';
import { HeroComponent } from './components/hero.component';
import { DownloaderComponent } from './components/downloader.component';
import { ArchiveComponent } from './components/archive.component';
import { SettingsComponent } from './components/settings.component';
import { ToastComponent } from './components/toast.component';
import { fadeAnimation } from './animations';

type AppView = 'home' | 'archive' | 'settings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, DownloaderComponent, ArchiveComponent, SettingsComponent, ToastComponent],
  animations: [fadeAnimation],
  templateUrl: './app.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class AppComponent {
  currentView = signal<AppView>('home');
  showDownloader = signal(false);
  selectedPlatform = signal('WhatsApp');

  navigate(view: AppView) {
    this.currentView.set(view);
    
    // Smooth scroll to top
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  startDownloadFlow(platform: string) {
    this.selectedPlatform.set(platform.charAt(0).toUpperCase() + platform.slice(1));
    this.showDownloader.set(true);
    // Ensure we are in home view
    this.currentView.set('home');
    
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  closeDownloader() {
    this.showDownloader.set(false);
  }
}
