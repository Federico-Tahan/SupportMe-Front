import { Component } from '@angular/core';
import { CategoryNavigationComponent } from "../category-navigation/category-navigation.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CategoryNavigationComponent, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
