import { ILesson } from "./lesson.model";

export interface ICourse {
  id: number | null;
  name: string;
  category: string;
  lessons: ILesson[];
}