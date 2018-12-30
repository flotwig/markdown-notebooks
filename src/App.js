import React from 'react';
import PageEditor from './components/notebook/PageEditor';
import GitHub, { GitHubApi } from './GitHub';
import GitHubAuth from './components/auth/GitHubAuth'

class App extends React.Component {
  render() {
    return (<React.Fragment>
      <GitHub.Provider value={new GitHubApi()}>
        <GitHubAuth/>
        <PageEditor/>
      </GitHub.Provider>
    </React.Fragment>);
  }
}

export default App;
