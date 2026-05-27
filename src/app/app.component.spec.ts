require('../../jest.init');

import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './core/services/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Firestore, useValue: null },
        { provide: AuthService, useValue: { userProfile$: of(null) } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'psico-landing-page' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('psico-landing-page');
  });

  it('should render main app structure', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-hero')).toBeTruthy();
  });
});
