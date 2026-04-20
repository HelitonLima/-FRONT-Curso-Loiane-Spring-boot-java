import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ICourse } from '../../models/course.model';
import { Observable } from 'rxjs';
import { CourseService } from '../../services/course-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesList } from './courses-list/courses-list';

@Component({
  selector: 'app-courses',
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterLink,
    CoursesList
  ],    
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  protected readonly courses$: Observable<ICourse[]>;

  constructor(
    private courseService: CourseService
  ) {
    this.courses$ = this.courseService.list();
  }
}
