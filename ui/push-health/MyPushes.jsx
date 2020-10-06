import React from 'react';
import { Container } from 'reactstrap';
import { getData } from '../helpers/http';
import { getProjectUrl, getUrlParam } from '../helpers/location';
import { createQueryParams, pushEndpoint } from '../helpers/url';

import PushModel from '../models/push';

class MyPushes extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: [] };
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
    const options = {
      with_history: 'true',
      author: 'rstewart@mozilla.com',
      count: 3,
    };

    const { data, failureStatus } = await getData(
      getProjectUrl(
        `${pushEndpoint}health_summary/${createQueryParams(options)}`,
        'try',
      ),
    );

    if (!failureStatus && data.length) {
      this.setState({ data });
    }
    // TODO notify with failure message
  }

  // TODO
  // Look into creating a new method on the PushViewSet to query by author return a group of metrics
  // without the jobs so as to skip fetching the pushlist first. Will need to evaluate the query time since there is
  // not an index on author field and will need it to be limited to top 5 most recent pushes (can introduce pagination later if needed).
  // needed data structure:
  //  [
  //   {
  //     'revision': revision,
  //     'id': push.id, ???
  //     'result': push_result, ???
  //     'metrics': {
  //         'commitHistory': {
  //             'name': 'Commit History',
  //             'result': 'none',
  //             'details': commit_history_details,
  //         },
  //         'linting': {
  //             'name': 'Linting',
  //             'result': lint_result,
  //             'details': lint_failures,
  //             'count': count
  //         },
  //         'tests': {
  //             'name': 'Tests',
  //             'result': test_result,
  //             'details': push_health_test_failures,
  //             'count': count
  //         },
  //         'builds': {
  //             'name': 'Builds',
  //             'result': build_result,
  //             'details': build_failures,
  //             'count': count
  //         },
  //     },
  //     'status': push.get_status(), ???
  // }
  // ]

  updateMetrics = async (revisions) => {
    const metricData = await Promise.all(
      revisions.map((revision) => PushModel.getHealth('try', revision)),
    );
    console.log(metricData);
  };

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
