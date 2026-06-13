import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientsComponent } from './patients.component';
import { PatientService } from '../../../../core/services/patient.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('PatientsComponent', () => {
  let fixture: ComponentFixture<PatientsComponent>;
  let component: PatientsComponent;
  let mockPatientService: { getPatients: jest.Mock, deletePatient: jest.Mock, addPatient: jest.Mock, updatePatient: jest.Mock };

  beforeEach(async () => {
    mockPatientService = {
      getPatients: jest.fn().mockReturnValue(of([])),
      deletePatient: jest.fn().mockReturnValue(of(undefined)),
      addPatient: jest.fn().mockReturnValue(of('new-id')),
      updatePatient: jest.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [PatientsComponent, ReactiveFormsModule],
      providers: [
        { provide: PatientService, useValue: mockPatientService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPatients on init', () => {
    expect(mockPatientService.getPatients).toHaveBeenCalled();
  });

  it('should open new form', () => {
    component.openNewForm();
    expect(component.viewMode()).toBe('form');
    expect(component.editingPatientId()).toBeNull();
  });

  it('should open edit form with patient data', () => {
    const patient = { id: 'p1', name: 'John', email: 'john@test.com', status: 'active' as const, createdAt: '' };
    component.openEditForm(patient);
    expect(component.viewMode()).toBe('form');
    expect(component.editingPatientId()).toBe('p1');
    expect(component.patientForm.value.name).toBe('John');
  });
});
