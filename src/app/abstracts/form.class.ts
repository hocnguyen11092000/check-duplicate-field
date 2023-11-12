import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

export class FormControlWarn<T extends object> extends FormControl {
  warnings!: T;

  hasWarning(type: string) {
    if (!type) return undefined;

    return !!_.get(this.warnings, type);
  }
}
