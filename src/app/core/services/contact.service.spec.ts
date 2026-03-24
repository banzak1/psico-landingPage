import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service';
import { Firestore } from '@angular/fire/firestore';

describe('ContactService', () => {
  let service: ContactService;
  let firestoreMock: Partial<Firestore>;

  beforeEach(() => {
    firestoreMock = {};

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: firestoreMock }
      ]
    });
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a saveLead method', () => {
    expect(typeof service.saveLead === 'function').toBeTrue();
  });
});
