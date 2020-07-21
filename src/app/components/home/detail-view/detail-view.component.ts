import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BookingService } from 'src/app/services/booking.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TIMES } from 'src/app/utils/constants';
import { ToastService } from 'src/app/services/toast.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  currentUser: any;

  @Output()
  selectedResult = new EventEmitter();

  @Input()
  result: any;

  submitted: boolean = false;
  errorMessage: string;
  bookingData: any;
  startHour: number = 0;
  endHour: number = 24;
  times: string[] = TIMES;

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modal: NgbModal,
    public toastService: ToastService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  bookForm = this.fb.group({
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
  });

  ngOnChanges() {
    this.startHour = new Date(
      this.result.personalCoachTerm.startDate
    ).getHours();
    this.endHour = new Date(this.result.personalCoachTerm.endDate).getHours();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // this.bookingService
    //   .getBookingsForSelectedTerm(this.result.personalCoachTerm.id)
    //   .subscribe((data: any[]) => {

    //     this.events = [];
    //     this.viewDate = Helper.convertTimestampToDate(data[0]?.startAt);
    //     for (let i = 0; i < data.length; i++) {
    //       const booking: any = data[i];

    //       const calendarEvent: CalendarEvent = {
    //         start: Helper.convertTimestampToDate(booking.startAt),
    //         end: Helper.convertTimestampToDate(booking.endAt),
    //         title: `Booked`,
    //         color: colors.blue,
    //       };
    //       this.events.push(calendarEvent);
    //     }
    //   });
  }

  /**
   * For presentation
   */
  createBooking(): any {
    this.modal.open(this.modalContent, { size: 'md' });
  }
  /**
   * For presenation
   */
  onModalConfirm(): any {
    const sportFieldTerm = this.result.sportFieldTerm;
    const personalCoachTerm = this.result.personalCoachTerm;
    this.ngxLoader.start();
    this.bookingService
      .bookTerms(personalCoachTerm, sportFieldTerm, this.currentUser)
      .then((updated) => {
        if (updated) {
          this.ngOnInit();
          this.submitted = false;
          this.bookForm.reset();
          this.modal.dismissAll();
          this.toastService.show('Booking has been successfully created.', {
            classname: 'bg-success text-light',
            delay: 10000,
            autohide: true,
            headertext: 'My Sports Calendar',
          });
        }
        this.ngxLoader.stop();
        this.selectedResult.emit(null);
      });
  }

  calculatePriceForSelectedTime() {
    return (
      this.result.sportFieldTerm.price + this.result.personalCoachTerm.price
    ).toFixed(2);
  }

  onStartTimeChange(event) {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }

  onEndTimeChange(event) {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }

  onBackClicked() {
    this.selectedResult.emit(null);
  }

  get f() {
    return this.bookForm.controls;
  }
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
