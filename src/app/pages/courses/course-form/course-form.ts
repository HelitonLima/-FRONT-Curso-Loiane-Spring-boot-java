import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course-service';
import { Location } from '@angular/common';
import { ICourse } from '../models/course.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm implements OnInit {
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]),
    category: new FormControl('', [Validators.required]),
  });

  mode: string = 'new';
  title: string = 'Novo Curso';
  loading: boolean = false;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CourseService,
    private _snackbar: MatSnackBar
  ) {
    this.mode = this.route.snapshot.data['mode'] || 'new';

    this.id = this.route.snapshot.params['id'];

    if (this.mode === 'edit') {
      this.title = 'Editar Curso';
    } else if (this.mode === 'view') {
      this.title = 'Visualizar Curso';
      this.form.disable();
    }
  }

  ngOnInit(): void {
    this.getCourseById();
  }

  onSubmit() {
    if (this.form.valid) {
      const model: ICourse = {
        id: this.form.value.id!,
        name: this.form.value.name!,
        category: this.form.value.category!,
      };

      const prop = this.mode === 'edit' ? 'update' : 'save';
      
      this.loading = true;
      this.service[prop](model).subscribe({
        next: () => this.onSuccess(),
        error: (error) => this.onError(error)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/cursos']);
  }

  onSuccess() {
    this.loading = false;
    this._snackbar.open('Curso salvo com sucesso!', '', {
      duration: 3000,
    });
    this.router.navigate(['/cursos']);
  }

  onError(error: HttpErrorResponse) {
    this.loading = false;
    this._snackbar.open('Erro ao salvar curso', 'Fechar');
    console.error('Erro ao salvar curso:', error);
  }

  getCourseById() {
    if (this.id) {
      this.service.getById(this.id).subscribe({
        next: (course) => {
          this.form.patchValue(course);
        },
        error: (error) => {
          this._snackbar.open('Erro ao carregar curso', 'Fechar');
          console.error('Erro ao carregar curso:', error);
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
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
