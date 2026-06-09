import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
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
  netRevenue = signal<number>(0);
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

    // Carregar Pacientes e Sessões juntos para cálculo financeiro
    combineLatest([
      this.patientService.getPatients(),
      this.sessionService.getSessions()
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ([patients, sessions]) => {
        this.activePatientsCount.set(patients.filter(p => p.status === 'active').length);

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let grossRevenue = 0;
        let netRev = 0;
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
              grossRevenue += session.price;
              
              const patient = patients.find(p => p.id === session.patientId);
              const clinicPercent = patient?.clinicPercentage || 0;
              const clinicCut = session.price * (clinicPercent / 100);
              netRev += (session.price - clinicCut);

              if (session.paymentStatus === 'pending') {
                pending += session.price;
              }
            }
          }
        });

        // Adicionar pacotes vendidos neste mês ao faturamento
        patients.forEach(p => {
          if (p.activePackage) {
            const pDate = new Date(p.activePackage.createdAt);
            if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
              grossRevenue += p.activePackage.totalValue;
              const clinicCut = p.activePackage.totalValue * ((p.clinicPercentage || 0) / 100);
              netRev += (p.activePackage.totalValue - clinicCut);
            }
          }
        });

        this.todaySessions.set(todayList);
        this.monthlyRevenue.set(grossRevenue);
        this.netRevenue.set(netRev);
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
