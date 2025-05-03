import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqItems: FaqItem[] = [
    {
      question: '¿Qué es SupportMe?',
      answer: '<strong>SupportMe</strong> es una plataforma que permite a personas y ONGs crear campañas para recaudar fondos destinados a causas solidarias, sociales o personales, recibiendo donaciones de forma segura a través de Mercado Pago.',
      isOpen: true
    },
    {
      question: '¿Necesito registrarme para donar?',
      answer: 'No. Podés donar de forma anónima sin necesidad de registrarte. Solo necesitás completar el formulario de pago.',
      isOpen: false
    },
    {
      question: '¿Cómo puedo crear una campaña?',
      answer: 'Para crear una campaña necesitás registrarte como usuario. Una vez dentro de tu cuenta, podés acceder a la sección "Crear campaña" y completar los datos como título, descripción, imágenes, meta de dinero o fecha límite.',
      isOpen: false
    },
    {
      question: '¿Qué tipos de campañas puedo crear?',
      answer: 'Podés crear campañas personales, sociales, comunitarias, educativas, de salud, entre otras.',
      isOpen: false
    },
    {
      question: '¿Cuánto tiempo puede estar activa una campaña?',
      answer: 'El creador define si la campaña tiene un objetivo de dinero o una fecha límite. La campaña permanece activa hasta que se alcance alguno de esos límites.',
      isOpen: false
    },
    {
      question: '¿Se cobra alguna comisión?',
      answer: 'Sí. SupportMe retiene un pequeño porcentaje de cada donación para cubrir gastos operativos de la plataforma. El detalle de la comisión aparece reflejado en el resumen de pago.',
      isOpen: false
    },
    {
      question: '¿Qué medios de pago puedo usar?',
      answer: 'Los pagos se realizan a través de <strong>Mercado Pago</strong>, por lo que podés utilizar tarjeta de crédito, débito, saldo en cuenta, o los medios habilitados por la pasarela.',
      isOpen: false
    },
    {
      question: '¿Recibo alguna confirmación al donar?',
      answer: 'Sí. Una vez realizada la donación, recibirás un correo de confirmación con el detalle de la operación. El creador de la campaña también será notificado por email.',
      isOpen: false
    },
    {
      question: '¿Puedo dejar un mensaje al donar?',
      answer: 'Sí. Al realizar una donación, tenés la opción de dejar un mensaje de apoyo que será visible en la campaña (dependiendo de la configuración del creador).',
      isOpen: false
    },
    {
      question: '¿Qué pasa si mi campaña alcanza el 100% del objetivo?',
      answer: 'La plataforma notificará al creador cuando se alcancen ciertos hitos de recaudación (50%, 75%, 100%) y marcará la campaña como completada si corresponde.',
      isOpen: false
    },
    {
      question: '¿Dónde veo mis campañas y donaciones?',
      answer: 'Desde tu perfil, podés ver un resumen de todas las campañas que creaste, el estado de recaudación, y también un historial de tus donaciones.',
      isOpen: false
    }
  ];
  
  isMobile: boolean = false;
  
  constructor() {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    
    // Si es mobile, asegurarse de que solo una pregunta esté abierta a la vez
    if (this.isMobile) {
      // Count open items
      const openItems = this.faqItems.filter(item => item.isOpen).length;
      if (openItems > 1) {
        // Keep only the first one open
        let foundFirst = false;
        this.faqItems.forEach(item => {
          if (item.isOpen) {
            if (!foundFirst) {
              foundFirst = true;
            } else {
              item.isOpen = false;
            }
          }
        });
      }
    }
  }
  
  toggleFaq(selectedItem: FaqItem): void {
    // En mobile, cierra otras preguntas cuando se abre una nueva
    if (this.isMobile && !selectedItem.isOpen) {
      this.faqItems.forEach(item => {
        if (item !== selectedItem && item.isOpen) {
          item.isOpen = false;
        }
      });
    }
    
    selectedItem.isOpen = !selectedItem.isOpen;
  }
}