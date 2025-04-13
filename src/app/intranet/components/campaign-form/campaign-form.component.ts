import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CampaignWrite } from '../../../core/shared/interfaces/campaign-write';
import { Tags } from '../../../core/shared/interfaces/tags';
import { Assets } from '../../../core/shared/interfaces/assets';
import { CampaignService } from '../../../core/shared/services/campaign.service';

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
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      goalAmount: [null, [Validators.min(0)]],
      publicationEndDate: [null],
      categoryId: ['', Validators.required]
    });
  }

  onMainImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.files && target.files[0]) {
      const file = target.files[0];
      
      // Validate file size (600KB = 600 * 1024 bytes)
      if (file.size > 4000 * 1024) {
        alert('La imagen debe ser menor a 600KB');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.mainImageBase64 = e.target.result as string;
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
        
        // Validate file size
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
            
            // If it's a video, ensure preview is loaded correctly
            if (isVideo) {
              setTimeout(() => {
                const videos = document.querySelectorAll('.gallery-item video') as NodeListOf<HTMLVideoElement>;
                videos.forEach(video => {
                  // Set poster if the video can't load or for initial display
                  video.addEventListener('error', () => {
                    console.error('Error loading video:', video.src);
                  });
                  // Ensure poster is generated
                  video.load();
                });
              }, 100);
            }
          }
        };
        
        reader.readAsDataURL(file);
      }
    }
    
    // Reset file input to allow selecting the same file again
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
    
    // For videos in the modal, ensure they're properly loaded
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

  onSubmit(): void {
    if (this.campaignForm.valid) {
      // Verificar que existe una imagen principal
      if (!this.mainImageBase64) {
        alert('La imagen principal es requerida');
        return;
      }
  
      // Preparar los assets (galleryItems)
      const assets: Assets[] = this.galleryItems.map(item => ({
        base64: item.src
      }));
  
      // Preparar las etiquetas
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
          // Redirigir a la página de campañas o mostrar un mensaje de éxito
          // Puedes usar el Router para navegar después de crear
          // this.router.navigate(['/campaigns']);
        },
        error: (error) => {
          console.error('Error creating campaign:', error);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar validaciones
      Object.keys(this.campaignForm.controls).forEach(key => {
        this.campaignForm.get(key)?.markAsTouched();
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