import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms';
import * as _ from 'lodash';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  merge,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'check-duplicate-field';
  readonly formArray = inject(NonNullableFormBuilder).group({
    array: new FormArray([
      new FormGroup({
        fullname: new FormControl(''),
        gender: new FormControl(''),
        birthDay: new FormControl(''),
        id: new FormControl(''),
      }),
      new FormGroup({
        fullname: new FormControl(''),
        gender: new FormControl(''),
        birthDay: new FormControl(''),
        id: new FormControl(''),
      }),
      new FormGroup({
        fullname: new FormControl(''),
        gender: new FormControl(''),
        birthDay: new FormControl(''),
        id: new FormControl(''),
      }),
      new FormGroup({
        fullname: new FormControl(''),
        gender: new FormControl(''),
        birthDay: new FormControl(''),
        id: new FormControl(''),
      }),
    ]),
  });

  get getFormArray(): FormArray {
    return this.formArray.get('array') as FormArray;
  }

  ngOnInit(): void {
    combineLatest(
      this.getFormArray.controls.map((i) =>
        i.valueChanges.pipe(
          startWith(null),
          map((val) => _.values(_.omit(val, ['id'])))
        )
      )
    ).pipe(
      debounceTime(500),
      tap((val) => {
        console.log(val);
      })
    );
    // .subscribe();
    let duplicatFieldsCase1: any = {};

    merge(
      ...this.getFormArray.controls.map((i, idx) =>
        i.valueChanges.pipe(
          startWith(null),
          filter((val) => !!val),
          map((val) => {
            return {
              index: idx,
              value: _.values(_.omit(val, ['id'])).join(''),
            };
          })
        )
      )
    )
      .pipe(
        debounceTime(500),
        withLatestFrom(
          combineLatest(
            this.getFormArray.controls.map((i) =>
              i.valueChanges.pipe(
                startWith(null),
                map((val) => _.values(_.omit(val, ['id'])))
              )
            )
          )
        )
      )
      .subscribe(([field, data]) => {
        const { index, value } = field;

        duplicatFieldsCase1 = {
          ...duplicatFieldsCase1,
          [index]: false,
          ...this.checkDuplicate(value, data, index),
        };

        console.log(duplicatFieldsCase1);
      });
  }

  checkDuplicate(value: string, data: Array<any>, index: number) {
    const duplicate: any = {};

    _.forEach(data, (item: any, idx: number) => {
      if (idx !== index && value === _.values(item).join('')) {
        duplicate[idx] = true;
        duplicate[index] = true;
      }
    });

    return duplicate;
  }
}
