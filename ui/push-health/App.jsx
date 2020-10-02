import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {
  clearNotificationAtIndex,
  clearExpiredTransientNotifications,
} from '../helpers/notifications';
import NotificationList from '../shared/NotificationList';
import InputFilter from '../shared/InputFilter';

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

  clearNotification = (index = null) => {
    const { notifications } = this.state;

    if (index) {
      this.setState(clearNotificationAtIndex(notifications, index));
    } else {
      this.setState(clearExpiredTransientNotifications(notifications));
    }
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
          >
            {/* <Navbar color="light" light expand="sm" className="w-100">
            {!!tests && (
              <Nav className="mb-2 pt-2 pl-3 justify-content-between w-100">
                <span />
                <span className="mr-2 d-flex">
                  <Button
                    size="sm"
                    className="text-nowrap mr-1"
                    title="Toggle failures that also failed in the parent"
                    onClick={() =>
                      this.setState({ showParentMatches: !showParentMatches })
                    }
                  >
                    {showParentMatches ? 'Hide' : 'Show'} parent matches
                  </Button>
                  <InputFilter
                    updateFilterText={this.filter}
                    placeholder="filter path or platform"
                  />
                </span>
              </Nav>
            )}
          </Navbar> */}
          </Navigation>
          <NotificationList
            notifications={notifications}
            clearNotification={this.clearNotification}
          />
          <Switch>
            <Route
              path="/"
              render={(props) => (
                <MyPushes
                  {...props}
                  user={user}
                  notify={this.notify}
                  clearNotification={this.clearNotification}
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
