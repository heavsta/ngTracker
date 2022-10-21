export interface Column {
  id: string;
  title: string;
  order: number;
  task?: Task[];
}
