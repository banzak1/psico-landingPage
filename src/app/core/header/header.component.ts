import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMenuOpen = false;
  isLoggingIn = false;
  loginError = '';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  login() {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;
    this.loginError = '';
    this.authService.loginWithGoogle()
      .then(() => {
        console.log('[Header] Login bem-sucedido');
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : String(error);
        this.loginError = msg.includes('popup')
          ? 'Popup bloqueado. Permita popups e tente novamente.'
          : 'Erro ao fazer login. Tente novamente mais tarde.';
      })
      .finally(() => {
        this.isLoggingIn = false;
      });
  }

  async logout() {
    await this.authService.logout();
    this.closeMenu();
  }
}
