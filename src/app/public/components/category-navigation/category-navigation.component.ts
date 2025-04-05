import { Component, inject, OnInit } from '@angular/core';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';
import { CategoryService } from '../../../core/shared/services/category.service';

@Component({
  selector: 'app-category-navigation',
  standalone: true,
  imports: [],
  templateUrl: './category-navigation.component.html',
  styleUrl: './category-navigation.component.scss'
})
export class CategoryNavigationComponent implements OnInit{
  
  categoryService = inject(CategoryService);
  
  categories: SimpleCategory[] = [];
  constructor() { }
  
  
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next:(data) => {
        this.categories = data;
      }
    })
  }

}
