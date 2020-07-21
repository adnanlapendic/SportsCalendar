import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  CalendarView,
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameMonth, isSameDay } from 'date-fns';
import { Term } from 'src/app/models/term';
import { Helper } from 'src/app/utils/helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnChanges {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: any;

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  @Input() terms: Term[] = [];
  @Input() events: any[] = [];

  constructor(private modal: NgbModal, private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: any): void {
    this.modalData = event;
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onStartTimeSelect(event) {}
  onEndTimeSelect(event) {}
  onSportSelect(event) {}

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    for (let i = 0; i < this.terms.length; i++) {
      const term: Term = this.terms[i];
      const startDate = Helper.convertTimestampToDate(term.startDate);
      const endDate = Helper.convertTimestampToDate(term.endDate);
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      renderEvent.body.forEach((day) => {
        if (
          day.date.getFullYear() === startDate.getFullYear() &&
          (day.date.getMonth() === startDate.getMonth() ||
            day.date.getMonth() === endDate.getMonth())
        ) {
          const dayOfMonth = day.date.getDate();
          if (dayOfMonth >= startDay && dayOfMonth <= endDay && day.inMonth) {
            day.cssClass = 'bg-pink';
          }
        }
      });
    }
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    for (let i = 0; i < this.terms.length; i++) {
      const term: Term = this.terms[i];
      const startDate = Helper.convertTimestampToDate(term.startDate);
      const endDate = Helper.convertTimestampToDate(term.endDate);
      if (endDate.getDate() - startDate.getDate() > 0) {
        const diffInDays = endDate.getDate() - startDate.getDate();
        for (let index = 0; index < diffInDays; index++) {
          const currentDate = new Date(
            startDate.setDate(startDate.getDate() + index)
          );
          const startTime = startDate.getHours();
          const endTime = endDate.getHours();
          const dayOfWeek = currentDate.getDay();

          renderEvent.hourColumns.forEach((hourColumn) => {
            if (
              hourColumn.date.getFullYear() === currentDate.getFullYear() &&
              hourColumn.date.getMonth() === currentDate.getMonth() &&
              hourColumn.date.getDate() === currentDate.getDate()
            ) {
              hourColumn.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                  if (
                    segment.date.getHours() >= startTime &&
                    segment.date.getHours() < endTime &&
                    segment.date.getDay() === dayOfWeek
                  ) {
                    segment.cssClass = 'bg-pink';
                  }
                });
              });
            }
          });
        }
      }
      const startTime = startDate.getHours();
      const endTime = endDate.getHours();
      const dayOfWeek = startDate.getDay();
      renderEvent.hourColumns.forEach((hourColumn) => {
        if (
          hourColumn.date.getFullYear() === startDate.getFullYear() &&
          hourColumn.date.getMonth() === startDate.getMonth() &&
          hourColumn.date.getDate() === endDate.getDate()
        ) {
          hourColumn.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
              if (
                segment.date.getHours() >= startTime &&
                segment.date.getHours() < endTime &&
                segment.date.getDay() === dayOfWeek
              ) {
                segment.cssClass = 'bg-pink';
              }
            });
          });
        }
      });
    }
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    for (let i = 0; i < this.terms.length; i++) {
      const term: Term = this.terms[i];
      const startDate = Helper.convertTimestampToDate(term.startDate);
      const endDate = Helper.convertTimestampToDate(term.endDate);
      const startTime = startDate.getHours();
      const endTime = endDate.getHours();

      if (endDate.getDay() - startDate.getDay() > 0) {
        const diffInDays = endDate.getDay() - startDate.getDay();
        for (let index = 0; index < diffInDays; index++) {
          const currentDate = new Date(
            startDate.setDate(startDate.getDate() + index)
          );
          renderEvent.hourColumns.forEach((hourColumn) => {
            if (
              hourColumn.date.getFullYear() === currentDate.getFullYear() &&
              hourColumn.date.getMonth() === currentDate.getMonth() &&
              hourColumn.date.getDate() === currentDate.getDate()
            ) {
              hourColumn.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                  if (
                    segment.date.getHours() >= startTime &&
                    segment.date.getHours() < endTime
                  ) {
                    segment.cssClass = 'bg-pink';
                  }
                });
              });
            }
          });
        }
      }

      renderEvent.hourColumns.forEach((hourColumn) => {
        if (
          hourColumn.date.getFullYear() === startDate.getFullYear() &&
          hourColumn.date.getMonth() === startDate.getMonth() &&
          hourColumn.date.getDate() === endDate.getDate()
        ) {
          hourColumn.hours.forEach((hour) => {
            hour.segments.forEach((segment) => {
              if (
                segment.date.getHours() >= startTime &&
                segment.date.getHours() < endTime
              ) {
                segment.cssClass = 'bg-pink';
              }
            });
          });
        }
      });
    }
  }
}
