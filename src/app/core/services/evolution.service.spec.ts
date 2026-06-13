import { TestBed } from '@angular/core/testing';
import { EvolutionService } from './evolution.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

describe('EvolutionService', () => {
  let service: EvolutionService;
  let mockFirestore: unknown;
  let mockAuth: { currentUser: Partial<User> | null };

  beforeEach(() => {
    mockFirestore = {};
    mockAuth = {
      currentUser: { uid: 'user-123' }
    };

    TestBed.configureTestingModule({
      providers: [
        EvolutionService,
        { provide: Firestore, useValue: mockFirestore },
        { provide: Auth, useValue: mockAuth }
      ]
    });
    service = TestBed.inject(EvolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error if user not authenticated', () => {
    mockAuth.currentUser = null;
    expect(() => service.getEvolutions('p1')).toThrow('Usuário não autenticado');
  });
});
