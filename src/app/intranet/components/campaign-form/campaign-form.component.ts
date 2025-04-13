import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CampaignWrite } from '../../../core/shared/interfaces/campaign-write';
import { Tags } from '../../../core/shared/interfaces/tags';
import { Assets } from '../../../core/shared/interfaces/assets';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { CategoryService } from '../../../core/shared/services/category.service';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';

interface GalleryItem {
  src: string;
  type: 'image' | 'video';
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
  mainImageBase64: string = '';
  galleryItems: GalleryItem[] = [];
  tags: string[] = [];
  expandedItem: GalleryItem | null = null;
  showModal = false;
  goalAmountDateError = false;
  categoryService = inject(CategoryService);
    
  categories: SimpleCategory[] = [];
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next:(data) => {
        this.categories = data;
      }
    })
    this.initForm();
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
      mainImage: ['', Validators.required] // Agregamos la imagen principal como campo requerido
    }, {
      validators: this.atLeastOneRequired
    });
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
          this.mainImageBase64 = e.target.result as string;
          // Actualizamos el valor en el formulario
          this.campaignForm.get('mainImage')?.setValue(this.mainImageBase64);
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
            this.galleryItems.push({
              src: e.target.result as string,
              type: isVideo ? 'video' : 'image'
            });
            
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
    this.galleryItems.splice(index, 1);
  }

  addTag(): void {
    const inputElement = document.getElementById('newTagInput') as HTMLInputElement;
    const tagValue = inputElement?.value?.trim();
    
    if (tagValue) {
      this.tags.push(tagValue);
      inputElement.value = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  expandItem(item: GalleryItem): void {
    this.expandedItem = item;
    this.showModal = true;
    
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
    this.showModal = false;
    this.expandedItem = null;
  }

  validateDateAndAmount(): boolean {
    const goalAmount = this.campaignForm.get('goalAmount')?.value;
    const publicationEndDate = this.campaignForm.get('publicationEndDate')?.value;
    
    if ((!goalAmount || goalAmount <= 0) && !publicationEndDate) {
      this.goalAmountDateError = true;
      return false;
    }
    
    this.goalAmountDateError = false;
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
      const assets: Assets[] = this.galleryItems.map(item => ({
        base64: item.src
      }));
  
      const tags: Tags[] = this.tags.map(tag => ({
        tag: tag
      }));
  
      const campaignData: CampaignWrite = {
        name: this.campaignForm.get('name')?.value,
        description: this.campaignForm.get('description')?.value || '',
        mainImage: this.mainImageBase64,
        goalAmount: this.campaignForm.get('goalAmount')?.value || 0,
        goalDate: this.campaignForm.get('publicationEndDate')?.value || null,
        assets: assets,
        tags: tags
      };
  
      
      this.campaignService.createCampaign(campaignData).subscribe({
        next: (response) => {
          console.log('Campaign created successfully:', response);
          // this.router.navigate(['/campaigns']);
        },
        error: (error) => {
          console.error('Error creating campaign:', error);
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