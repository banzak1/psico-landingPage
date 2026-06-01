import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ContactLead } from '../../core/services/contact.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  leads = signal<ContactLead[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  userProfile$ = this.authService.userProfile$;

  ngOnInit(): void {
    this.adminService.getLeads().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.leads.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load leads:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}
