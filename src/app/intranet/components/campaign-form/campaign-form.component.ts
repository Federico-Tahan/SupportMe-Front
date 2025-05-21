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
import { SnackBarService } from '../../../components/snack-bar/snack-bar.service';


interface GalleryItem {
  src: string;
  type: 'image' | 'video';
  isNew?: boolean;
}

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
  categoryService = inject(CategoryService);
  snackBarService = inject(SnackBarService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  campaignForm!: FormGroup;
  mainImageBase64 = signal<string>('');
  galleryItems = signal<GalleryItem[]>([]);
  tags = signal<string[]>([]);
  expandedItem = signal<GalleryItem | null>(null);
  showModal = signal<boolean>(false);
  goalAmountDateError = signal<boolean>(false);
  categories = signal<SimpleCategory[]>([]);
  isEditMode = signal<boolean>(false);
  campaignId = signal<number | undefined>(undefined);
  pageTitle = signal<string>('Nueva campaña');
  submitButtonText = signal<string>('Guardar campaña');
  isLoading = false;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.isLoading = true;
    this.initForm();
    
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        this.snackBarService.error('Error al cargar categorías');
        console.error('Error loading categories:', error);
      },
      complete: () => {
        if (!this.isEditMode()) {
          this.isLoading = false;
        }
      }
    });
    
    this.route.queryParams.subscribe(params => {
      
      if (params['id']) {
        this.isEditMode.set(true);
        this.campaignId.set(+params['id']);
        this.pageTitle.set('Editar campaña');
        this.submitButtonText.set('Actualizar campaña');
        
        this.campaignService.getCampaignById(+params['id']).subscribe({
          next: (campaign) => {
            if (campaign) {
              this.loadCampaignData(campaign);
            }
          },
          error: (error) => {
            this.snackBarService.error('Error al cargar los datos de la campaña');
            console.error('Error loading campaign:', error);
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
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
      isActive: [true]
    }, {
      validators: this.atLeastOneRequired
    });
  }
  
  loadCampaignData(campaign: Campaign): void {
    this.campaignForm.patchValue({
      name: campaign.name,
      description: campaign.description || '',
      goalAmount: campaign.goalAmount || null,
      publicationEndDate: campaign.goalDate ? new Date(campaign.goalDate).toISOString().split('T')[0] : null,
      categoryId: campaign.categoryId ? campaign.categoryId.toString() : '',
      mainImage: 'placeholder',
      isActive: campaign.isActive !== undefined ? campaign.isActive : true
    });
    
    if (campaign.mainImage) {
      this.mainImageBase64.set(campaign.mainImage);
    }
    
    if (campaign.tags && campaign.tags.length > 0) {
      let newTags: string[] = [];
      
      if (typeof campaign.tags[0] === 'string') {
        newTags = [...campaign.tags as string[]];
      } else if (typeof campaign.tags[0] === 'object') {
        newTags = campaign.tags.map((t: any) => t.tag || t);
      }
      
      this.tags.set(newTags);
    }
    
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
        this.snackBarService.error('La imagen debe ser menor a 4MB');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.mainImageBase64.set(e.target.result as string);
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
      const successfulUploads = { images: 0, videos: 0 };
      const failedUploads = { images: 0, videos: 0 };
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        
        const maxSize = isVideo ? 100 * 1024 * 1024 : 4000 * 1024; 
        
        if (file.size > maxSize) {
          this.snackBarService.warning(`El ${isVideo ? 'video' : 'imagen'} "${file.name}" excede el tamaño máximo permitido`);
          isVideo ? failedUploads.videos++ : failedUploads.images++;
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
            
            this.galleryItems.update(items => [...items, newItem]);
            isVideo ? successfulUploads.videos++ : successfulUploads.images++;
            
            if (isVideo) {
              setTimeout(() => {
                const videos = document.querySelectorAll('.gallery-item video') as NodeListOf<HTMLVideoElement>;
                videos.forEach(video => {
                  video.addEventListener('error', () => {
                    console.error('Error loading video:', video.src);
                    this.snackBarService.error('Error al cargar video');
                  });
                  video.load();
                });
              }, 100);
            }
            
            // Mostrar mensaje de éxito al final (después de procesar todos los archivos)
            if (i === files.length - 1) {
              if (successfulUploads.images > 0 || successfulUploads.videos > 0) {
                let message = 'Archivos agregados: ';
                if (successfulUploads.images > 0) {
                  message += `${successfulUploads.images} imagen(es)`;
                }
                if (successfulUploads.videos > 0) {
                  message += successfulUploads.images > 0 ? ` y ${successfulUploads.videos} video(s)` : `${successfulUploads.videos} video(s)`;
                }
              }
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
    const item = this.galleryItems()[index];
    const type = item.type === 'image' ? 'Imagen' : 'Video';
    
    this.galleryItems.update(items => items.filter((_, i) => i !== index));
  }

  addTag(): void {
    const inputElement = document.getElementById('newTagInput') as HTMLInputElement;
    const tagValue = inputElement?.value?.trim();
    
    if (tagValue) {
      // Verificar si la etiqueta ya existe
      const tagExists = this.tags().some(tag => tag.toLowerCase() === tagValue.toLowerCase());
      
      if (tagExists) {
        this.snackBarService.warning('Esta etiqueta ya existe');
      } else {
        this.tags.update(currentTags => [...currentTags, tagValue]);
        inputElement.value = '';
      }
    }
  }

  removeTag(index: number): void {
    const tagName = this.tags()[index];
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
        isActive: this.campaignForm.get('isActive')?.value
      };
      
      this.isLoading = true;
  
      const request = this.isEditMode() 
        ? this.campaignService.updateCampaign(campaignData)
        : this.campaignService.createCampaign(campaignData);
      
      request.subscribe({
        next: (response) => {
          this.snackBarService.success(this.isEditMode() ? 'Campaña actualizada con éxito' : 'Campaña creada con éxito');
          this.router.navigate(['/campaign']);
        },
        error: (error) => {
          this.snackBarService.error(this.isEditMode() ? 'Error al actualizar la campaña' : 'Error al crear la campaña');
          console.error(`Error ${this.isEditMode() ? 'updating' : 'creating'} campaign:`, error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.snackBarService.error('Por favor, completa todos los campos requeridos');
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