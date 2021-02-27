import { Injectable } from "@angular/core";
import { environment } from '@environment';

@Injectable({
  providedIn: "root"
})
export class SignalService {
  private breadCrumbStack: string[] = []


  get breadCrumbTrail(){ return this.breadCrumbStack }
  
}