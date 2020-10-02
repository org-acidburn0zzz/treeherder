import React from 'react';
import { Container } from 'reactstrap';

import PushModel from '../models/push';

class MyPushes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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
    const options = { repo: 'try', author: 'rmaries@mozilla.com', count: 3 };
    const { data, failureStatus } = await PushModel.getList(options);

    if (!failureStatus && data.results.length) {
      const revisions = data.results.map((push) => push.revision);
      const {
        metrics: { linting, builds, tests },
      } = await this.updateMetrics(revisions);
    }
    // TODO notify with failure message
  }

  updateMetrics = async (revisions) => {
    const metricData = await Promise.all(
      revisions.map((revision) => PushModel.getHealth('try', revision)),
    );
    console.log(metricData);
  };
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
