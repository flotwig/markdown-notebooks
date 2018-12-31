import React from 'react';
import PageEditor from './components/notebook/PageEditor';
import GitHubAuth from './components/auth/GitHubAuth'

class App extends React.Component {
  render() {
    return (<React.Fragment>
      <GitHubAuth/>
      <PageEditor/>
    </React.Fragment>);
  }
}

export default App;
