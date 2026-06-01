import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { FaqComponent } from './faq/faq.component';

describe('LandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;
  let component: LandingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent]
    })
    .overrideComponent(HeroComponent, { set: { template: '<div>hero</div>' } })
    .overrideComponent(AboutComponent, { set: { template: '<div>about</div>' } })
    .overrideComponent(ServicesComponent, { set: { template: '<div>services</div>' } })
    .overrideComponent(HowItWorksComponent, { set: { template: '<div>how-it-works</div>' } })
    .overrideComponent(FaqComponent, { set: { template: '<div>faq</div>' } })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all landing page sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero')).toBeTruthy();
    expect(compiled.querySelector('app-about')).toBeTruthy();
    expect(compiled.querySelector('app-services')).toBeTruthy();
    expect(compiled.querySelector('app-how-it-works')).toBeTruthy();
    expect(compiled.querySelector('app-faq')).toBeTruthy();
  });
});
