import { Component, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ICourse } from './models/course.model';
import { Observable, tap } from 'rxjs';
import { CourseService } from './services/course-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CoursesList } from './courses-list/courses-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog';
import { ICoursePage } from './models/course-page.model';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

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
    CoursesList,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: () => {
        const intl = new MatPaginatorIntl();
        intl.itemsPerPageLabel = 'Itens por página:';
        intl.nextPageLabel = 'Próxima página';
        intl.previousPageLabel = 'Página anterior';
        intl.firstPageLabel = 'Primeira página';
        intl.lastPageLabel = 'Última página';
        intl.getRangeLabel = (page, pageSize, length) => {
          if (length === 0 || pageSize === 0) return `0 de ${length}`;
          const startIndex = page * pageSize;
          const endIndex = Math.min(startIndex + pageSize, length);
          return `${startIndex + 1} – ${endIndex} de ${length}`;
        };
        return intl;
      }
    }
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected courses$: Observable<ICoursePage> | null = null;
  public pageIndex = 0;
  public pageSize = 10;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.refresh();
  }

  refresh(pageEvent = { length: 0, pageIndex: 0, pageSize: 10}) {
    const { pageIndex, pageSize } = pageEvent;

    this.courses$ = this.courseService.list(pageIndex, pageSize).pipe(tap(() => {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
    }));
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
