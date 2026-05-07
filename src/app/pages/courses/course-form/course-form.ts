import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course-service';
import { Location, NgStyle } from '@angular/common';
import { ICourse } from '../models/course.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ILesson } from '../models/lesson.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormUtils } from '../../../shared/services/form-utils';

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
    MatToolbarModule,
    NgStyle
],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm implements OnInit {
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]),
    category: new FormControl('', [Validators.required]),
    lessons: new FormArray<FormGroup>([], [Validators.required])
  });

  mode: string = 'new';
  title: string = 'Novo Curso';
  loading: boolean = false;
  id?: number;

  get lessons() {
    return this.form.controls['lessons'];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CourseService,
    private _snackbar: MatSnackBar,
    public formUtils: FormUtils
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
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const model: ICourse = {
      id: this.form.value.id!,
      name: this.form.value.name!,
      category: this.form.value.category!,
      lessons: [],
    };

    const prop = this.mode === 'edit' ? 'update' : 'save';
    
    this.loading = true;
    this.service[prop](model).subscribe({
      next: () => this.onSuccess(),
      error: (error) => this.onError(error)
    });
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

          course.lessons.forEach(lesson => {
            this.addLesson(lesson);
          });
        },
        error: (error) => {
          this._snackbar.open('Erro ao carregar curso', 'Fechar');
          console.error('Erro ao carregar curso:', error);
        }
      });
    } else {
      this.addLesson();
    }
  }

  addLesson(lesson: ILesson = { id: null, name: '', youtubeUrl: '' }) {
    const form = new FormGroup({
      id: new FormControl(lesson.id),
      name: new FormControl(lesson.name, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      youtubeUrl: new FormControl(lesson.youtubeUrl, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
    
    this.lessons.push(form);
  }

  removeLesson(index: number) {
    this.lessons.removeAt(index);
  }

  isFormArrayRequired() {
    return !this.lessons.valid && this.lessons.hasError('required') && this.lessons.touched;
  }
}
