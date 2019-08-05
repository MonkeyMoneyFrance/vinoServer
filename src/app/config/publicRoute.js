import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import PublicLayout from '../components/layout/publicLayout'

export default function withLayout(PublicComponent) {
  return class extends Component {

    render() {

      return (
        <React.Fragment>
          <PublicLayout>
            <PublicComponent {...this.props} />
          </PublicLayout>
        </React.Fragment>
      )
    }
  }
}
// export const PublicRoute = ({component: Component , ...rest}) => (
//
// )
