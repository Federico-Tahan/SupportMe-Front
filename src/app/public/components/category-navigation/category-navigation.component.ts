import { Component, inject, OnInit } from '@angular/core';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';
import { CategoryService } from '../../../core/shared/services/category.service';
import { RouterLink } from '@angular/router';
import { InlineLoadingSpinnerComponent } from "../../../components/inline-loading-spinner/inline-loading-spinner.component";

@Component({
  selector: 'app-category-navigation',
  standalone: true,
  imports: [RouterLink, InlineLoadingSpinnerComponent],
  templateUrl: './category-navigation.component.html',
  styleUrl: './category-navigation.component.scss'
})
export class CategoryNavigationComponent implements OnInit{
  
  categoryService = inject(CategoryService);
  isLoading = false;
  categories: SimpleCategory[] = [];
  constructor() { }
  
  
  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

}
