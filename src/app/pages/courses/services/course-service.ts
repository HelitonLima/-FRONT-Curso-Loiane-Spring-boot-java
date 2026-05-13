import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../models/course.model';
import { delay, first } from 'rxjs';
import { ICoursePage } from '../models/course-page.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly API = 'api/courses';
  
  constructor(
    private http: HttpClient
  ) { }
  
  list(page = 0, size = 10) {
    return this.http.get<ICoursePage>(this.API, { params: { page, size }})
    .pipe(
      first()
    );
  }

  save(record: ICourse) {
    return this.http.post<ICourse>(this.API, record);
  }
  
  update(record: ICourse) {
    return this.http.put<ICourse>(`${this.API}/${record.id}`, record);
  }

  getById(id: number) {
    return this.http.get<ICourse>(`${this.API}/${id}`)
    .pipe(
      first()
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
