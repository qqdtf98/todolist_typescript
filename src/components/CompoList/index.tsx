import './index.scss'

import {
  DoneContext,
  SearchContent,
  TodoContext,
  calenElem,
} from 'src/components/TodoList'
import { DoneData, TodoData, WorkType } from 'src/interfaces/todo-type'
import React, { useContext, useEffect, useState } from 'react'

import { CalendarProps } from 'react-calendar'
import Scrollbars from 'react-custom-scrollbars'
import { UserContent } from 'src/pages/TodoPage/index'
import api from 'src/api/index'
import deleteIcon from 'src/assets/images/delete.svg'
import plus from 'src/assets/images/plus.svg'

function WorkElem(props: WorkType) {
  const userContent = useContext(UserContent)
  // delete list elem using index
  // update new list
  const deleteElem = () => {
    api
      .post('/list/delete', {
        data: {
          userId: userContent.userId,
          listType: props.data,
          index: props.index,
        },
      })
      .then((res) => {
        const newContext = res.data
        props.update(newContext)
      })
  }

  // default: green
  // green -> yellow -> red
  const changeImportance = (e: any) => {
    const newContext = [...props.context]
    const index = props.context.findIndex(
      (elem: TodoData | DoneData) => elem.id === props.index
    )
    let importance = ''
    if (newContext[index].importance === 'red') {
      importance = 'green'
    } else if (newContext[index].importance === 'green') {
      importance = 'yellow'
    } else if (newContext[index].importance === 'yellow') {
      importance = 'red'
    }

    setTimeout(() => {
      api
        .post('/list/update', {
          data: {
            userId: userContent.userId,
            listType: props.data,
            index: props.index,
            key: 'importance',
            value: importance,
          },
        })
        .then((res) => {
          props.update(res.data)
        })
    }, 0)
  }

  const list = props.list

  // set bgColor depends on importance
  const setImportanceColor = () => {
    let style
    if (props.list.importance === 'red') {
      style = {
        backgroundColor: '#FB6666',
      }
    } else if (props.list.importance === 'green') {
      style = {
        backgroundColor: '#7DCEAC',
      }
    } else if (props.list.importance === 'yellow') {
      style = {
        backgroundColor: '#E4C862',
      }
    }

    return style
  }

  const setDoneColor = () => {
    let style
    if (props.list.state) {
      style = {
        backgroundColor: '#f9457a',
        border: 'none',
      }
    } else {
      style = {
        backgroundColor: '#fff',
        border: '1.2px solid #f9457a',
      }
    }

    return style
  }

  const todoContext = useContext(TodoContext)
  const doneContext = useContext(DoneContext)

  const changeDoneState = () => {
    if (props.data === 'done') {
      api
        .post('/list/change', {
          data: {
            userId: userContent.userId,
            before: 'done_list',
            after: 'todo_list',
            id: props.index,
            type: 'todo',
          },
        })
        .then((res) => {
          todoContext.update(res.data.todo)
          doneContext.update(res.data.done)
        })
    } else if (props.data === 'todo') {
      api
        .post('/list/change', {
          data: {
            userId: userContent.userId,
            before: 'todo_list',
            after: 'done_list',
            id: props.index,
            type: 'done',
          },
        })
        .then((res) => {
          todoContext.update(res.data.todo)
          doneContext.update(res.data.done)
        })
    }
  }

  const [contents, setContents] = useState(list.contents)

  const updateContentsValue = (e: any) => {
    const target = e.target as HTMLInputElement
    const newContents = target.value

    api
      .post('/list/update', {
        data: {
          userId: userContent.userId,
          listType: props.data,
          index: props.index,
          key: 'contents',
          value: newContents,
        },
      })
      .then((res) => {
        setContents(newContents)
        props.update(res.data)
      })
  }

  const [title, setTitle] = useState(list.title)

  const updateTitleValue = (e: any) => {
    const target = e.target as HTMLInputElement
    const newTitle = target.value

    api
      .post('/list/update', {
        data: {
          userId: userContent.userId,
          listType: props.data,
          index: props.index,
          key: 'title',
          value: newTitle,
        },
      })
      .then((res) => {
        setTitle(newTitle)
        props.update(res.data)
      })
  }

  const activateCalendar = (e: any) => {
    const target = e.target as HTMLElement
    if (!calenElem) return
    if (getComputedStyle(calenElem).display === 'block') {
      calenElem.style.display = 'none'
    } else if (getComputedStyle(calenElem).display === 'none') {
      const targetStyle = target.getBoundingClientRect()
      calenElem.style.left = targetStyle.left - targetStyle.width + 'px'
      calenElem.style.top = targetStyle.top + targetStyle.height + 'px'
      calenElem.style.display = 'block'
      // calenElem.value = props.data
      calenElem.setAttribute('index', props.index.toString())
    }
  }

  return (
    <div id="work-box">
      <div className="work-elem">
        <button
          className="work-importance"
          style={setImportanceColor()}
          onClick={changeImportance}
        ></button>
        <div className="work-data">
          <div className="work-top-box">
            <input
              className="work-title"
              value={title}
              spellCheck="false"
              onChange={updateTitleValue}
            />
            <span onClick={activateCalendar} className="work-date">
              {list.date}
            </span>
          </div>
          <input
            className="work-contents"
            value={contents}
            spellCheck="false"
            onChange={updateContentsValue}
          />
        </div>
        <img
          onClick={deleteElem}
          className="delete-icon"
          src={deleteIcon}
          alt="delete"
        />
      </div>
      <div className="work-check">
        <button
          onClick={changeDoneState}
          style={setDoneColor()}
          className="work-check-btn"
        ></button>
      </div>
    </div>
  )
}

export function Todo() {
  const todoContext = useContext(TodoContext)
  const todo = todoContext.state
  const update = todoContext.update
  const todoItems = []
  const searchContext = useContext(SearchContent)
  const userContent = useContext(UserContent)

  // create for loop for <WorkElem />
  if (todo.length > 0) {
    for (let i = todo.length - 1; i >= 0; i--) {
      if (searchContext.state === '') {
        todoItems.push(
          <WorkElem
            key={i}
            index={todo[i].id}
            list={todo[i]}
            context={todo}
            update={update}
            data="todo"
          />
        )
      } else {
        if (
          todo[i].contents
            .toUpperCase()
            .indexOf(searchContext.state.toUpperCase()) > -1
        ) {
          todoItems.push(
            <WorkElem
              key={i}
              index={todo[i].id}
              list={todo[i]}
              context={todo}
              update={update}
              data="todo"
            />
          )
        }
      }
    }
  }

  let textInput: HTMLInputElement | null = null

  useEffect(() => {
    textInput?.focus()
  }, [textInput])

  const addElem = (e: any) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      const today = new Date()
      const date =
        today.getFullYear() +
        '/' +
        (today.getMonth() + 1) +
        '/' +
        today.getDate()
      const newContext = {
        title: 'title',
        contents: target.value,
        date,
        state: 0,
        importance: 'green',
      }
      api
        .post('/list/add', {
          data: {
            userId: userContent.userId,
            newContext,
          },
        })
        .then((res) => {
          const newTodo = res.data
          update(newTodo)
        })
      target.value = ''
    }
  }

  return (
    <div id="list" className="todo">
      <div className="list-text">Todo</div>
      <div className="add-btn-box">
        <button className="add-btn">
          <img className="add-icon" src={plus} alt="plus" />
          <input
            spellCheck="false"
            className="search-input"
            placeholder="add a task"
            onKeyDown={addElem}
            ref={(elem) => (textInput = elem)}
          />
        </button>
      </div>
      <Scrollbars style={{ width: 486, height: 450 }}>{todoItems}</Scrollbars>
    </div>
  )
}

export function Done() {
  const doneContext = useContext(DoneContext)
  const done = doneContext.state
  const update = doneContext.update
  const searchContext = useContext(SearchContent)
  const doneItems = []

  // create for loop for <WorkElem />
  for (let i = done.length - 1; i >= 0; i--) {
    if (searchContext.state === '') {
      doneItems.push(
        <WorkElem
          key={i}
          index={done[i].id}
          list={done[i]}
          context={done}
          update={update}
          data="done"
        />
      )
    } else {
      if (
        done[i].contents
          .toUpperCase()
          .indexOf(searchContext.state.toUpperCase()) > -1
      ) {
        doneItems.push(
          <WorkElem
            key={i}
            index={done[i].id}
            list={done[i]}
            context={done}
            update={update}
            data="done"
          />
        )
      }
    }
  }

  return (
    <div id="list" className="done">
      <div className="list-text">Done</div>
      <Scrollbars style={{ width: 486, height: 530 }}>{doneItems}</Scrollbars>
    </div>
  )
}
