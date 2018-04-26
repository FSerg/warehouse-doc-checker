import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

// import Config from './Config';
// import Page from './Page';

import MainPage from './MainPage';

class App extends Component {
  render() {
    return (
      <div>
        <Container style={{ marginTop: '5em' }}>
          <Switch>
            <Route exact path="/" component={MainPage} />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
