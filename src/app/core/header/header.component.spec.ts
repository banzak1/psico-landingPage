import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService, UserProfile } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let isLoggedInSubject: BehaviorSubject<boolean>;
  let userProfileSubject: BehaviorSubject<UserProfile | null | undefined>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    userProfileSubject = new BehaviorSubject<UserProfile | null | undefined>(null);

    mockAuthService = {
      isLoggedIn$: isLoggedInSubject.asObservable(),
      userProfile$: userProfileSubject.asObservable(),
      loginWithGoogle: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with isLoggingIn as false and no error', () => {
    expect(component.isLoggingIn).toBe(false);
    expect(component.loginError).toBe('');
  });

  it('should render login button when user is not authenticated', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginBtn = compiled.querySelector('.btn-auth--login');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.textContent?.trim()).toBe('Entrar');
  });

  it('should render logout button when user is authenticated', () => {
    isLoggedInSubject.next(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutBtn = compiled.querySelector('.btn-auth--logout');
    expect(logoutBtn).toBeTruthy();
  });

  it('should show admin badge when user role is admin', () => {
    const adminProfile: UserProfile = {
      uid: 'admin-1', email: 'admin@test.com',
      displayName: 'Admin', photoURL: null, role: 'admin'
    };
    userProfileSubject.next(adminProfile);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const adminBadge = compiled.querySelector('.admin-badge');
    expect(adminBadge).toBeTruthy();
  });

  it('should not show admin badge for regular users', () => {
    const userProfile: UserProfile = {
      uid: 'user-1', email: 'user@test.com',
      displayName: 'User', photoURL: null, role: 'user'
    };
    userProfileSubject.next(userProfile);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const adminBadge = compiled.querySelector('.admin-badge');
    expect(adminBadge).toBeNull();
  });

  it('should call loginWithGoogle on login button click', () => {
    isLoggedInSubject.next(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginBtn = compiled.querySelector('.desktop-auth-btn.btn-auth--login') as HTMLButtonElement;
    loginBtn?.click();
    expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
  });

  it('should show "Entrando..." and disable button while logging in', () => {
    isLoggedInSubject.next(false);
    component.isLoggingIn = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginBtn = compiled.querySelector('.desktop-auth-btn.btn-auth--login') as HTMLButtonElement;
    expect(loginBtn?.disabled).toBe(true);
    expect(loginBtn?.textContent?.trim()).toBe('Entrando...');
  });

  it('should ignore clicks while already logging in', () => {
    isLoggedInSubject.next(false);
    component.isLoggingIn = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginBtn = compiled.querySelector('.desktop-auth-btn.btn-auth--login') as HTMLButtonElement;
    (mockAuthService.loginWithGoogle as jest.Mock).mockClear();
    loginBtn?.click();
    expect(mockAuthService.loginWithGoogle).not.toHaveBeenCalled();
  });

  it('should call logout on logout button click', () => {
    isLoggedInSubject.next(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutBtn = compiled.querySelector('.desktop-auth-btn.btn-auth--logout') as HTMLButtonElement;
    logoutBtn?.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should toggle menu open and close', () => {
    expect(component.isMenuOpen).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close menu via closeMenu()', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBe(false);
  });
});
