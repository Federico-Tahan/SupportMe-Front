// snack-bar.service.ts
import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { SnackBarComponent, SnackBarType } from './snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private activeSnackbars: Array<{ component: any, hostElement: HTMLElement }> = [];

  show(message: string, type: SnackBarType = 'info', duration: number = 5000): void {
    const hostElement = document.createElement('div');
    document.body.appendChild(hostElement);
    
    const componentRef = createComponent(SnackBarComponent, {
      environmentInjector: this.injector,
      hostElement
    });
    
    componentRef.instance.message = message;
    componentRef.instance.type = type;
    componentRef.instance.duration = duration;
    
    componentRef.instance.closed.subscribe(() => {
      this.removeSnackbar(componentRef);
    });
    
    componentRef.changeDetectorRef.detectChanges();
    this.appRef.attachView(componentRef.hostView);
    
    this.activeSnackbars.push({ component: componentRef, hostElement });
    
    this.adjustSnackBarPositions();
  }
  
  private removeSnackbar(componentRef: any): void {
    const index = this.activeSnackbars.findIndex(sb => sb.component === componentRef);
    
    if (index !== -1) {
      const { hostElement } = this.activeSnackbars[index];
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      document.body.removeChild(hostElement);
      
      this.activeSnackbars.splice(index, 1);
      
      this.adjustSnackBarPositions();
    }
  }
  
  private adjustSnackBarPositions(): void {
    const baseOffset = 16;
    const spacing = 8; 
    this.activeSnackbars.forEach((item, index) => {
      const { hostElement } = item;
      const height = hostElement.firstElementChild?.clientHeight || 0;
      
      if (index === 0) {
        (hostElement as HTMLElement).style.bottom = `${baseOffset}px`;
      } else {
        let previousHeight = 0;
        for (let i = 0; i < index; i++) {
          const prevElement = this.activeSnackbars[i].hostElement.firstElementChild;
          previousHeight += (prevElement?.clientHeight || 0) + spacing;
        }
        (hostElement as HTMLElement).style.bottom = `${baseOffset + previousHeight}px`;
      }
    });
  }
  
  success(message: string, duration: number = 5000): void {
    this.show(message, 'success', duration);
  }
  
  error(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }
  
  info(message: string, duration: number = 5000): void {
    this.show(message, 'info', duration);
  }
  
  warning(message: string, duration: number = 5000): void {
    this.show(message, 'warning', duration);
  }
}