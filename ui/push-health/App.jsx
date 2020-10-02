import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MyPushes from './MyPushes';
import NotFound from './NotFound';
import Health from './Health';
import Usage from './Usage';

function hasProps(search) {
  const params = new URLSearchParams(search);

  return params.get('repo') && params.get('revision');
}

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <div>
          <Switch>
            <Route path="/" render={(props) => <MyPushes {...props} />} />
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
      </div>
    </BrowserRouter>
  );
};

export default hot(App);
