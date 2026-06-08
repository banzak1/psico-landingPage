import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

import { PatientService, Patient } from '../../../../core/services/patient.service';
import { SessionService, ClinicalSession } from '../../../../core/services/session.service';
import { EvolutionService, ClinicalEvolution } from '../../../../core/services/evolution.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillEditorComponent],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private sessionService = inject(SessionService);
  private evolutionService = inject(EvolutionService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  patient = signal<Patient | null>(null);
  sessions = signal<ClinicalSession[]>([]);
  evolutions = signal<ClinicalEvolution[]>([]);
  
  isLoading = signal(true);
  isSaving = signal(false);

  evolutionForm = this.fb.group({
    content: ['', Validators.required],
    date: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/patients']);
      return;
    }

    // Set today's date in form
    const now = new Date();
    const localDateStr = now.toISOString().slice(0, 16);
    this.evolutionForm.patchValue({ date: localDateStr });

    this.loadPatientData(id);
  }

  private loadPatientData(id: string): void {
    // Load Patient Profile
    this.patientService.getPatient(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (patientData) => {
        if (!patientData) {
          this.router.navigate(['/admin/patients']);
          return;
        }
        this.patient.set({ ...patientData, id });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar paciente', err);
        this.isLoading.set(false);
      }
    });

    // Load Sessions of this patient
    this.sessionService.getSessions().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (allSessions) => {
        // Filter locally and sort descending
        const pSessions = allSessions
          .filter(s => s.patientId === id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.sessions.set(pSessions);
      }
    });

    // Load Evolutions
    this.evolutionService.getEvolutions(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        // Sort descending in memory
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.evolutions.set(sorted);
      },
      error: (err) => {
        console.error('Erro ao buscar evoluções', err);
      }
    });
  }

  saveEvolution(): void {
    if (this.evolutionForm.invalid) return;

    const patientId = this.patient()?.id;
    if (!patientId) return;

    this.isSaving.set(true);
    const formValue = this.evolutionForm.value;

    const evolutionData = {
      patientId,
      date: formValue.date!,
      content: formValue.content!
    };

    this.evolutionService.addEvolution(evolutionData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.evolutionForm.patchValue({ content: '' }); // Clear content
      },
      error: (err) => {
        console.error('Falha ao salvar evolução', err);
        this.isSaving.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/patients']);
  }
}
