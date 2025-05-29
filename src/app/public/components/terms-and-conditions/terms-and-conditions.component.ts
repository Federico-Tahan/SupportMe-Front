import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TermsSection {
  id: string;
  title: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
}

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  
termsData: TermsSection[] = [
  {
    id: 'introduccion',
    title: 'Introducción',
    content: [
      'Bienvenido a SupportMe, un servicio provisto por CodeFlow Systems. Ofrecemos una plataforma para crear y gestionar campañas de recaudación de fondos de forma segura y accesible.',
      'Al acceder y utilizar el Servicio, usted acepta estar sujeto a estos Términos y Condiciones y a la Política de Privacidad correspondiente.',
      'Si no está de acuerdo con los Términos y Condiciones o la Política de Privacidad, le solicitamos no utilizar el Servicio.',
      'Al usar el Servicio, acepta todas las funcionalidades actuales y futuras, y se compromete a cumplir con las reglas aquí establecidas.'
    ]
  },
  {
    id: 'transacciones',
    title: 'Transacciones',
    content: [
      'El usuario es responsable del uso y resguardo de sus credenciales. SupportMe no se responsabiliza por el uso indebido por parte de terceros.',
      'SupportMe nunca solicitará sus datos completos de acceso ni enviará correos electrónicos solicitando información confidencial.',
      'Las donaciones se procesan mediante pasarelas de pago seguras, cumpliendo con los estándares internacionales de protección de datos financieros.'
    ]
  },
  {
    id: 'contenido-campanas',
    title: 'Contenido de Campañas',
    content: [
      'El contenido de cada campaña es responsabilidad exclusiva del usuario que la crea.',
      'Está prohibido publicar campañas fraudulentas, engañosas, que inciten al odio, violencia o que infrinjan derechos de terceros.',
      'SupportMe podrá suspender o eliminar campañas que incumplan estos Términos, sin necesidad de notificación previa.',
      'El uso de imágenes, textos o materiales protegidos por derechos de autor debe contar con autorización expresa de sus titulares.'
    ]
  },
  {
    id: 'costo-servicio',
    title: 'Costo del Servicio',
    content: [
      'CodeFlow Systems podrá cobrar comisiones por el mantenimiento, procesamiento y uso del Servicio.',
      'Estas comisiones estarán claramente informadas al momento de realizar donaciones.',
      'La empresa se encuentra autorizada a debitar dichos importes directamente de los fondos recaudados en las campañas.',
      'Cualquier modificación será comunicada con al menos 60 días de antelación.'
    ]
  },
  {
    id: 'vigencia',
    title: 'Vigencia',
    content: [
      'El uso del servicio es voluntario y puede discontinuarse en cualquier momento por parte del usuario simplemente dejando de utilizarlo.',
      'En caso de incumplimiento de los Términos, CodeFlow Systems podrá dar de baja la cuenta sin necesidad de preaviso y sin derecho a indemnización.'
    ]
  },
  {
    id: 'validez-operaciones',
    title: 'Validez de Operaciones y Notificaciones',
    content: [
      'Todas las operaciones realizadas dentro de la plataforma serán consideradas válidas y vinculantes para el usuario.',
      'Los registros emitidos por la app serán prueba suficiente de dichas operaciones.',
      'Las notificaciones enviadas mediante medios digitales (correo electrónico) tendrán el mismo valor legal que las enviadas por medios físicos.'
    ]
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad Intelectual',
    content: [
      'El software, diseño, marcas y contenido de SupportMe están protegidos por la Ley 11.723 de Propiedad Intelectual.',
      'Está prohibida su reproducción total o parcial, modificación o distribución sin autorización expresa de CodeFlow Systems.',
      'El incumplimiento de estas disposiciones podrá dar lugar a acciones legales.'
    ]
  },
  {
    id: 'privacidad-informacion',
    title: 'Privacidad de la Información',
    content: [
      'Para utilizar los Servicios, los usuarios deberán facilitar ciertos datos personales que serán almacenados y tratados conforme a altos estándares de seguridad.',
      'SupportMe protege la información de sus usuarios mediante cifrado, control de acceso y monitoreo constante.',
      'Para más información, consulte la Política de Privacidad disponible en la plataforma.'
    ]
  },
  {
    id: 'limitacion-responsabilidad',
    title: 'Limitación de Responsabilidad',
    content: [
      'SupportMe actúa como intermediario tecnológico y no garantiza el uso correcto de los fondos por parte de los organizadores de campañas.',
      'No se responsabiliza por contenidos falsos, errores en campañas, ni por daños directos o indirectos derivados del uso del Servicio.',
      'Los usuarios donan bajo su propio criterio y asumen el riesgo que ello conlleva.'
    ]
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones a los Términos',
    content: [
      'CodeFlow Systems podrá modificar estos Términos en cualquier momento.',
      'Las modificaciones serán publicadas en la plataforma y se entenderán aceptadas por el usuario si continúa utilizando el servicio pasados 15 días desde su publicación.',
      'Es responsabilidad del usuario revisar periódicamente los Términos y Condiciones.'
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