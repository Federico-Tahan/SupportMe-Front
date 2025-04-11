import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Setup } from '../interfaces/setup';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class SetupService {
  http = inject(HttpClient);

  constructor() { }


  getSetup() : Observable<Setup>{
    return this.http.get<Setup>(environment.backApi + "setup");
  }}
