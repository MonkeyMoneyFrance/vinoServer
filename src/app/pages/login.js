import React from 'react';
import {login} from '../utils/API'
import {connect} from 'react-redux'
import {requestFetchUser} from '../redux/actions'
import {bindActionCreators} from 'redux'

function mapStateToProps(state){
  return {
    user : state.user
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({requestFetchUser}, dispatch)
}
class Login extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {}
  }
  tryLogin(){
    this.props.requestFetchUser({email:'geoffroymounier@gmail.com',password:'TOTO'})
    // login(this.state.email, this.state.password).then(function(data){
    //       // localStorage.setItem('token', data.data.token);
    //       // window.location = "/dashboard"
    //   },function(error){
    //       console.log(error);
    //       return;
    //   })
  }
  static getDerivedStateFromProps(nextProps,prevState){
    if (nextProps.user.authenticated == 'AUTHENTICATED')
    window.location.href = '/'
    return {}
  }
  render(){
    return (
      <div className="Login" >
      <h2>Please login</h2>
      <form onSubmit={(e)=>{
          e.preventDefault()
          this.tryLogin()

        }}>
        <input type='text' placeholder='email' name='email' defaultValue='ge@gmail.com'/>
        <input type='password' placeholder='password' name='password' defaultValue=''/>
        <button type='submit'>Log in</button>
      </form>
      <span onClick={()=>this.tryLogin()}>THIS IS A LOGIN</span>
      </div>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Login)
