import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AdminService } from '../../../../core/services/admin.service';
import { ContactLead } from '../../../../core/services/contact.service';
import { of, throwError, Observable } from 'rxjs';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let mockAdminService: { getLeads: jest.Mock };

  const mockLeads: ContactLead[] = [
    {
      uid: 'user-1', name: 'John Doe', email: 'john@test.com',
      phone: '11987654321', message: 'Quero agendar terapia', createdAt: '2026-05-20T10:00:00Z'
    },
    {
      uid: 'user-2', name: 'Jane Doe', email: 'jane@test.com',
      message: 'Dúvida sobre valores', createdAt: '2026-05-21T14:30:00Z'
    }
  ];

  beforeEach(async () => {
    mockAdminService = { getLeads: jest.fn().mockReturnValue(of(mockLeads)) };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLeads on init', () => {
    expect(mockAdminService.getLeads).toHaveBeenCalled();
  });

  it('should render leads in the table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.leads-table')).toBeTruthy();
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('John Doe');
    expect(rows[1].textContent).toContain('Jane Doe');
  });

  it('should show loading state initially', () => {
    mockAdminService.getLeads.mockReturnValue(new Observable(() => { /* never emits */ }));
    const newFixture = TestBed.createComponent(DashboardComponent);
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.spinner')).toBeTruthy();
  });

  it('should show empty state when no leads exist', () => {
    mockAdminService.getLeads.mockReturnValue(of([]));
    const newFixture = TestBed.createComponent(DashboardComponent);
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhum lead recebido ainda');
  });

  it('should show error state on failure', () => {
    mockAdminService.getLeads.mockReturnValue(
      throwError(() => new Error('Firestore error'))
    );
    const newFixture = TestBed.createComponent(DashboardComponent);
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Erro ao carregar os leads');
  });

  it('should render WhatsApp link when phone is present', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const whatsappLink = compiled.querySelector('a[href*="wa.me"]');
    expect(whatsappLink).toBeTruthy();
    expect(whatsappLink?.getAttribute('href')).toContain('11987654321');
  });

  it('should show dash when phone is missing', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    // Second lead has no phone
    expect(rows[1].textContent).toContain('—');
  });
});
