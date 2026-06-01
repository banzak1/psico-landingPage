import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService, UserProfile } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('adminGuard', () => {
  let userProfileSubject: BehaviorSubject<UserProfile | null | undefined>;
  let mockRouter: { createUrlTree: jest.Mock };

  beforeEach(() => {
    userProfileSubject = new BehaviorSubject<UserProfile | null | undefined>(undefined);
    mockRouter = { createUrlTree: jest.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { userProfile$: userProfileSubject.asObservable() }
        },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when user has admin role', (done) => {
    const adminProfile: UserProfile = {
      uid: 'admin-1', email: 'admin@test.com',
      displayName: 'Admin', photoURL: null, role: 'admin'
    };
    userProfileSubject.next(adminProfile);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    ) as Observable<boolean | UrlTree>;

    result.subscribe(value => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should redirect to root when user has user role', (done) => {
    const userProfile: UserProfile = {
      uid: 'user-1', email: 'user@test.com',
      displayName: 'User', photoURL: null, role: 'user'
    };
    userProfileSubject.next(userProfile);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    ) as Observable<boolean | UrlTree>;

    result.subscribe(value => {
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/']);
      expect(value).toEqual({} as UrlTree);
      done();
    });
  });

  it('should redirect to root when user is not authenticated', (done) => {
    userProfileSubject.next(null);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    ) as Observable<boolean | UrlTree>;

    result.subscribe(value => {
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/']);
      expect(value).toEqual({} as UrlTree);
      done();
    });
  });

  it('should wait for auth state to resolve before deciding', (done) => {
    let emitted = false;

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    ) as Observable<boolean | UrlTree>;

    result.subscribe(() => {
      emitted = true;
      done();
    });

    // Should not have emitted yet (still undefined = loading)
    expect(emitted).toBe(false);

    // Now resolve the auth state
    userProfileSubject.next(null);
  });
});
