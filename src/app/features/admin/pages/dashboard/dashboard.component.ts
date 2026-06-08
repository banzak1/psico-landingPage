import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ContactLead } from '../../../../core/services/contact.service';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private patientService = inject(PatientService);
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

  convertLeadToPatient(lead: ContactLead): void {
    if (!lead.id) return;

    this.isLoading.set(true);
    const newPatient = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      notes: `Convertido a partir de um contato do site. Mensagem original: "${lead.message}"`
    };

    this.patientService.addPatient(newPatient).subscribe({
      next: () => {
        this.adminService.markLeadAsConverted(lead.id!).subscribe({
          next: () => {
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Failed to mark lead as converted:', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Failed to convert lead:', err);
        this.isLoading.set(false);
      }
    });
  }
}
