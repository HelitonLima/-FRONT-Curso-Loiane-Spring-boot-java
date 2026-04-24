import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../models/course.model';
import { delay, first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly API = 'api/courses';
  
  constructor(
    private http: HttpClient
  ) { }
  
  list() {
    return this.http.get<ICourse[]>(this.API)
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
