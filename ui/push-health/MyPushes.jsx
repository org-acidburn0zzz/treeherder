import React from 'react';
import { Container } from 'reactstrap';

import PushModel from '../models/push';

class MyPushes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      revisions: [],
    };
  }

  componentDidMount() {
    // if (this.props.user.isLoggedIn) {
    this.fetchPushes();
    // }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user.isLoggedIn && this.props.user.isLoggedIn) {
      this.fetchPushes();
    }
  }

  async fetchPushes() {
    // TODO change to author to this.props.user.email
    const options = { repo: 'try', author: 'rmaries@mozilla.com' };
    const { data, failureStatus } = await PushModel.getList(options);

    if (!failureStatus && data.results) {
      const revisions = data.results.map((push) => push.revision);
      this.setState(revisions);
    }
    // TODO notify with failure message
  }

  // TODO
  // fetch pushes by author and per repo (start with try) - start with past 10 which is TH default
  // Use same logic in Health component that's used for the tabs (failed or passed)

  render() {
    const { user } = this.props;

    return (
      <Container fluid className="mt-2 mb-5 max-width-default">
        {!user.isLoggedIn ? (
          <h2 className="pt-5 text-center">
            Please log in to see your Try pushes
          </h2>
        ) : (
          <div>Pushes go here</div>
        )}
      </Container>
    );
  }
}

export default MyPushes;
