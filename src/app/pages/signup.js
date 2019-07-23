import React from 'react';
import {login} from '../utils/API'
export default class SignUp extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {}
  }
  tryLogin(){
    login(this.state.email, this.state.password).then(function(data){
          localStorage.setItem('token', data.data.token);
          window.location = "/dashboard"
      },function(error){
          console.log(error);
          return;
      })
  }
  render(){
    return (
      <div className="Login">
      SIGNUP
      </div>
    )
  }
}
