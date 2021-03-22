/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import Analytics from './components/Analytics';
import Chatrooms from './components/Chatrooms';
import Chatroom from './components/Chatroom';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import NotFound from './components/NotFound';
import ForgotPassword from "./components/ForgotPassword";
import ResetForgotPassword from "./components/ResetForgotPassword";
import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={requireAuthentication(ProtectedView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="analytics" component={requireAuthentication(Analytics)} />
        <Route path="chatrooms" component={requireAuthentication(Chatrooms)} />
        <Route path="chatroom" component={requireAuthentication(Chatroom)} />
        <Route path="profile" component={requireAuthentication(Profile)} />
        <Route path="forgot_password" component={requireNoAuthentication(ForgotPassword)}/>
        <Route path="reset_forgot_password" component={requireNoAuthentication(ResetForgotPassword)}/>
        <Route path="change-password" component={requireAuthentication(ChangePassword)} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
