import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of, firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: { currentUser: null } },
        { provide: Firestore, useValue: null }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLoggedIn$', () => {
    it('should emit true when user$ emits a user', async () => {
      jest.spyOn(service, 'user$', 'get').mockReturnValue(of({ uid: '123' } as User));
      const result = await firstValueFrom(service.isLoggedIn$);
      expect(result).toBe(true);
    });

    it('should emit false when user$ emits null', async () => {
      jest.spyOn(service, 'user$', 'get').mockReturnValue(of(null));
      const result = await firstValueFrom(service.isLoggedIn$);
      expect(result).toBe(false);
    });
  });

  describe('userProfile$', () => {
    it('should emit null when user is not logged in', async () => {
      jest.spyOn(service, 'user$', 'get').mockReturnValue(of(null));
      const result = await firstValueFrom(service.userProfile$);
      expect(result).toBeNull();
    });
  });

  describe('loginWithGoogle', () => {
    it('should be a callable method', () => {
      expect(typeof service.loginWithGoogle).toBe('function');
    });

    it('should reject when auth is null', async () => {
      await expect(service.loginWithGoogle()).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should be a callable method', () => {
      expect(typeof service.logout).toBe('function');
    });
  });

  describe('processRedirectResult', () => {
    it('should be a callable method', () => {
      expect(typeof service.processRedirectResult).toBe('function');
    });

    it('should handle no user gracefully', async () => {
      jest.spyOn(service, 'user$', 'get').mockReturnValue(of(null));
      await expect(service.processRedirectResult()).resolves.toBeUndefined();
    });
  });
});
