import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { SimpleCategory } from '../interfaces/simple-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);

  constructor() { }


  getCategories() : Observable<SimpleCategory[]>{
    return this.http.get<SimpleCategory[]>(environment.backApi + "category");
  }
}
