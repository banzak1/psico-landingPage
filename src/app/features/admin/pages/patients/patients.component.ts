import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PatientService, Patient } from '../../../../core/services/patient.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit {
  private patientService = inject(PatientService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  patients = signal<Patient[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);

  viewMode = signal<'list' | 'form'>('list');
  editingPatientId = signal<string | null>(null);

  patientForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    status: ['active' as 'active' | 'inactive', Validators.required],
    ageGroup: ['Adulto', Validators.required],
    clinicPercentage: [0, [Validators.min(0), Validators.max(100)]],
    notes: ['']
  });

  ngOnInit(): void {
    this.patientService.getPatients().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.patients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load patients', err);
        this.isLoading.set(false);
      }
    });
  }

  openNewForm(): void {
    this.patientForm.reset({ status: 'active' });
    this.editingPatientId.set(null);
    this.viewMode.set('form');
  }

  openEditForm(patient: Patient): void {
    this.patientForm.patchValue({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || '',
      status: patient.status,
      ageGroup: patient.ageGroup || 'Adulto',
      clinicPercentage: patient.clinicPercentage || 0,
      notes: patient.notes || ''
    });
    this.editingPatientId.set(patient.id || null);
    this.viewMode.set('form');
  }

  cancelForm(): void {
    this.viewMode.set('list');
  }

  savePatient(): void {
    if (this.patientForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.patientForm.value;
    const patientData: Omit<Patient, 'id'> = {
      name: formValue.name!,
      email: formValue.email!,
      phone: formValue.phone || '',
      status: formValue.status as 'active' | 'inactive',
      ageGroup: formValue.ageGroup as 'Criança' | 'Adolescente' | 'Adulto' | 'Idoso',
      clinicPercentage: formValue.clinicPercentage || 0,
      notes: formValue.notes || '',
      createdAt: new Date().toISOString()
    };

    const id = this.editingPatientId();
    if (id) {
      // Quando atualiza não mudamos o createdAt idealmente, mas para o patch do updateDoc vamos remover o createdAt pra não subscrever.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, ...updateData } = patientData;
      
      this.patientService.updatePatient(id, updateData as Partial<Omit<Patient, 'id'>>).subscribe({
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
      this.patientService.addPatient(patientData).subscribe({
        next: () => {
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

  deletePatient(id: string | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
      this.patientService.deletePatient(id).subscribe({
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}
