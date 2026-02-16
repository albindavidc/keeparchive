
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar.component';
import { HeroComponent } from './components/hero.component';
import { DownloaderComponent } from './components/downloader.component';
import { ArchiveComponent } from './components/archive.component';

type AppView = 'home' | 'archive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, DownloaderComponent, ArchiveComponent],
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
    // Reset downloader visibility when navigating away and back to home effectively
    if (view === 'archive') {
      this.showDownloader.set(false);
    }
  }

  startDownloadFlow(platform: string) {
    this.selectedPlatform.set(platform.charAt(0).toUpperCase() + platform.slice(1));
    this.showDownloader.set(true);
    
    // Scroll to top
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
