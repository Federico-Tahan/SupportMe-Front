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
        'Bienvenido a SupportMe proporcionado por CodeFlow Systems. Nos complace ofrecerle acceso al Servicio (como se define más abajo), sujeto a estos términos y condiciones (los "Términos de Servicio") y a la Política de Privacidad correspondiente de CodeFlow Systems.',
        'Al acceder y utilizar el Servicio, usted expresa su consentimiento, acuerdo y entendimiento de los Términos de Servicio y la Política de Privacidad. Si no está de acuerdo con los Términos de Servicio o la Política de Privacidad, no utilice el Servicio.',
        'Si utiliza el servicio está aceptando las modalidades operativas en vigencia descriptas más adelante, las declara conocer y aceptar, las que se habiliten en el futuro y en los términos y condiciones que a continuación se detallan.'
      ]
    },
    {
      id: 'operaciones-habilitadas',
      title: 'Operaciones Habilitadas',
      content: [
        'Las operaciones habilitadas son aquellas que estarán disponibles para los clientes, quienes deberán cumplir los requisitos que se encuentren vigentes en su momento para operar el Servicio.',
        'Las mismas podrán ser ampliadas o restringidas por el proveedor, comunicándolo previamente con una antelación no menor a 60 días, y comprenden entre otras, sin que pueda entenderse taxativamente las que se indican a continuación.'
      ]
    },
    {
      id: 'transacciones',
      title: 'Transacciones',
      content: [
        'En ningún caso debe entenderse que la solicitud de un producto o servicio implica obligación alguna para el Acceso y uso del Servicio.'
      ]
    },
    {
      id: 'acceso-uso',
      title: 'Acceso y Uso del Servicio',
      content: [
        'Para operar el Servicio se requerirá siempre que se trate de clientes de SupportMe, quienes podrán acceder mediante cualquier dispositivo con conexión a la Red Internet.',
        'El cliente deberá proporcionar el número de documento de identidad y la clave personal, que será provista por la aplicación como requisito previo a la primera operación, en la forma que le sea requerida.',
        'La clave personal y todo o cualquier otro mecanismo adicional de autenticación personal provisto por el Banco tiene el carácter de secreto e intransferible, y por lo tanto asumo las consecuencias de su divulgación a terceros, liberando a SupportMe de toda responsabilidad que de ello se derive.',
        'En ningún caso SupportMe requerirá que le suministre la totalidad de los datos, ni enviará mail requiriendo información personal alguna.'
      ]
    },
    {
      id: 'costo-servicio',
      title: 'Costo del Servicio',
      content: [
        'La empresa CodeFlow Systems podrá cobrar comisiones por el mantenimiento y/o uso de este Servicio o los que en el futuro implemente, entendiéndose facultado expresamente para efectuar los correspondientes débitos en mis cuentas, aún en descubierto, por lo que presto para ello mi expresa conformidad.',
        'En caso de cualquier modificación a la presente previsión, lo comunicará con al menos 60 días de antelación.'
      ]
    },
    {
      id: 'validez-operaciones',
      title: 'Validez de Operaciones y Notificaciones',
      content: [
        'Los registros emitidos por la app serán prueba suficiente de las operaciones cursadas por dicho canal. Renuncio expresamente a cuestionar la idoneidad o habilidad de ese medio de prueba.',
        'A los efectos del cumplimiento de disposiciones legales o contractuales, se otorga a las notificaciones por este medio el mismo alcance de las notificaciones mediante documento escrito.'
      ]
    },
    {
      id: 'propiedad-intelectual',
      title: 'Propiedad Intelectual',
      content: [
        'El software en Argentina está protegido por la ley 11.723, que regula la propiedad intelectual y los derechos de autor de todos aquellos creadores de obras artísticas, literarias y científicas.'
      ]
    },
    {
      id: 'privacidad-informacion',
      title: 'Privacidad de la Información',
      content: [
        'Para utilizar los Servicios ofrecidos por CodeFlow Systems, los Usuarios deberán facilitar determinados datos de carácter personal.',
        'Su información personal se procesa y almacena en servidores o medios magnéticos que mantienen altos estándares de seguridad y protección tanto física como tecnológica.',
        'Para mayor información sobre la privacidad de los Datos Personales y casos en los que será revelada la información personal, se pueden consultar nuestras políticas de privacidad.'
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