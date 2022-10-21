import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PasswordMatchingValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  return password?.value === confirm?.value ? null : { notMatching: true };
};
