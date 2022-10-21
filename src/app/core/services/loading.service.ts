import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingSubject: Subject<boolean> = new BehaviorSubject(false);
  isLoading = this.isLoadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }
}
