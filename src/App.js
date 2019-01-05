import React from 'react';
import ConnectedGitHubAuth from './components/auth/GitHubAuth'
import ConnectedNotebookEditor from './components/notebook/ActiveNotebookEditor';

/**
 * Root-level component of application.
 */
class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ConnectedGitHubAuth/>
        <ConnectedNotebookEditor/>
      </React.Fragment>
    );
  }
}

export default App;
