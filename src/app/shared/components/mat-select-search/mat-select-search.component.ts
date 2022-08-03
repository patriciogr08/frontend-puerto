import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'admin-mat-select-search',
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class MatSelectSearchComponent implements OnInit, OnChanges {
  //INPUTS
  @Input() classCustom: string = '';
  @Input() label: string = '';
  @Input() items: Array<any> = [];
  @Input() itemsKey: string = null;
  @Input() isValueId: boolean = true;
  @Input() controlName: string;

  //OUTPUTS
  @Output() itemEmit = new EventEmitter<any>();

  /** control for the selected item */
  public itemCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public itemFilterCtrl: FormControl = new FormControl();

  /** list of items filtered by search keyword */
  public filteredItems: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit() {
    // set initial selection
    // this.itemCtrl.setValue(this.items[10]);

    // load the initial item list
    this.filteredItems.next(this.items.slice());

    // listen for search field value changes
    this.itemFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

    this.emitItem();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.items.firstChange) {
      this.filteredItems.next(this.items.slice());
    }
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredItems
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl.value;
    if (!search) {
      this.filteredItems.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the items
    this.filteredItems.next(
      this.items.filter((item) => (
        this.itemsKey !== null ? item[this.itemsKey].toLowerCase().indexOf(search) > -1 : item.name.toLowerCase().indexOf(search) > -1
      ))
    );
  }

  emitItem() {
    this.itemCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((data) => {
      this.itemEmit.emit(data);
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
