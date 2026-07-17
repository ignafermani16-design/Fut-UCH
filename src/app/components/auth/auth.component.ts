import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-73px)] p-4 bg-zinc-950">
      <div class="w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-white">
            {{ isLogin ? 'Inicia Sesión' : 'Crea una cuenta' }}
          </h2>
          <p class="mt-2 text-sm text-zinc-400">
            {{ isLogin ? 'Bienvenido de nuevo a Fever Stats' : 'Únete a Fever Stats hoy' }}
          </p>
        </div>

        <form class="space-y-6" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-zinc-300">Correo Electrónico</label>
              <input id="email" name="email" type="email" autocomplete="email" required [(ngModel)]="email"
                class="w-full px-4 py-3 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="tu@email.com">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-zinc-300">Contraseña</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                class="w-full px-4 py-3 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••">
            </div>
          </div>

          <div *ngIf="errorMessage" class="p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-lg">
            {{ errorMessage }}
          </div>

          <div>
            <button type="submit" [disabled]="isLoading"
              class="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg group hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50">
              <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-indigo-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLogin ? 'Ingresar' : 'Registrarse' }}
            </button>
          </div>
        </form>
        <div class="text-center">
          <button (click)="toggleMode()" class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  isLoading = false;
  email = '';
  password = '';
  errorMessage = '';

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  async onSubmit() {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isLogin) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }
      this.router.navigate(['/mis-predicciones']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Ha ocurrido un error.';
    } finally {
      this.isLoading = false;
    }
  }
}
