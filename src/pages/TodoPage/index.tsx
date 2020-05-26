import './index.scss'

import React from 'react'
import { RouteComponentProps } from 'react-router'

// import TodoList from '../../../componets/TodoList/index.js'

export const UserContent = React.createContext({
  userId: '-1',
})

type UrlUserId = {
  userId: string
}

function TodoPage(urlData: RouteComponentProps) {
  console.log(urlData)
  const data = urlData.match.params as UrlUserId

  return (
    <>
      <UserContent.Provider value={{ userId: data.userId }}>
        <div>TodoPage</div>
        {/* <TodoList id="todo-page" /> */}
      </UserContent.Provider>
    </>
  )
}

export default TodoPage
