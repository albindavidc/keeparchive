import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
  ]
}).catch(err => console.error(err));
