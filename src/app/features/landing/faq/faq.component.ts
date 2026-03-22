import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs: FaqItem[] = [
    {
      question: 'Você atende por plano de saúde/convênio?',
      answer: 'Atendo exclusivamente de forma particular. No entanto, forneço recibo detalhado que pode ser utilizado para solicitação de reembolso junto ao seu plano de saúde, dependendo da política da sua operadora.',
      isOpen: false
    },
    {
      question: 'Qual é a duração de cada sessão?',
      answer: 'As sessões têm duração padrão de 50 minutos. Para o Atendimento Infantil, algumas sessões de orientação aos pais podem ter um formato diferente, mas combinaremos tudo com antecedência.',
      isOpen: false
    },
    {
      question: 'Como funciona a terapia online?',
      answer: 'As sessões online ocorrem por videochamada através de plataformas seguras. Você só precisará de uma conexão estável à internet, câmera/microfone funcionando e um ambiente fechado onde se sinta à vontade para conversar em sigilo.',
      isOpen: false
    },
    {
      question: 'Qual a frequência ideal das sessões?',
      answer: 'Inicialmente, recomendo sessões semanais para que possamos estabelecer vínculo e um bom ritmo de trabalho. A frequência pode ser ajustada ao longo do progresso e de acordo com a sua necessidade.',
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
