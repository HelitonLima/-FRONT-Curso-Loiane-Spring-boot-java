import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtils {
  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);

    return this.getErrorMessageFromControl(control)
  }

  getErrorMessageFromControl(control: AbstractControl | null) {
    if (control?.hasError('required') && control?.touched) {
      return 'Este campo é obrigatório.';
    }

    if (control?.hasError('maxlength') && control?.touched) {
      const requiredLength = control.errors?.['maxlength']?.requiredLength;
      return `Este campo deve ter no máximo ${requiredLength} caracteres.`;
    }
  
    if (control?.hasError('minlength') && control?.touched) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Este campo deve ter no mínimo ${requiredLength} caracteres.`;
    }
  
    return 'Erro ao validar campo';
  }
}
