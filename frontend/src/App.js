import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

const JWT_TOKEN = localStorage.getItem('JWT_TOKEN') || null;
const USER_ID = localStorage.getItem('USER_ID') || null;
const USER = JSON.parse(localStorage.getItem('USER')) || null;

class App extends Component {
  state = {
    token: JWT_TOKEN,
    userId: USER_ID,
    user: USER
  };

  login = (token, userId, tokenExpiration, user) => {
    localStorage.setItem('JWT_TOKEN', token);
    localStorage.setItem('USER_ID', userId);
    localStorage.setItem('USER', JSON.stringify(user));
    this.setState({ token, userId, user });
  };

  logout = () => {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('USER');
    this.setState({ token: null, userId: null, user: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              user: this.state.user,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/events" component={EventsPage} />
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
