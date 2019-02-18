import React from 'react';
import ConnectedGitHubAuth from './components/auth/GitHubAuth'
import ConnectedNotebookEditor from './components/notebook/ConnectedNotebookEditor'

/**
 * Root-level component of application.
 */
class App extends React.Component {
  render() {
    return (
        <>
          <ConnectedGitHubAuth/>
          <ConnectedNotebookEditor/>
        </>
    );
  }
}

export default App;
