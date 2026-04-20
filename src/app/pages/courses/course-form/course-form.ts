import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course-service';
import { Location } from '@angular/common';
import { ICourse } from '../../../models/course.model';
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
export class CourseForm {
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    category: new FormControl('', [Validators.required]),
  });

  mode: string = 'new';
  title: string = 'Novo Curso';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CourseService,
    private _snackbar: MatSnackBar
  ) {
    this.mode = this.route.snapshot.data['mode'] || 'new';

    if (this.mode === 'edit') {
      this.title = 'Editar Curso';
    } else if (this.mode === 'view') {
      this.title = 'Visualizar Curso';
      this.form.disable();
    }
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
}
