import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('#setLoading(): should set BehaviorSubject isLoadingSubject to a specific bool value', () => {
    let value: boolean | undefined;

    service.isLoading.subscribe((v) => (value = v));

    service.setLoading(true);
    expect(value).toBeTrue();

    service.setLoading(false);
    expect(value).toBeFalse();
  });
});
