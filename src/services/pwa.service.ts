
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  installable = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if already in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (isStandalone) {
        this.installable.set(false);
      }

      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.installable.set(true);
        console.log('beforeinstallprompt fired');
      });

      window.addEventListener('appinstalled', () => {
        // Log install to analytics
        console.log('PWA was installed');
        this.installable.set(false);
        this.deferredPrompt = null;
      });
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
        return;
    }
    
    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    this.deferredPrompt = null;
    this.installable.set(false);
  }
}
