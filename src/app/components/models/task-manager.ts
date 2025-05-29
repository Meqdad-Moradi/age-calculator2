export interface Board {
  name: string;
  id: string;
}

export interface Task {
  id: string;
  title: string;
  desc: string;
  boardId: string;
  status: TaskStatus;
}

export type TaskStatus = 'todo' | 'doing' | 'done'

export interface TasksGroup {
  todo: Task[];
  doing: Task[];
  done: Task[]
}