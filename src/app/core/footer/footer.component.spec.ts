import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ContactService } from '../services/contact.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ContactService', ['saveLead']);
    
    await TestBed.configureTestingModule({
      imports: [FooterComponent, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: spy }
      ]
    })
    .compileComponents();

    contactServiceSpy = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset any spy or clock if needed
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form when empty', () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should not submit an invalid form', () => {
    component.onSubmit();
    expect(contactServiceSpy.saveLead).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
  });

  it('should submit a valid form and handle success', () => {
    jasmine.clock().install();

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message here with 10 chars'
    });

    contactServiceSpy.saveLead.and.returnValue(of('mock-id'));
    
    component.onSubmit();
    
    expect(contactServiceSpy.saveLead).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(component.submitSuccess).toBeTrue();
    expect(component.contactForm.pristine).toBeTrue();
    
    jasmine.clock().tick(5000);
    expect(component.submitSuccess).toBeFalse();

    jasmine.clock().uninstall();
  });

  it('should handle submission error', () => {
    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message here with 10 chars'
    });

    const consoleSpy = spyOn(console, 'error');
    contactServiceSpy.saveLead.and.returnValue(throwError(() => new Error('API Error')));
    
    component.onSubmit();
    
    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
