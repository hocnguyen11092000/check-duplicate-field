import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
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
import { AbstractControlWarning } from './abstracts';
import { FormControlWarn } from './abstracts/form.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'check-duplicate-field';
  dup: any = {};
  dup2: any = {};

  readonly formArray = inject(NonNullableFormBuilder).group({
    array: new FormArray([
      new FormGroup({
        fullname: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        gender: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        birthDay: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        id: new FormControlWarn<AbstractControlWarning<{ duplicate: true }>>(
          ''
        ),
      }),
      new FormGroup({
        fullname: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        gender: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        birthDay: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        id: new FormControlWarn<AbstractControlWarning<{ duplicate: true }>>(
          ''
        ),
      }),
      new FormGroup({
        fullname: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        gender: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        birthDay: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        id: new FormControlWarn<AbstractControlWarning<{ duplicate: true }>>(
          ''
        ),
      }),
      new FormGroup({
        fullname: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        gender: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        birthDay: new FormControlWarn<
          AbstractControlWarning<{ duplicate: true }>
        >(''),
        id: new FormControlWarn<AbstractControlWarning<{ duplicate: true }>>(
          ''
        ),
      }),
    ]),
  });

  get getFormArray(): FormArray {
    return this.formArray.get('array') as FormArray;
  }

  ngOnInit(): void {
    this.getFormArray.valueChanges
      .pipe(
        debounceTime(300),
        tap((val) => {
          const idx: any = [];
          const idx2: any = [];
          this.dup = {};
          this.dup2 = {};

          _.forEach(val, (item1: any, index1: number) => {
            const val1 = _.values(item1).join('');

            _.forEach(val, (item2: any, index2: number) => {
              const val2 = _.values(item2).join('');

              if (index1 !== index2 && val1 && val2) {
                if (_.isEqual(_.omit(item1, ['id']), _.omit(item2, ['id']))) {
                  idx.push(index1);
                  _.set(this.dup, 'case', 1);
                  _.set(this.dup, 'index', [...new Set(idx)]);
                }

                if (
                  _.isEqual(
                    _.omit(item1, ['birthDay']),
                    _.omit(item2, ['birthDay'])
                  )
                ) {
                  idx2.push(index1);
                  _.set(this.dup2, 'case', 2);
                  _.set(this.dup2, 'index', [...new Set(idx2)]);
                }
              }
            });
          });

          console.log(this.dup, this.dup2);
        })
      )
      .subscribe();
  }
}
