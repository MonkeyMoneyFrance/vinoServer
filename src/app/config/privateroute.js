import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import PrivateLayout from '../components/layout/privateLayout'
import store from '../redux/store'
const URL = process.env.NODE_ENV == 'production' ? '' : "http://localhost:3000/"


export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      fetch(URL+'authrequired',{
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

      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <PrivateLayout>
            <ComponentToProtect {...this.props} />
          </PrivateLayout>
        </React.Fragment>
      );
    }
  }
}
