import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService, ContactLead } from '../services/contact.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const lead: ContactLead = {
      ...this.contactForm.value,
      createdAt: new Date().toISOString()
    };

    this.contactService.saveLead(lead).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        
        setTimeout(() => this.submitSuccess = false, 5000);
      },
      error: (err) => {
        console.error('Erro ao salvar contato:', err);
        this.errorMessage = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
        this.isSubmitting = false;
      }
    });
  }
}
