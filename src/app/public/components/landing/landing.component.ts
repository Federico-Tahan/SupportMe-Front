import { Component } from '@angular/core';
import { CategoryNavigationComponent } from "../category-navigation/category-navigation.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CategoryNavigationComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
