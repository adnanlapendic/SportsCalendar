import { Component, OnInit } from '@angular/core';
import { SportService } from 'src/app/services/sport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { COUNTRY_PLACES_API, TIMES, SPORTS } from 'src/app/utils/constants';
import { BookingService } from 'src/app/services/booking.service';
import { SearchContext } from 'src/app/models/interfaces/search-context';
import { Term } from 'src/app/models/term';
import { TermResult } from 'src/app/models/interfaces/term-result';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  matchingResults: TermResult[];
  submitted: boolean = false;
  availableTimes: string[] = TIMES;
  sports: string[] = SPORTS;
  selectedResult;
  minDate: Date;
  searchForm = this.fb.group({
    city: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    sport: [null, Validators.required],
  });

  options = {
    componentRestrictions: {
      country: [COUNTRY_PLACES_API],
    },
  };
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
  }

  onResultSelected(value) {
    this.selectedResult = value;
  }

  onSportSelect(event: any) {
    this.searchForm.get('sport').setValue(event.target.value);
  }

  public handleAddressChange(address: any) {
    this.searchForm.get('city').setValue(address.name);
  }

  submitSearchForm(): void {
    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }
    this.selectedResult = null;
    this.ngxLoader.start();
    const searchData: SearchContext = this.searchForm.value;

    this.bookingService.findTerms(searchData).subscribe((terms: Term[]) => {
      this.matchingResults = this.bookingService.getMatchingResultsForSearch(
        terms
      );
      this.ngxLoader.stop();
    });
  }

  get f() {
    return this.searchForm.controls;
  }
}
