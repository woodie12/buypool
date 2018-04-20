import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch,browserHistory } from 'react-router-dom';

import './../scss/main.scss';

import User from './components/home/User.jsx';
import Request from './components/request/request.jsx'
import Account from './components/account/account.jsx'
import Forms from './components/form/form.jsx'

render(
        <Router history={ browserHistory }>
            <Switch>
                <Route exact path="/" component={User}/>
                <Route exact path = '/request' component={Request}/>
                <Route path = '/account' component = {Account} />
                <Route path = '/form' component = {Forms} />
            </Switch>
        </Router>,
    document.getElementById('app')
);
