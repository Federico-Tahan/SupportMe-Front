import { Component } from '@angular/core';
import { Category } from '../../../core/shared/interfaces/category';

@Component({
  selector: 'app-category-navigation',
  standalone: true,
  imports: [],
  templateUrl: './category-navigation.component.html',
  styleUrl: './category-navigation.component.scss'
})
export class CategoryNavigationComponent {
  categories: Category[] = [
    { name: 'Featured', active: true },
    { name: 'Nearly Funded', active: false },
    { name: 'Child Protection', active: false },
    { name: 'Disaster Response', active: false },
    { name: 'Education', active: false },
    { name: 'Climate Action', active: false },
    { name: 'Gender Equality', active: false },
    { name: 'Physical Health', active: false },
    { name: 'Food Security', active: false },
    { name: 'Animal Welfare', active: false },
    { name: 'Ecosystem Restoration', active: false }
  ];
  constructor() { }

}
