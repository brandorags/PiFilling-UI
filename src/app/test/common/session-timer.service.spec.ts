import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SessionTimerService } from '../../common/session-timer.service';

describe('SessionTimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [SessionTimerService]
    });
  });

  it('should be created', inject([SessionTimerService], (service: SessionTimerService) => {
    expect(service).toBeTruthy();
  }));
});
