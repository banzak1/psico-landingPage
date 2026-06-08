import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ContactLead } from '../../../../core/services/contact.service';
import { PatientService } from '../../../../core/services/patient.service';
import { SessionService, ClinicalSession } from '../../../../core/services/session.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private patientService = inject(PatientService);
  private sessionService = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  leads = signal<ContactLead[]>([]);
  todaySessions = signal<ClinicalSession[]>([]);
  activePatientsCount = signal<number>(0);
  monthlyRevenue = signal<number>(0);
  pendingReceivables = signal<number>(0);

  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    // Carregar Leads
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

    // Carregar Pacientes
    this.patientService.getPatients().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (patients) => {
        this.activePatientsCount.set(patients.filter(p => p.status === 'active').length);
      }
    });

    // Carregar Sessões e calcular KPIs
    this.sessionService.getSessions().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (sessions) => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let revenue = 0;
        let pending = 0;
        const todayList: ClinicalSession[] = [];

        sessions.forEach(session => {
          const sDate = new Date(session.date);
          const sDateStr = session.date.split('T')[0];

          // Sessões de Hoje
          if (sDateStr === todayStr) {
            todayList.push(session);
          }

          // Cálculos do Mês
          if (sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear) {
            if (session.status !== 'cancelled') {
              revenue += session.price;
              if (session.paymentStatus === 'pending') {
                pending += session.price;
              }
            }
          }
        });

        this.todaySessions.set(todayList);
        this.monthlyRevenue.set(revenue);
        this.pendingReceivables.set(pending);
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
