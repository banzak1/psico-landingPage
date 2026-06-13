import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientProfileComponent } from './patient-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../core/services/patient.service';
import { SessionService } from '../../../../core/services/session.service';
import { EvolutionService } from '../../../../core/services/evolution.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Auth } from '@angular/fire/auth';

describe('PatientProfileComponent', () => {
  let fixture: ComponentFixture<PatientProfileComponent>;
  let component: PatientProfileComponent;
  let mockRouter: { navigate: jest.Mock };
  let mockPatientService: { getPatient: jest.Mock };
  let mockSessionService: { getSessions: jest.Mock };
  let mockEvolutionService: { getEvolutions: jest.Mock, addEvolution: jest.Mock };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    mockPatientService = { getPatient: jest.fn().mockReturnValue(of({ name: 'John Doe', status: 'active' })) };
    mockSessionService = { getSessions: jest.fn().mockReturnValue(of([])) };
    mockEvolutionService = { 
      getEvolutions: jest.fn().mockReturnValue(of([])),
      addEvolution: jest.fn().mockReturnValue(of('evo-1'))
    };

    await TestBed.configureTestingModule({
      imports: [PatientProfileComponent, ReactiveFormsModule, QuillModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'p1' } } } },
        { provide: PatientService, useValue: mockPatientService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: EvolutionService, useValue: mockEvolutionService },
        { provide: Auth, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load data', () => {
    expect(component).toBeTruthy();
    expect(mockPatientService.getPatient).toHaveBeenCalledWith('p1');
    expect(mockEvolutionService.getEvolutions).toHaveBeenCalledWith('p1');
    expect(mockSessionService.getSessions).toHaveBeenCalled();
  });

  it('should redirect if id is missing', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PatientProfileComponent, ReactiveFormsModule, QuillModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: PatientService, useValue: mockPatientService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: EvolutionService, useValue: mockEvolutionService }
      ]
    });
    const fixture2 = TestBed.createComponent(PatientProfileComponent);
    fixture2.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/patients']);
  });

  it('should redirect if patient not found', () => {
    mockPatientService.getPatient.mockReturnValue(of(undefined));
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/patients']);
  });

  it('should add evolution', () => {
    component.patient.set({ id: 'p1', name: 'John', email: 'j', status: 'active', createdAt: 'date' });
    component.evolutionForm.patchValue({ content: 'Test content', date: '2023-01-01' });
    component.saveEvolution();
    expect(mockEvolutionService.addEvolution).toHaveBeenCalled();
    expect(component.evolutionForm.value.content).toBe(''); // Form is cleared
  });

  it('should navigate back', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/patients']);
  });
});
