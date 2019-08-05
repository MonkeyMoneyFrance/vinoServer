import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AdminLayout from '../components/layout/adminLayout'
import store from '../redux/store'
const URL = process.env.NODE_ENV == 'production' ? '' : "http://localhost:3000/"


export default function withAdmin(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      fetch(URL+'adminRequired',{
        credentials: 'include',
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false, redirect: true  });
          }
        })
        .catch(err => {
          this.setState({ loading: false, redirect: true });
        });
    }
    render() {
      const { loading, redirect } = this.state;
        console.log(loading,redirect)
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <AdminLayout>
            <ComponentToProtect {...this.props} />
          </AdminLayout>
        </React.Fragment>
      );
    }
  }
}
