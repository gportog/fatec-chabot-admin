import React, { Component } from 'react';
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
          <Route path="/" component={Dashboard} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;