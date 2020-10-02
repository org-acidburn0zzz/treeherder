import React from 'react';
import { Container } from 'reactstrap';

class MyPushes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  // TODO
  // fetch pushes by author and per repo (start with try) - start with past 10 which is TH default
  // Use same logic in Health component that's used for the tabs (failed or passed)
  render() {
    const { user } = this.props;
    console.log(user);
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
