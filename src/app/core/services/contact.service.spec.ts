import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service';
import { AuthService } from './auth.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { User } from '@angular/fire/auth';

describe('ContactService', () => {
  let service: ContactService;

  const mockAuthLoggedIn = {
    user$: of({ uid: 'test-uid-123' } as User)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        { provide: Firestore, useValue: null },
        { provide: AuthService, useValue: mockAuthLoggedIn }
      ]
    });
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a saveLead method', () => {
    expect(typeof service.saveLead).toBe('function');
  });
});
