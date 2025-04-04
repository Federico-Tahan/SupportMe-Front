import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-intranet-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './intranet-layout.component.html',
  styleUrl: './intranet-layout.component.scss'
})
export class IntranetLayoutComponent {

}
