import { Routes } from '@angular/router';
import { Courses } from './pages/courses/courses';
import { CourseForm } from './pages/courses/course-form/course-form';

export const routes: Routes = [
  { path: '', redirectTo: 'cursos', pathMatch: 'full' },
  { path: 'cursos', component: Courses },
  { path: 'cursos/novo', component: CourseForm, data: { mode: 'new' } },
  { path: 'cursos/editar/:id', component: CourseForm, data: { mode: 'edit' } },
  { path: '**', redirectTo: 'cursos' },
];
