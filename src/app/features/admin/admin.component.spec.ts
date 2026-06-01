import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminService } from '../../core/services/admin.service';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ContactLead } from '../../core/services/contact.service';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject, Observable } from 'rxjs';

describe('AdminComponent', () => {
  let fixture: ComponentFixture<AdminComponent>;
  let component: AdminComponent;
  let mockAdminService: { getLeads: jest.Mock };
  let mockAuthService: { userProfile$: BehaviorSubject<UserProfile | null | undefined>; logout: jest.Mock };
  let router: Router;

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
    mockAuthService = {
      userProfile$: new BehaviorSubject<UserProfile | null | undefined>(null),
      logout: jest.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        provideRouter([]),
        { provide: AdminService, useValue: mockAdminService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(AdminComponent);
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
    const newFixture = TestBed.createComponent(AdminComponent);
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.spinner')).toBeTruthy();
  });

  it('should show empty state when no leads exist', () => {
    mockAdminService.getLeads.mockReturnValue(of([]));
    const newFixture = TestBed.createComponent(AdminComponent);
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhum lead recebido ainda');
  });

  it('should show error state on failure', () => {
    mockAdminService.getLeads.mockReturnValue(
      throwError(() => new Error('Firestore error'))
    );
    const newFixture = TestBed.createComponent(AdminComponent);
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

  describe('logout', () => {
    it('should call authService.logout and navigate to /', async () => {
      await component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
