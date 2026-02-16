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
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentView = signal<AppView>('home');
  showDownloader = signal(false);

  navigate(view: AppView) {
    this.currentView.set(view);
    // Reset downloader visibility when navigating away and back to home effectively
    if (view === 'archive') {
      this.showDownloader.set(false);
    }
  }

  startDownloadFlow() {
    this.showDownloader.set(true);
    // Smooth scroll to downloader section if needed, though here we just swap the hero
  }
}