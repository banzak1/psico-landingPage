import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SessionService, ClinicalSession } from '../../../../core/services/session.service';
import { PatientService, Patient } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit {
  private sessionService = inject(SessionService);
  private patientService = inject(PatientService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  sessions = signal<ClinicalSession[]>([]);
  patients = signal<Patient[]>([]);
  
  isLoading = signal(true);
  isSaving = signal(false);

  viewMode = signal<'list' | 'form'>('list');
  editingSessionId = signal<string | null>(null);

  sessionForm = this.fb.group({
    patientId: ['', Validators.required],
    date: ['', Validators.required],
    duration: [50, [Validators.required, Validators.min(1)]],
    price: [150, [Validators.required, Validators.min(0)]],
    status: ['scheduled' as ClinicalSession['status'], Validators.required],
    paymentStatus: ['pending' as ClinicalSession['paymentStatus'], Validators.required],
    usePackage: [false],
    notes: ['']
  });

  get selectedPatient(): Patient | undefined {
    const id = this.sessionForm.get('patientId')?.value;
    return this.patients().find(p => p.id === id);
  }

  get activePackageInfo() {
    const p = this.selectedPatient;
    if (p?.activePackage && p.activePackage.usedSessions < p.activePackage.totalSessions) {
      return p.activePackage;
    }
    return null;
  }

  ngOnInit(): void {
    // Load sessions
    this.sessionService.getSessions().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.sessions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load sessions', err);
        this.isLoading.set(false);
      }
    });

    // Load active patients for dropdown
    this.patientService.getPatients().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.patients.set(data.filter(p => p.status === 'active'));
      },
      error: (err) => console.error('Failed to load patients for dropdown', err)
    });
  }

  openNewForm(): void {
    // Definir default para o agendamento (hora atual + 1h, arredondado)
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const localDateStr = now.toISOString().slice(0, 16);

    this.sessionForm.reset({ 
      status: 'scheduled', 
      paymentStatus: 'pending',
      duration: 50,
      price: 150,
      date: localDateStr
    });
    this.editingSessionId.set(null);
    this.viewMode.set('form');
  }

  openEditForm(session: ClinicalSession): void {
    this.sessionForm.patchValue({
      patientId: session.patientId,
      date: session.date,
      duration: session.duration,
      price: session.price,
      status: session.status,
      paymentStatus: session.paymentStatus,
      notes: session.notes || ''
    });
    this.editingSessionId.set(session.id || null);
    this.viewMode.set('form');
  }

  cancelForm(): void {
    this.viewMode.set('list');
  }

  saveSession(): void {
    if (this.sessionForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.sessionForm.value;
    
    const selectedPatient = this.patients().find(p => p.id === formValue.patientId);
    if (!selectedPatient) {
      this.isSaving.set(false);
      return;
    }

    const sessionData: Omit<ClinicalSession, 'id'> = {
      patientId: formValue.patientId!,
      patientName: selectedPatient.name,
      date: formValue.date!,
      duration: formValue.duration || 50,
      price: formValue.price || 0,
      status: formValue.status as ClinicalSession['status'],
      paymentStatus: formValue.paymentStatus as ClinicalSession['paymentStatus'],
      isPackageSession: formValue.usePackage || false,
      notes: formValue.notes || ''
    };

    if (sessionData.isPackageSession) {
      sessionData.price = 0; // Se abater do pacote, não tem preço na sessão individual
      sessionData.paymentStatus = 'paid';
    }

    const id = this.editingSessionId();
    if (id) {
      this.sessionService.updateSession(id, sessionData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.viewMode.set('list');
        },
        error: (err) => {
          console.error('Update failed', err);
          this.isSaving.set(false);
        }
      });
    } else {
      this.sessionService.addSession(sessionData).subscribe({
        next: () => {
          // Atualiza o contador do pacote no paciente, se usou pacote
          if (sessionData.isPackageSession && selectedPatient.id && selectedPatient.activePackage) {
             const updatedPackage = { ...selectedPatient.activePackage };
             updatedPackage.usedSessions += 1;
             this.patientService.updatePatient(selectedPatient.id, { activePackage: updatedPackage }).subscribe();
          }

          this.isSaving.set(false);
          this.viewMode.set('list');
        },
        error: (err) => {
          console.error('Add failed', err);
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteSession(id: string | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      this.sessionService.deleteSession(id).subscribe({
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  togglePaymentStatus(session: ClinicalSession): void {
    if (!session.id) return;
    const newStatus = session.paymentStatus === 'paid' ? 'pending' : 'paid';
    this.sessionService.updateSession(session.id, { paymentStatus: newStatus }).subscribe({
      error: (err) => console.error('Payment update failed', err)
    });
  }

  toggleSessionStatus(session: ClinicalSession): void {
    if (!session.id) return;
    const newStatus = session.status === 'completed' ? 'scheduled' : 'completed';
    this.sessionService.updateSession(session.id, { status: newStatus }).subscribe({
      error: (err) => console.error('Session status update failed', err)
    });
  }
}
