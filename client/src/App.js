import React, { Component } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './containers/Dashboard';
import {
  HashRouter,
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/registrar" component={Register} />
          <Route path="/reset" component={ResetPassword} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;