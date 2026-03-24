import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  async login() {
    try {
      await this.authService.loginWithGoogle();
      this.closeMenu();
    } catch (error) {
      console.error('Erro de login:', error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.closeMenu();
  }
}
