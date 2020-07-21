import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { BookingService } from 'src/app/services/booking.service';
import { AuthService } from 'src/app/services/auth.service';
import { User, Role } from 'src/app/models/user';
import { TermType } from 'src/app/models/term';
import { TIMES, SPORTS } from 'src/app/utils/constants';
import { Helper } from 'src/app/utils/helper';
import { CalendarEvent } from 'angular-calendar';
import { ToastService } from 'src/app/services/toast.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('modalConfirm', { static: true }) modalConfirm: TemplateRef<any>;

  options = {
    componentRestrictions: {
      country: ['DE'],
    },
  };

  submitted = false;
  selectedTermId: any;
  constructor(
    private modal: NgbModal,
    private bookingService: BookingService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  termForm = this.initialiseForm();
  as: any;
  terms: any[] = [];
  currentUser: User;
  events: any[];
  times: string[] = TIMES;
  sports: string[] = SPORTS;
  minDate: Date = new Date();

  get f() {
    return this.termForm.controls;
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.city) {
      this.termForm.get('city').setValue(this.currentUser.city);
    }
    this.bookingService
      .getTermsForCurrentUser(this.currentUser.uid)
      .subscribe((data: any) => {
        this.terms = data;
        this.events = this.populateEventsFromTermsArray(this.terms);
        this.ngxLoader.stop();
      });
  }

  handleEvent(event: any): void {
    this.selectedTermId = event.data.id;
    this.modal.open(this.modalConfirm, { size: 'md' });
  }

  populateEventsFromTermsArray(terms: any): any[] {
    const events = [];

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const event = {
        start: Helper.convertTimestampToDate(term.startDate),
        end: Helper.convertTimestampToDate(term.endDate),
        title: `${term.title} Price: ${term.price}`,
        data: term,
        color: colors.green,
        actions: [
          {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.handleEvent(event);
            },
          },
        ],
      };
      events.push(event);
    }
    return events;
  }

  public handleAddressChange(address: any) {
    this.termForm.get('city').setValue(address.name);
  }

  onStartTimeSelect(event) {}
  onEndTimeSelect(event) {}
  onSportSelect(event) {}
  createNewTerm() {
    this.submitted = true;
    if (this.termForm.invalid) {
      return;
    }
    this.ngxLoader.start();
    const term = this.setDataTransferValues(this.termForm);
    term.user = this.currentUser;
    term.booked = false;
    if (this.currentUser.role === Role.PERSONAL_COACH) {
      term.type = TermType.PERSONAL_COACH;
    } else {
      term.type = TermType.SPORT_FIELD_PROVIDER;
    }
    this.bookingService.createTerm(term).then(() => {
      this.submitted = false;
      this.termForm.reset();
      this.toastService.show('Term has been successfully created.', {
        classname: 'bg-success text-light',
        delay: 10000,
        autohide: true,
        headertext: 'My Sports Calendar',
      });
      this.ngxLoader.stop();
    });
  }

  setDataTransferValues(form: any): any {
    const {
      city,
      sport,
      startDate,
      startTime,
      endDate,
      endTime,
      title,
      price,
      description,
    } = this.termForm.value;

    const startAt = this.setDateTime(startDate, startTime);
    const endAt = this.setDateTime(endDate, endTime);

    return {
      city,
      sport,
      startDate: startAt,
      endDate: endAt,
      title,
      price,
      description,
    };
  }

  setDateTime(selectedDate: string, time: string): Date {
    const timeParts: string[] = time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const date: Date = new Date(selectedDate);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }

  initialiseForm() {
    return this.fb.group({
      city: [
        this.currentUser?.city ? this.currentUser?.city : null,
        Validators.required,
      ],
      sport: [null, Validators.required],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endDate: [null, Validators.required],
      endTime: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  resetForm(): void {}

  onModalConfirm() {
    this.ngxLoader.start();

    this.bookingService.deleteTerm(this.selectedTermId).then(() => {
      this.modal.dismissAll();
      this.toastService.show('Term has been successfully deleted.', {
        classname: 'bg-warning text-light',
        delay: 10000,
        autohide: true,
        headertext: 'My Sports Calendar',
      });
      this.ngxLoader.stop();
    });
  }
}
const colors: any = {
  green: {
    primary: '#f5f5f5',
    secondary: '#ffffff40',
  },
  blue: {
    primary: '#991e90ff',
    secondary: '#0076BE',
  },
  yellow: {
    primary: '#99e3bc08',
    secondary: '#99FDF1BA',
  },
};
