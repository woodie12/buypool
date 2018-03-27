import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch,browserHistory } from 'react-router-dom';

import './../scss/main.scss';

import User from './components/home/User.jsx';
import Request from './components/request/request.jsx'
import Account from './components/account/account.jsx'

class App extends React.Component {
  render () {
    return (
        <Router history={ browserHistory }>
            <Switch>
                <Route exact path="/" component={User}/>
                <Route exact path = "/request" component={Request}/>
                <Route exact path = '/account' component = {Account} />
            </Switch>
        </Router>
    );
  }
}

render(<App/>, document.getElementById('app'));
