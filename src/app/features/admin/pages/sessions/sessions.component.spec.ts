import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionsComponent } from './sessions.component';
import { SessionService } from '../../../../core/services/session.service';
import { PatientService } from '../../../../core/services/patient.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('SessionsComponent', () => {
  let fixture: ComponentFixture<SessionsComponent>;
  let component: SessionsComponent;
  let mockSessionService: { getSessions: jest.Mock, deleteSession: jest.Mock, addSession: jest.Mock, updateSession: jest.Mock };
  let mockPatientService: { getPatients: jest.Mock };

  beforeEach(async () => {
    mockSessionService = {
      getSessions: jest.fn().mockReturnValue(of([])),
      deleteSession: jest.fn().mockReturnValue(of(undefined)),
      addSession: jest.fn().mockReturnValue(of('new-id')),
      updateSession: jest.fn().mockReturnValue(of(undefined))
    };

    mockPatientService = {
      getPatients: jest.fn().mockReturnValue(of([
        { id: 'p1', name: 'John Doe', status: 'active' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [SessionsComponent, ReactiveFormsModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: PatientService, useValue: mockPatientService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSessions and getPatients on init', () => {
    expect(mockSessionService.getSessions).toHaveBeenCalled();
    expect(mockPatientService.getPatients).toHaveBeenCalled();
  });

  it('should open new form with defaults', () => {
    component.openNewForm();
    expect(component.viewMode()).toBe('form');
    expect(component.editingSessionId()).toBeNull();
    expect(component.sessionForm.value.duration).toBe(50);
  });

  it('should update payment status on toggle', () => {
    const session = { id: 's1', paymentStatus: 'pending' } as ClinicalSession;
    component.togglePaymentStatus(session);
    expect(mockSessionService.updateSession).toHaveBeenCalledWith('s1', { paymentStatus: 'paid' });
  });

  it('should update session status on toggle', () => {
    const session = { id: 's1', status: 'scheduled' } as ClinicalSession;
    component.toggleSessionStatus(session);
    expect(mockSessionService.updateSession).toHaveBeenCalledWith('s1', { status: 'completed' });
  });
});
