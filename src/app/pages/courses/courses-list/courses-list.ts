import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ICourse } from '../../../models/course.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses-list',
  imports: [
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
})
export class CoursesList {
  @Input() courses!: ICourse[];
  
  protected readonly displayedColumns = ['id', 'name', 'category', 'actions'];
}
