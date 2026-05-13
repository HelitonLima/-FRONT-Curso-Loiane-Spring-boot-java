import { ICourse } from "./course.model";

export interface ICoursePage {
  courses: ICourse[];
  totalElements: number;
  totalPages: number;
}