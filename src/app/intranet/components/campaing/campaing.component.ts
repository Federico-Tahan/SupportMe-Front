import { Component, inject, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, fromEvent } from 'rxjs';
import { CardCampaignComponent } from "../../../public/components/card-campaign/card-campaign.component";
import { HeaderFormComponent } from "../header-form/header-form.component";
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { ProjectFilter } from '../../../core/shared/filters/project-filter';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { SettingsComponent } from "../settings/settings.component";
import { CardSettingsComponent } from "../card-settings/card-settings.component";
import { InfoCardComponent } from "../../../components/info-card/info-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campaing',
  standalone: true,
  imports: [CommonModule, CardCampaignComponent, HeaderFormComponent, SettingsComponent, CardSettingsComponent, InfoCardComponent, RouterLink],
  templateUrl: './campaing.component.html',
  styleUrl: './campaing.component.scss'
})
export class CampaingComponent implements OnInit, AfterViewInit, OnDestroy {
  campaignService = inject(CampaignService);
  isMpConfigured = false;

  @ViewChild('scrollSentinel') scrollSentinel: ElementRef;
  
  campaigns: Campaign[] = [];
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
  private observer: IntersectionObserver;
  private scrollContainer: HTMLElement;
  
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  ngAfterViewInit(): void {
    // Encontrar el contenedor de scroll correcto (content-area)
    this.findScrollContainer();
    
    // Configurar el observer para el elemento centinela
    this.setupIntersectionObserver();
    
    // Configurar también un listener de scroll manual como respaldo
    this.setupScrollListener();
  }
  
  private findScrollContainer(): void {
    // Intentamos obtener el contenedor de contenido (.content-area)
    this.scrollContainer = document.querySelector('.content-area');
    console.log('Contenedor de scroll encontrado:', this.scrollContainer);
  }
  
  private setupIntersectionObserver(): void {
    // Configuración para IntersectionObserver
    const options = {
      root: this.scrollContainer, // Usar el contenedor de contenido como root
      rootMargin: '100px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading && this.hasMoreItems) {
          console.log('Elemento centinela visible - cargando más campañas');
          this.loadMoreCampaigns();
        }
      });
    }, options);
    
    if (this.scrollSentinel) {
      this.observer.observe(this.scrollSentinel.nativeElement);
      console.log('Observer configurado para:', this.scrollSentinel.nativeElement);
    } else {
      console.error('Elemento centinela no encontrado');
    }
  }
  
  private setupScrollListener(): void {
    // Si encontramos el contenedor de scroll, configurar el listener ahí
    if (this.scrollContainer) {
      console.log('Configurando listener de scroll en content-area');
      fromEvent(this.scrollContainer, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.checkScrollPosition();
        });
    } else {
      // De lo contrario, usar window como respaldo
      console.log('Configurando listener de scroll en window');
      fromEvent(window, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.checkScrollPosition();
        });
    }
  }
  
  private checkScrollPosition(): void {
    if (this.isLoading || !this.hasMoreItems) return;
    
    let shouldLoadMore = false;
    
    if (this.scrollContainer) {
      // Obtener dimensiones del contenedor
      const containerHeight = this.scrollContainer.clientHeight;
      const scrollHeight = this.scrollContainer.scrollHeight;
      const scrollTop = this.scrollContainer.scrollTop;
      
      console.log('Scroll Debug (contenedor):', {
        containerHeight,
        scrollHeight,
        scrollTop,
        triggerPoint: scrollHeight - 200,
        currentPosition: containerHeight + scrollTop,
        shouldTrigger: (containerHeight + scrollTop >= scrollHeight - 200)
      });
      
      shouldLoadMore = (containerHeight + scrollTop >= scrollHeight - 200);
    } else {
      // Usar dimensiones de window como respaldo
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      console.log('Scroll Debug (window):', {
        windowHeight,
        documentHeight,
        scrollTop,
        triggerPoint: documentHeight - 200,
        currentPosition: windowHeight + scrollTop,
        shouldTrigger: (windowHeight + scrollTop >= documentHeight - 200)
      });
      
      shouldLoadMore = (windowHeight + scrollTop >= documentHeight - 200);
    }
    
    if (shouldLoadMore) {
      console.log('Posición de scroll alcanzada - cargando más campañas');
      this.loadMoreCampaigns();
    }
  }
  
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadInitialData(): void {
    this.isLoading = true;
    this.campaignService.getCampaigns(this.filter, false)
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
  
  onSearch(searchText: string): void {
    this.searchText = searchText;
    this.filter = {
      ...this.filter,
      skip: 0,
      textFilter: searchText ? searchText : null 
    };
    
    this.campaigns = []; 
    this.loadInitialData();
  }
  
  onFilterChange(filterValue: string): void {
    console.log('Filtro seleccionado:', filterValue);
  }
  
  onExport(): void {
    console.log('Exportando datos...');
  }
  
  private loadMoreCampaigns(): void {
    if (this.isLoading || !this.hasMoreItems) return;
    
    this.isLoading = true;
    
    this.filter = {
      ...this.filter,
      skip: this.campaigns.length
    };
    
    this.campaignService.getCampaigns(this.filter, false)
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