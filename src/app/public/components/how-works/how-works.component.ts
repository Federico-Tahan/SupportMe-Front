import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-works',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './how-works.component.html',
  styleUrl: './how-works.component.scss'
})
export class HowWorksComponent {
pasos = [
    {
      numero: 1,
      titulo: '¿Cómo puedes empezar una campaña?',
      items: [
        'Establece tu objetivo de recaudación de fondos.',
        'Cuenta tu historia',
        'Agrega una fotografía o video relacionado con tu causa.'
      ]
    },
    {
      numero: 2,
      titulo: 'Comparte tu campaña con familiares y amigos',
      items: [
        'Envíales emails',
        'Envíales mensajes de texto.',
        'Comparte tu campaña en redes sociales.'
      ]
    },
    {
      numero: 3,
      titulo: 'Administra los donativos que consigas',
      items: [
        'Acepta los donativos',
        'Da las gracias a tus donantes',
      ]
    }
  ];

}
