import { TaskStatus } from '../enum/task-status';
export class CreateTaskDto {
  title: string;
  description: string;
  completed?: boolean;
  email?: string;
  status: TaskStatus;
}
