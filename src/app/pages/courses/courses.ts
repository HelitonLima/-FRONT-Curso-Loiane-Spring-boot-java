import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ICourse } from './models/course.model';
import { Observable } from 'rxjs';
import { CourseService } from './services/course-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CoursesList } from './courses-list/courses-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog';

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
  protected courses$: Observable<ICourse[]> | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.refresh();
  }

  refresh() {
    this.courses$ = this.courseService.list();
  }

  onEdit(id: number) {
    this.router.navigate(['/cursos/editar', id]);
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: 'Tem certeza que deseja remover este curso?'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.onDeleteAction(id);
      }
    });
  }

  onDeleteAction(id: number) {
    this.courseService.delete(id).subscribe({
      next: () => {
        this._snackbar.open('Curso removido com sucesso', 'Fechar', {verticalPosition: 'top'});
        this.refresh();
      },
      error: (error) => {
        this._snackbar.open('Erro ao remover curso', 'Fechar', {verticalPosition: 'top'});
        console.error('Erro ao remover curso:', error);
      }
    });
  }
}
