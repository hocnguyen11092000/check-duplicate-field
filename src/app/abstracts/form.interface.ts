import { AbstractControl } from '@angular/forms';

export interface AbstractControlWarning<T extends object>
  extends AbstractControl {
  warnings: {
    [k in keyof T]: T[k];
  };

  hasWarning: (name: string) => boolean;
}
