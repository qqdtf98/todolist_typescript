import './index.scss'
import 'react-calendar/dist/Calendar.css'

import { Done, Todo } from 'src/components/CompoList/index'
import { DoneData, TodoData } from 'src/interfaces/todo-type'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'

import Calendar from 'react-calendar'
import { UserContent } from 'src/pages/TodoPage/index'
import api from 'src/api'
import search from 'src/assets/images/search.svg'

export const SearchContent = React.createContext(
  {} as {
    state: string
    update: React.Dispatch<React.SetStateAction<string>>
  }
)

function SearchBar() {
  const searchContext = useContext(SearchContent)

  const searchList = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    searchContext.update(target.value)
  }

  return (
    <div className="search-wrapper">
      <input
        onChange={searchList}
        placeholder="search"
        className="search-input"
        spellCheck="false"
      />
      <img className="search-icon" src={search} alt="search" />
    </div>
  )
}

export const TodoContext = React.createContext(
  {} as {
    state: TodoData[]
    update: React.Dispatch<React.SetStateAction<TodoData[]>>
  }
)

export const DoneContext = React.createContext(
  {} as {
    state: DoneData[]
    update: React.Dispatch<React.SetStateAction<DoneData[]>>
  }
)

export let calenElem: HTMLElement | null = null

function TodoList() {
  let todoList: TodoData[] = []
  let doneList: DoneData[] = []
  const userContent = useContext(UserContent)

  useEffect(() => {
    console.log('load')
    console.log(userContent)
    api
      .post('/list/get', {
        data: {
          userId: userContent.userId,
          listType: 'todo',
        },
      })
      .then((res) => {
        setTodo(res.data)
      })
    api
      .post('/list/get', {
        data: {
          userId: userContent.userId,
          listType: 'done',
        },
      })
      .then((res) => {
        setDone(res.data)
      })
  }, [])
  const [todo, setTodo] = useState(todoList)

  const [done, setDone] = useState(doneList)

  const getMonthFromString = (mon: string) => {
    return new Date(Date.parse(mon + ' 1, 2012')).getMonth() + 1
  }

  const updateDateValue = (date: Date | Date[]) => {
    console.log(calenElem)
    if (!calenElem) return
    const dateString = date + ''
    const dateList = dateString.split(' ')
    const newDate =
      dateList[3] + '/' + getMonthFromString(dateList[1]) + '/' + dateList[2]

    calenElem.style.display = 'none'

    // api
    //   .post('/list/update', {
    //     data: {
    //       userId: userContent.userId,
    //       listType: calenElem.value,
    //       index: calenElem.getAttribute('index'),
    //       key: 'date',
    //       value: newDate,
    //     },
    //   })
    //   .then((res) => {
    //     if (calenElem.value === 'todo') {
    //       setTodo(res.data)
    //     } else if (calenElem.value === 'done') {
    //       setDone(res.data)
    //     }
    //   })
  }

  const [search, setSearch] = useState('')

  // Provider의 value로 state와 setState함수를 전달
  return (
    <div id="todo-list">
      <h1 className="todo-title">Todo List</h1>
      <SearchContent.Provider value={{ state: search, update: setSearch }}>
        <SearchBar />
        <div className="list-wrapper">
          <TodoContext.Provider value={{ state: todo, update: setTodo }}>
            <DoneContext.Provider value={{ state: done, update: setDone }}>
              <Todo />
              <Done />
              <div className="calendar-elem" ref={(elem) => (calenElem = elem)}>
                <Calendar onChange={updateDateValue} />
              </div>
            </DoneContext.Provider>
          </TodoContext.Provider>
        </div>
      </SearchContent.Provider>
    </div>
  )
}

export default TodoList
