import './index.scss'

import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'

import React from 'react'
import api from 'src/api'
import google from 'src/assets/images/google.png'
import { useHistory } from 'react-router-dom'

function Main() {
  const history = useHistory()

  const confirmUserData = async (
    response: GoogleLoginResponseOffline | GoogleLoginResponse
  ) => {
    const result = response as GoogleLoginResponse
    let userData
    await api
      .get('/user/get', {
        params: {
          userData: result.profileObj,
        },
      })
      .then((res) => {
        userData = res.data[0]
        history.push(`/todo/${userData.id}`)
      })
  }

  return (
    <div id="main-page">
      <div className="main-title">Todo List</div>
      <GoogleLogin
        clientId="283233647825-oicrhle8givdtrv9ku1mt4ju9paeka56.apps.googleusercontent.com"
        render={(props) => (
          <img
            onClick={props.onClick}
            className="main-login"
            src={google}
            alt="login"
          />
          // <button onClick={props.onClick}>Login</button>
        )}
        buttonText="Sign in with Google"
        onSuccess={confirmUserData}
        onFailure={(result) => console.log(result)}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

export default Main
