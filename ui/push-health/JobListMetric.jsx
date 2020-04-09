import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import Job from './Job';

export default class JobListMetric extends React.PureComponent {
  render() {
    const { data, repo, revision } = this.props;
    const { name, details } = data;
    const jobs = details;
    const msgForZeroJobs =
      details.length && !jobs.length
        ? `All failed ${name} also failed in Parent Push`
        : `All ${name} passed`;

    return (
      <div>
        {jobs.length ? (
          jobs.map((job) => (
            <Row key={job.id} className="mt-2">
              <Job job={job} repo={repo} revision={revision} />
            </Row>
          ))
        ) : (
          <div>{msgForZeroJobs}</div>
        )}
      </div>
    );
  }
}

JobListMetric.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    details: PropTypes.array.isRequired,
  }).isRequired,
  repo: PropTypes.string.isRequired,
  revision: PropTypes.string.isRequired,
};
