import React from 'react';
import {login} from './utils/API'
import Home from './pages/home'
import routes from './config/routes'
import withAuth from './config/privateroute'
import withLayout from './config/publicRoute'
import withAdmin from './config/adminRoute'
import {Switch,Route} from 'react-router-dom'


function App() {
  return (
    <div style={{margin:0}}>
      <Switch>
        {routes.map((r,index) => 
          (
            <Route
              path={r.path}
              exact={r.exact}
              key = {index}
              match = {r.match}
              component={r.private ? withAuth(r.main) : r.admin ? withAdmin(r.main)  : withLayout(r.main)} />
          )

       )}
      </Switch>
    </div>
  );
}

export default App;
