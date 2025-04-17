import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CardSettingsComponent } from "../../../intranet/components/card-settings/card-settings.component";
import { CardCampaignComponent } from "../card-campaign/card-campaign.component";
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';
import { CategoryService } from '../../../core/shared/services/category.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectFilter } from '../../../core/shared/filters/project-filter';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, CardSettingsComponent, CardCampaignComponent, FormsModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit{
  campaignService = inject(CampaignService);
  categoryService = inject(CategoryService);
  
  categories: SimpleCategory[] = [];
  campaigns: Campaign[] = [];
  selectedCategory: string = 'Todas';
  selectedCategoryId: number | null = null;
  route = inject(ActivatedRoute); 

  filter: ProjectFilter = {
    limit: 10,
    skip: 0,
    textFilter: null,
    sorting: [],
    categoryId: null
  };
  
  isLoading: boolean = false;
  hasMoreItems: boolean = true;
  
  searchText: string = '';
  
  private destroy$ = new Subject<void>();
  
  constructor() { }
  
  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['category']) {
        const categoryId = Number(params['category']);
        if (!isNaN(categoryId)) {
          this.selectedCategoryId = categoryId;
          this.filter.categoryId = categoryId;
          
          this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
            next: (categories) => {
              this.categories = categories;
              const selectedCategory = categories.find(c => c.id === categoryId);
              if (selectedCategory) {
                this.selectedCategory = (selectedCategory.name.length > 12) ? 
                  (selectedCategory.name.substring(0, 10)) + '...' : 
                  selectedCategory.name;
              }
            }
          });
        }
      }
      
      this.loadInitialData();
      this.loadCategories();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadInitialData(): void {
    this.isLoading = true;
    this.campaignService.getCampaigns(this.filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.campaigns = data.items;
          this.hasMoreItems = (data.totalRegisters > this.campaigns.length);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar campañas:', err);
          this.isLoading = false;
        }
      });
  }
  
  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error al cargar categorías:', err);
        }
      });
  }

  selectCategory(category: SimpleCategory | null): void {
    if (category === null) {
      this.selectedCategory = 'Todas';
      this.selectedCategoryId = null;
    } else {
      this.selectedCategory = (category.name.length > 12) ? 
        (category.name.substring(0, 10)) + '...' : 
        category.name;
      this.selectedCategoryId = category.id;
    }
    
    this.filter = {
      ...this.filter,
      skip: 0,
      categoryId: this.selectedCategoryId
    };
    
    this.campaigns = [];
    this.loadInitialData();
  }
  
  onSearchChange(text: string): void {
    this.searchText = text;
    this.filter = {
      ...this.filter,
      skip: 0,
      textFilter: text 
    };
    
    this.campaigns = [];
    this.loadInitialData();
  }
  
  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (this.isLoading || !this.hasMoreItems) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if ((windowHeight + scrollTop) >= (documentHeight - 200)) {
      this.loadMoreItems();
    }
  }
  
  private loadMoreItems(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    this.filter = {
      ...this.filter,
      skip: this.campaigns.length
    };
    
    
    this.campaignService.getCampaigns(this.filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.campaigns = [...this.campaigns, ...data.items];
          
          this.hasMoreItems = (this.campaigns.length < data.totalRegisters);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar más campañas:', err);
          this.isLoading = false;
        }
      });
  }

}
