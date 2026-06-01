import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { Firestore } from '@angular/fire/firestore';
describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        { provide: Firestore, useValue: {} }
      ]
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeads', () => {
    it('should be defined as a function', () => {
      expect(typeof service.getLeads).toBe('function');
    });
  });
});
