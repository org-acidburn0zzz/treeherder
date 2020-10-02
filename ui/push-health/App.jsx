import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MyPushes from './MyPushes';
import NotFound from './NotFound';
import Health from './Health';
import Usage from './Usage';
import Navigation from './Navigation';

function hasProps(search) {
  const params = new URLSearchParams(search);

  return params.get('repo') && params.get('revision');
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: { isLoggedIn: false },
      notifications: [],
    };
  }

  notify = (message, severity, options = {}) => {
    const { notifications } = this.state;
    const notification = {
      ...options,
      message,
      severity: severity || 'darker-info',
      created: Date.now(),
    };
    const newNotifications = [notification, ...notifications];

    this.setState({
      notifications: newNotifications,
    });
  };

  // TODO when rebasing and changing this file to nested routes, use location data to render additional navbar
  // for Health component.
  render() {
    const { user, notifications } = this.state;
    return (
      <BrowserRouter>
        <div>
          <Navigation
            user={user}
            setUser={(user) => this.setState({ user })}
            notify={this.notify}
          />
          <Switch>
            <Route
              path="/"
              render={(props) => (
                <MyPushes
                  {...props}
                  user={user}
                  notification={notifications}
                  notify={this.notify}
                />
              )}
            />
            {/* <Route
                path="/push"
                render={(props) =>
                  hasProps(props.location.search) ? (
                    <Health {...props} />
                  ) : (
                    <Usage {...props} />
                  )
                }
              /> */}
            {/* <Route name="notfound" component={NotFound} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(App);
