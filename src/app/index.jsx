import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch,browserHistory } from 'react-router-dom';

import './../scss/main.scss';

import User from './components/home/User.jsx';

class App extends React.Component {
  render () {
    return (
        <Router history={ browserHistory }>
            <Switch>
                <Route exact path="/" component={User}/>

            </Switch>
        </Router>
    );
  }
}

render(<App/>, document.getElementById('app'));
