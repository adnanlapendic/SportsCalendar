import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { User, Role } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  currentUser: User;
  orders: any[];
  bookings: any[];
  selectedBooking: any;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('cancelOrConfirmModal', { static: true })
  cancelOrConfirmModal: TemplateRef<any>;

  constructor(
    private bookingService: BookingService,
    private auth: AuthService,
    private modal: NgbModal,
    public toastService: ToastService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    this.currentUser = this.auth.getCurrentUser();
    this.bookingService
      .getBookingsForCurrentUser(this.currentUser)
      .subscribe((data) => {
        this.bookings = data;
        this.ngxLoader.stop();
      });
  }

  onOrderClicked(booking) {
    this.selectedBooking = booking;
  }

  cancelTerm() {
    this.modal.open(this.modalContent, { size: 'md' });
  }

  onModalConfirm() {
    this.ngxLoader.start();
    this.bookingService
      .deleteBooking(
        this.selectedBooking.id,
        this.selectedBooking.perosnalCoach.id,
        this.selectedBooking.sportField.id
      )
      .then((data) => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
        this.selectedBooking = null;
        this.toastService.show('Booking has been successfully deleted.', {
          classname: 'bg-warning text-light',
          delay: 5000,
          autohide: true,
          headertext: 'My Sports Calendar',
        });
      })
      .catch((error) => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
      });
  }

  orderClickedByPersonalCoach(booking) {
    this.selectedBooking = booking;
    this.modal.open(this.cancelOrConfirmModal, { size: 'md' });
  }

  confirmBooking() {
    const updateData =
      this.currentUser.role === Role.PERSONAL_COACH
        ? {
            confirmedByPersonalCoach: true,
            canceledByPersonalCoach: false,
          }
        : {
            confirmedBySportFieldProvider: true,
            canceledBySportFieldProvider: false,
          };

    this.ngxLoader.start();
    this.bookingService
      .updateBooking(this.selectedBooking.id, updateData)
      .then(() => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
        this.selectedBooking = null;
        this.toastService.show('You have confirmed booking.', {
          classname: 'bg-success text-light',
          delay: 5000,
          autohide: true,
          headertext: 'My Sports Calendar',
        });
      })
      .catch((error) => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
      });
  }

  cancelBooking() {
    const updateData =
      this.currentUser.role === Role.PERSONAL_COACH
        ? {
            canceledByPersonalCoach: true,
            confirmedByPersonalCoach: false,
          }
        : {
            canceledBySportFieldProvider: true,
            confirmedBySportFieldProvider: false,
          };
    const termId =
      this.currentUser.role === Role.PERSONAL_COACH
        ? this.selectedBooking.perosnalCoach.id
        : this.selectedBooking.sportField.id;

    this.ngxLoader.start();
    this.bookingService
      .updateBooking(this.selectedBooking.id, updateData, termId)
      .then(() => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
        this.selectedBooking = null;
        this.toastService.show('Booking has been canceled.', {
          classname: 'bg-warning text-light',
          delay: 5000,
          autohide: true,
          headertext: 'My Sports Calendar',
        });
      })
      .catch((error) => {
        this.ngxLoader.stop();
        this.modal.dismissAll();
      });
  }
}
