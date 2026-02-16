
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          [@toastTrigger]
          class="pointer-events-auto min-w-[300px] max-w-sm rounded-xl shadow-lg border p-4 flex items-center gap-3 bg-white"
          [ngClass]="{
            'border-emerald-100 bg-emerald-50': toast.type === 'success',
            'border-red-100 bg-red-50': toast.type === 'error',
            'border-indigo-100 bg-indigo-50': toast.type === 'info'
          }"
        >
          <!-- Icon -->
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            [ngClass]="{
              'bg-emerald-100 text-emerald-600': toast.type === 'success',
              'bg-red-100 text-red-600': toast.type === 'error',
              'bg-indigo-100 text-indigo-600': toast.type === 'info'
            }"
          >
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            } @else if (toast.type === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            }
          </div>
          
          <div class="flex-1">
            <p class="text-sm font-medium" [ngClass]="{
              'text-emerald-900': toast.type === 'success',
              'text-red-900': toast.type === 'error',
              'text-indigo-900': toast.type === 'info'
            }">{{ toast.message }}</p>
          </div>

          <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
