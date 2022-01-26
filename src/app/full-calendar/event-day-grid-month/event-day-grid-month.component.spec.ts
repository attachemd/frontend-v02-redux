import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventDayGridMonthComponent} from './event-day-grid-month.component';

describe('EventDayGridMonthComponent', () => {
    let component: EventDayGridMonthComponent;
    let fixture: ComponentFixture<EventDayGridMonthComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventDayGridMonthComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EventDayGridMonthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
