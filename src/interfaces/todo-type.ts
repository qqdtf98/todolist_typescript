export interface TodoData {
  contents: string
  date: string
  todoId: number
  id: number
  importance: string
  state: number
  title: string
}
export interface DoneData {
  contents: string
  date: string
  doneId: number
  id: number
  importance: string
  state: number
  title: string
}

export interface WorkType {
  data: string
  index: number
  update:
    | React.Dispatch<React.SetStateAction<TodoData[]>>
    | React.Dispatch<React.SetStateAction<TodoData[]>>
  context: TodoData[] | DoneData[]
  list: TodoData | DoneData
}
