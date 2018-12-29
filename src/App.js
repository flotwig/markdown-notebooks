import React from 'react';
import PageEditor from './components/notebook/PageEditor';
import GitHub, { GitHubApi } from './GitHub';
import GitHubLogin from './components/GitHubLogin'

class App extends React.Component {
  render() {
    return (<React.Fragment>
      <GitHub.Provider value={new GitHubApi()}>
        <GitHub.Consumer>
          {api => api.auth.valid || <GitHubLogin/>}
        </GitHub.Consumer>
        <PageEditor/>
      </GitHub.Provider>
    </React.Fragment>);
  }
}

export default App;
