import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ContactLead } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);

  leads = signal<ContactLead[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

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
}
