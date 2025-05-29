import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SecuritySection {
  id: string;
  title: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  
securityData: SecuritySection[] = [
  {
    id: 'introduccion',
    title: 'Introducción',
    content: [
      'En SupportMe, nos tomamos en serio la privacidad de nuestros usuarios.',
      'Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tus datos personales al utilizar nuestros servicios.'
    ]
  },
{
  id: 'datos-recolectados',
  title: 'Datos que Recopilamos',
  content: [
    'Datos de registro: como nombre, correo electrónico y contraseña.',
    'Datos de uso: como la creación de campañas y el historial de donaciones realizadas o recibidas.',
    'Datos de pago: almacenamos únicamente los últimos 4 dígitos de la tarjeta, el titular (cardholder) y la marca de la tarjeta (brand) para facilitar la identificación de pagos. Los datos sensibles de la tarjeta son gestionados directamente por Mercado Pago.'
  ]
},
  {
    id: 'uso-datos',
    title: 'Uso de los Datos',
    content: [
      'Utilizamos tus datos para permitirte crear campañas, realizar donaciones y brindarte acceso a nuestras funcionalidades.',
      'También los usamos para prevenir fraudes, mantener la seguridad de la plataforma y mejorar el servicio.',
      'No vendemos ni compartimos tus datos con terceros con fines comerciales.'
    ]
  },
  {
    id: 'bases-legales',
    title: 'Bases Legales para el Tratamiento',
    content: [
      'Tratamos tus datos con base en el consentimiento que brindás al registrarte y utilizar el servicio.',
      'También podemos procesar tus datos para cumplir con obligaciones legales y prevenir usos indebidos de la plataforma.'
    ]
  },
  {
    id: 'almacenamiento-seguridad',
    title: 'Almacenamiento y Seguridad',
    content: [
      'Los datos se almacenan en Firebase y servidores seguros, con acceso restringido.',
      'Aplicamos cifrado y buenas prácticas de seguridad recomendadas por el mercado, incluyendo HTTPS, manejo de tokens JWT, autenticación segura y control de sesiones.',
      'Si bien hacemos esfuerzos razonables para proteger la información, ningún sistema es 100% infalible.'
    ]
  },
  {
    id: 'servicios-terceros',
    title: 'Servicios de Terceros',
    content: [
      'Utilizamos servicios de terceros como Firebase (Google), Mercado Pago y proveedores de infraestructura para operar la plataforma.',
      'Estos servicios tienen sus propias políticas de privacidad y cumplen con normativas de seguridad reconocidas.',
      'No compartimos tus datos con ellos más allá de lo necesario para que el servicio funcione correctamente.'
    ]
  },
  {
    id: 'derechos-usuario',
    title: 'Tus Derechos como Usuario',
    content: [
      'Si querés cerrar tu cuenta, se eliminarán los datos personales almacenados, salvo aquellos que debamos conservar por obligación legal o por motivos operativos (como historial de campañas o transacciones).',
      'Podés contactarnos si tenés alguna duda o reclamo relacionado con el tratamiento de tus datos.'
    ]
  },
  {
    id: 'modificaciones',
    title: 'Cambios en la Política',
    content: [
      'Podemos actualizar esta Política de Privacidad para reflejar mejoras, cambios legales o ajustes en el servicio.',
      'Publicaremos cualquier modificación en la plataforma. Si seguís usando el servicio luego de un cambio, se entenderá que aceptás la nueva versión.'
    ]
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: [
      'Si tenés preguntas sobre esta Política o querés ejercer tus derechos, podés escribirnos a soporte@codeflowsystems.com.'
    ]
  }
];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}