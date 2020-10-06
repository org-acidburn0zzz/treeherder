import React from 'react';
import { Container } from 'reactstrap';

import { getData } from '../helpers/http';
import { getProjectUrl, getUrlParam } from '../helpers/location';
import { createQueryParams, pushEndpoint } from '../helpers/url';
import PushModel from '../models/push';
import RepositoryModel from '../models/repository';

import CommitHistory from './CommitHistory';

const defaultRepo = 'try';

class MyPushes extends React.Component {
  constructor(props) {
    super(props);

    this.state = { pushMetrics: [], currentRepo: null };
  }

  componentDidMount() {
    // if (this.props.user.isLoggedIn) {
    this.fetchPushes();
    // }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user.isLoggedIn && this.props.user.isLoggedIn) {
      this.fetchRepo();
      this.fetchPushes();
    }
  }

  async fetchRepo() {
    const repos = await RepositoryModel.getList();
    const currentRepo = repos.find((repoObj) => repoObj.name === defaultRepo);
    this.setState({ currentRepo });
  }

  async fetchPushes() {
    // TODO change to author to this.props.user.email
    const options = {
      with_history: 'true',
      author: 'rstewart@mozilla.com',
      count: 3,
    };

    const { data, failureStatus } = await getData(
      getProjectUrl(
        `${pushEndpoint}health_summary/${createQueryParams(options)}`,
        defaultRepo,
      ),
    );

    if (!failureStatus && data.length) {
      this.setState({ pushMetrics: data });
    }
    // TODO notify with failure message
  }

  render() {
    const { user } = this.props;
    const { pushMetrics, currentRepo } = this.state;
    return (
      <Container fluid className="mt-2 mb-5 max-width-default">
        {!user.isLoggedIn && (
          <h2 className="pt-5 text-center">
            Please log in to see your Try pushes
          </h2>
        )}
        {currentRepo &&
          pushMetrics.length > 0 &&
          pushMetrics.map((push) => (
            <div key={push.commitHistory.currentPush.revision}>
              <CommitHistory
                history={push.commitHistory}
                revision={push.commitHistory.currentPush.revision}
                currentRepo={currentRepo}
              />
            </div>
          ))}
      </Container>
    );
  }
}

export default MyPushes;
