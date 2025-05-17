import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CampaignWrite } from '../../../core/shared/interfaces/campaign-write';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { Tags } from '../../../core/shared/interfaces/tags';
import { Assets } from '../../../core/shared/interfaces/assets';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { CategoryService } from '../../../core/shared/services/category.service';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';

interface GalleryItem {
  src: string;
  type: 'image' | 'video';
  isNew?: boolean;
}

// Extensión de la interfaz CampaignWrite para incluir isActive
interface CampaignWriteWithActive extends CampaignWrite {
  isActive?: boolean;
}

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  @ViewChild('mainImageInput') mainImageInput!: ElementRef;
  @ViewChild('galleryInput') galleryInput!: ElementRef;
  
  campaignService = inject(CampaignService);
  campaignForm!: FormGroup;
  mainImageBase64 = signal<string>('');
  galleryItems = signal<GalleryItem[]>([]);
  tags = signal<string[]>([]);
  expandedItem = signal<GalleryItem | null>(null);
  showModal = signal<boolean>(false);
  goalAmountDateError = signal<boolean>(false);
  categoryService = inject(CategoryService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  categories = signal<SimpleCategory[]>([]);
  isEditMode = signal<boolean>(false);
  campaignId = signal<number | undefined>(undefined);
  pageTitle = signal<string>('Nueva campaña');
  submitButtonText = signal<string>('Guardar campaña');
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    // Initialize the form
    this.initForm();
    
    // Get categories
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
    
    // Verificar la URL actual para debugging
    
    // Check for query parameters
    this.route.queryParams.subscribe(params => {
      
      if (params['id']) {
        this.isEditMode.set(true);
        this.campaignId.set(+params['id']);
        this.pageTitle.set('Editar campaña');
        this.submitButtonText.set('Actualizar campaña');
        
        // Fetch campaign data
        this.campaignService.getCampaignById(+params['id']).subscribe({
          next: (campaign) => {
            if (campaign) {
              this.loadCampaignData(campaign);
            }
          },
          error: (error) => {
            console.error('Error loading campaign:', error);
          }
        });
      } else {
      }
    });
  }

  atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    const goalAmount = control.get('goalAmount')?.value;
    const publicationEndDate = control.get('publicationEndDate')?.value;
    
    if ((!goalAmount || goalAmount <= 0) && !publicationEndDate) {
      return { atLeastOneRequired: true };
    }
    
    return null;
  }

  initForm(): void {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      goalAmount: [null],
      publicationEndDate: [null],
      categoryId: ['', Validators.required],
      mainImage: ['', Validators.required],
      isActive: [true] // Campo agregado, por defecto en true
    }, {
      validators: this.atLeastOneRequired
    });
  }
  
  loadCampaignData(campaign: Campaign): void {
    
    // Update form values - handle the case where categoryId might not be present
    this.campaignForm.patchValue({
      name: campaign.name,
      description: campaign.description || '',
      goalAmount: campaign.goalAmount || null,
      publicationEndDate: campaign.goalDate ? new Date(campaign.goalDate).toISOString().split('T')[0] : null,
      categoryId: campaign.categoryId ? campaign.categoryId.toString() : '',
      mainImage: 'placeholder', // Just to pass validation, will be overridden by the actual image
      isActive: campaign.isActive !== undefined ? campaign.isActive : true // Si existe el valor lo usamos, si no por defecto true
    });
    
    // Set main image
    if (campaign.mainImage) {
      this.mainImageBase64.set(campaign.mainImage);
    }
    
    // Set tags - handle both array of strings or array of objects with tag property
    if (campaign.tags && campaign.tags.length > 0) {
      let newTags: string[] = [];
      
      if (typeof campaign.tags[0] === 'string') {
        // Array of strings
        newTags = [...campaign.tags as string[]];
      } else if (typeof campaign.tags[0] === 'object') {
        // Array of objects with tag property
        newTags = campaign.tags.map((t: any) => t.tag || t);
      }
      
      this.tags.set(newTags);
    }
    
    // Set gallery items - handle both array of strings or array of objects with base64 property
    if (campaign.assets && campaign.assets.length > 0) {
      const newGalleryItems: GalleryItem[] = campaign.assets.map((asset: any) => {
        const assetSrc = typeof asset === 'string' ? asset : asset.base64 || '';
        const isVideo = assetSrc.startsWith('data:video/');
        
        return {
          src: assetSrc,
          type: isVideo ? 'video' : 'image' as 'video' | 'image',
          isNew: false
        };
      });
      
      this.galleryItems.set(newGalleryItems);
    }
  }

  onMainImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.files && target.files[0]) {
      const file = target.files[0];
      
      if (file.size > 4000 * 1024) {
        alert('La imagen debe ser menor a 4MB');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.mainImageBase64.set(e.target.result as string);
          // Actualizamos el valor en el formulario
          this.campaignForm.get('mainImage')?.setValue(this.mainImageBase64());
          this.campaignForm.get('mainImage')?.markAsTouched();
        }
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  onGalleryImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.files && target.files.length > 0) {
      const files = target.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        
        const maxSize = isVideo ? 100 * 1024 * 1024 : 4000 * 1024; 
        
        if (file.size > maxSize) {
          alert(`El ${isVideo ? 'video' : 'imagen'} "${file.name}" excede el tamaño máximo permitido`);
          continue;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            const newItem: GalleryItem = {
              src: e.target.result as string,
              type: isVideo ? 'video' : 'image' as 'video' | 'image',
              isNew: true
            };
            
            // Actualizar el array de galleryItems usando el signal
            this.galleryItems.update(items => [...items, newItem]);
            
            if (isVideo) {
              setTimeout(() => {
                const videos = document.querySelectorAll('.gallery-item video') as NodeListOf<HTMLVideoElement>;
                videos.forEach(video => {
                  video.addEventListener('error', () => {
                    console.error('Error loading video:', video.src);
                  });
                  video.load();
                });
              }, 100);
            }
          }
        };
        
        reader.readAsDataURL(file);
      }
    }
    
    if (this.galleryInput) {
      this.galleryInput.nativeElement.value = '';
    }
  }

  removeGalleryItem(index: number): void {
    this.galleryItems.update(items => items.filter((_, i) => i !== index));
  }

  addTag(): void {
    const inputElement = document.getElementById('newTagInput') as HTMLInputElement;
    const tagValue = inputElement?.value?.trim();
    
    if (tagValue) {
      this.tags.update(currentTags => [...currentTags, tagValue]);
      inputElement.value = '';
    }
  }

  removeTag(index: number): void {
    this.tags.update(currentTags => currentTags.filter((_, i) => i !== index));
  }

  expandItem(item: GalleryItem): void {
    this.expandedItem.set(item);
    this.showModal.set(true);
    
    if (item.type === 'video') {
      setTimeout(() => {
        const modalVideo = document.querySelector('.modal-content video') as HTMLVideoElement;
        if (modalVideo) {
          modalVideo.load();
        }
      }, 50);
    }
  }
  
  closeModal(): void {
    this.showModal.set(false);
    this.expandedItem.set(null);
  }

  validateDateAndAmount(): boolean {
    const goalAmount = this.campaignForm.get('goalAmount')?.value;
    const publicationEndDate = this.campaignForm.get('publicationEndDate')?.value;
    
    if ((!goalAmount || goalAmount <= 0) && !publicationEndDate) {
      this.goalAmountDateError.set(true);
      return false;
    }
    
    this.goalAmountDateError.set(false);
    return true;
  }

  onSubmit(): void {
    Object.keys(this.campaignForm.controls).forEach(key => {
      this.campaignForm.get(key)?.markAsTouched();
    });
    
    if (!this.validateDateAndAmount()) {
      return;
    }
    
    if (this.campaignForm.valid) {
      // Para los assets, simplemente enviamos la propiedad base64
      const assets: Assets[] = this.galleryItems().map(item => ({
        base64: item.src
      }));
  
      const tags: Tags[] = this.tags().map(tag => ({
        tag: tag
      }));
  
      const campaignData: CampaignWriteWithActive = {
        name: this.campaignForm.get('name')?.value,
        description: this.campaignForm.get('description')?.value || '',
        mainImage: this.mainImageBase64(),
        goalAmount: this.campaignForm.get('goalAmount')?.value || 0,
        goalDate: this.campaignForm.get('publicationEndDate')?.value || null,
        assets: assets,
        tags: tags,
        id: this.isEditMode() ? this.campaignId() : undefined,
        categoryId: +this.campaignForm.get('categoryId')?.value,
        isActive: this.campaignForm.get('isActive')?.value // Incluir el estado activo en los datos enviados
      };
  
      const request = this.isEditMode() 
        ? this.campaignService.updateCampaign(campaignData)
        : this.campaignService.createCampaign(campaignData);
      
      request.subscribe({
        next: (response) => {
          this.router.navigate(['/campaign']);
        },
        error: (error) => {
          console.error(`Error ${this.isEditMode() ? 'updating' : 'creating'} campaign:`, error);
        }
      });
    }
  }

  triggerFileInput(inputRef: ElementRef | HTMLInputElement): void {
    if (inputRef instanceof ElementRef) {
      inputRef.nativeElement.click();
    } else {
      inputRef.click();
    }
  }
}