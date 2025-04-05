import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarIntraComponent } from "../components/navbar-intra/navbar-intra.component";

@Component({
  selector: 'app-intranet-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NavbarIntraComponent],
  templateUrl: './intranet-layout.component.html',
  styleUrl: './intranet-layout.component.scss'
})
export class IntranetLayoutComponent {

}
