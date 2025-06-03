import { Component, OnInit } from '@angular/core';
import { ManagerImgService, FrontPageImage } from '../service/manager-img.service';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// @ts-ignore
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manager-img-portada',
  templateUrl: './manager-img-portada.component.html',
  styleUrls: ['./manager-img-portada.component.scss']
})
export class ManagerImgPortadaComponent implements OnInit {
  images: FrontPageImage[] = [];
  isLoading = false;
  isUploading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  maxFileSizeMB = 5; // Maximum file size in MB
  isCompressing = false;

  constructor(private managerImgService: ManagerImgService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.isLoading = true;
    this.managerImgService.getFrontPageImages()
      .pipe(
        catchError(error => {
          console.error('Error loading images:', error);
          
          // Handle specific error codes
          if (error.status === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar con el servidor. Esto puede deberse a problemas de CORS o de red.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar las imágenes de portada'
            });
          }
          return of([]); // Return empty array to avoid breaking the component
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(images => {
        this.images = images;
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > this.maxFileSizeMB) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: `El tamaño máximo permitido es ${this.maxFileSizeMB}MB. Su archivo tiene ${fileSizeMB.toFixed(2)}MB.`
        });
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Compress image to reduce file size
  private compressImage(file: File, maxSizeKB: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate the width and height, preserving the aspect ratio
          const maxDimension = 1200; // Max dimension for either width or height
          if (width > height && width > maxDimension) {
            height = Math.round(height * maxDimension / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round(width * maxDimension / height);
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Start with high quality
          let quality = 0.8;
          let compressedFile: File;
          
          const compressWithQuality = (q: number) => {
            // Convert to blob with specified quality
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              // Create new file from blob
              compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              
              console.log(`Compressed size with quality ${q}: ${compressedFile.size / 1024} KB`);
              
              // If still too large and quality can be reduced further, try again
              if (compressedFile.size > maxSizeKB * 1024 && q > 0.3) {
                compressWithQuality(q - 0.1);
              } else {
                resolve(compressedFile);
              }
            }, 'image/jpeg', q);
          };
          
          compressWithQuality(quality);
        };
        
        img.onerror = () => {
          reject(new Error('Error loading image'));
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
  
  uploadImage(): void {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor seleccione una imagen para subir'
      });
      return;
    }

    this.isUploading = true;
    this.isCompressing = true;
    
    this.compressImage(this.selectedFile)
      .then(compressedFile => {
        this.isCompressing = false;
        
        this.uploadCompressedImage(compressedFile);
      })
      .catch(error => {
        console.error('Image compression error:', error);
        this.isCompressing = false;
        
        this.uploadCompressedImage(this.selectedFile!);
      });
  }
  
  private uploadCompressedImage(file: File): void {
    this.managerImgService.uploadFrontPageImage(file)
      .pipe(
        catchError(error => {
          console.error('Error uploading image:', error);
          
          // Handle specific error codes
          if (error.status === 413) {
            Swal.fire({
              icon: 'error',
              title: 'Imagen demasiado grande',
              text: 'El servidor rechazó la imagen porque es demasiado grande. Por favor, utilice una imagen más pequeña.'
            });
          } else if (error.status === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar con el servidor. Esto puede deberse a problemas de CORS o de red.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo subir la imagen de portada'
            });
          }
          return of(null); // Return observable that completes
        }),
        finalize(() => {
          this.isUploading = false;
          this.selectedFile = null;
          this.previewUrl = null;
        })
      )
      .subscribe((response: FrontPageImage | null) => {
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Imagen de portada subida correctamente'
          });
          this.loadImages();
        }
      });
  }

  toggleImageStatus(image: FrontPageImage): void {
    // Toggle the active status locally first for immediate UI feedback
    const newActiveStatus = !image.active;
    
    // Show loading indicator
    const loadingToast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 0,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    
    loadingToast.fire({
      icon: 'info',
      title: 'Actualizando estado...'
    });
    
    // Call the service to update on the server using PATCH
    this.managerImgService.toggleFrontPageImageStatus(image.id, newActiveStatus)
      .pipe(
        catchError(error => {
          console.error('Error toggling image status:', error);
          
          // Revert the local change since the server update failed
          image.active = !newActiveStatus;
          
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cambiar el estado de la imagen'
          });
          
          return of(null);
        })
      )
      .subscribe(updatedImage => {
        // Close the loading toast
        Swal.close();
        
        if (updatedImage) {
          // Update the local image with the server response
          const index = this.images.findIndex(img => img.id === updatedImage.id);
          if (index !== -1) {
            this.images[index] = updatedImage;
          }
          
          // Show success message
          const successToast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          
          successToast.fire({
            icon: 'success',
            title: `Imagen ${updatedImage.active ? 'activada' : 'desactivada'} correctamente`
          });
        }
      });
  }

  deleteImage(image: FrontPageImage): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.managerImgService.deleteFrontPageImage(image.id)
          .subscribe({
            next: () => {
              this.images = this.images.filter(img => img.id !== image.id);
              Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La imagen ha sido eliminada correctamente'
              });
            },
            error: (error) => {
              console.error('Error deleting image:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la imagen'
              });
            }
          });
      }
    });
  }

  cancelUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
