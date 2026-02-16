import { Component, output } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="w-full flex flex-col items-center justify-center py-16 px-4 text-center max-w-4xl mx-auto animate-fade-in-up">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-6 border border-indigo-100">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        New: Instagram Support Coming Soon
      </div>
      
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
        Save the moments that <br />
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">matter most.</span>
      </h1>
      
      <p class="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        KeepArchive helps you download and organize stories and statuses from your favorite social platforms instantly. Secure, private, and high quality.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          (click)="onStart.emit()"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
          Start Downloading
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
        
        <button class="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
          Learn How It Works
        </button>
      </div>

      <!-- Social Proof -->
      <div class="mt-12 flex items-center gap-8 text-slate-400 grayscale opacity-60">
        <!-- Mock Logos -->
        <span class="font-bold text-xl flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> WhatsApp</span>
        <span class="font-bold text-xl flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram</span>
        <span class="font-bold text-xl flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> Facebook</span>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
  `]
})
export class HeroComponent {
  onStart = output<void>();
}