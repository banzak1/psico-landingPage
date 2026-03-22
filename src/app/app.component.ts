import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeroComponent } from './features/landing/hero/hero.component';
import { AboutComponent } from './features/landing/about/about.component';
import { ServicesComponent } from './features/landing/services/services.component';
import { HowItWorksComponent } from './features/landing/how-it-works/how-it-works.component';
import { FaqComponent } from './features/landing/faq/faq.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    HowItWorksComponent,
    FaqComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'psico-landing-page';
}
