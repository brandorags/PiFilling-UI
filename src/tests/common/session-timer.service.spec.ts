import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SimpleTimer } from 'ng2-simple-timer';

import { SessionTimerService } from '../../app/common/session-timer.service';

describe('SessionTimerService', () => {
  let timer: SimpleTimer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        SimpleTimer,
        SessionTimerService
      ]
    });

    timer = TestBed.get(SimpleTimer);
  });

  it('should be created', inject([SessionTimerService], (service: SessionTimerService) => {
    expect(service).toBeTruthy();
  }));

  it('should start timer', inject([SessionTimerService], (service: SessionTimerService) => {
    let timerIds = timer.getTimer();
    let subscriptionIds = timer.getSubscription();

    expect(timerIds.length).toEqual(0);
    expect(subscriptionIds.length).toEqual(0);

    service.startTimer();

    timerIds = timer.getTimer();
    subscriptionIds = timer.getSubscription();

    expect(timerIds.length).toEqual(1);
    expect(subscriptionIds.length).toEqual(1);

    let timerId = timerIds[0];
    let subscriptionId = subscriptionIds[0];

    expect(timerId).toEqual(service.sessionTimerId);
    expect(subscriptionId).toContain(service.sessionTimerId);
  }));

  it('should stop timer', inject([SessionTimerService], (service: SessionTimerService) => {
    service.startTimer();

    let timerIds = timer.getTimer();
    let subscriptionIds = timer.getSubscription();

    expect(timerIds.length).toEqual(1);
    expect(subscriptionIds.length).toEqual(1);

    service.stopTimer();

    timerIds = timer.getTimer();
    subscriptionIds = timer.getSubscription();

    expect(timerIds.length).toEqual(0);
    expect(subscriptionIds.length).toEqual(0);
  }));

  it('should have a running timer', inject([SessionTimerService], (service: SessionTimerService) => {
    service.startTimer();

    expect(service.isTimerRunning()).toBeTruthy();
  }));

  it('should have a stopped timer', inject([SessionTimerService], (service: SessionTimerService) => {
    service.startTimer();
    service.stopTimer();

    expect(service.isTimerRunning()).toBeFalsy();
  }));
});
