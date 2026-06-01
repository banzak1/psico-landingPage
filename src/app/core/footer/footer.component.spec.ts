import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ContactService } from '../services/contact.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let contactServiceMock: { saveLead: jest.Mock };

  beforeEach(async () => {
    contactServiceMock = { saveLead: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [FooterComponent, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: contactServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form when empty', () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should not submit an invalid form', () => {
    component.onSubmit();
    expect(contactServiceMock.saveLead).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalsy();
  });

  it('should submit a valid form and handle success', () => {
    jest.useFakeTimers();

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message here with 10 chars'
    });

    contactServiceMock.saveLead.mockReturnValue(of('mock-id'));

    component.onSubmit();

    expect(contactServiceMock.saveLead).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalsy();
    expect(component.submitSuccess).toBeTruthy();
    expect(component.contactForm.pristine).toBeTruthy();

    jest.advanceTimersByTime(5000);
    expect(component.submitSuccess).toBeFalsy();

    jest.useRealTimers();
  });

  it('should handle submission error', () => {
    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message here with 10 chars'
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    contactServiceMock.saveLead.mockReturnValue(throwError(() => new Error('API Error')));

    component.onSubmit();

    expect(component.isSubmitting).toBeFalsy();
    expect(component.errorMessage).toBe('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
