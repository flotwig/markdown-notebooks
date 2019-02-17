import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import ConnectedGitHubAuth from './components/auth/GitHubAuth'
import ConnectedNotebookEditor from './components/notebook/ConnectedNotebookEditor'

/**
 * Root-level component of application.
 */
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <>
          <ConnectedGitHubAuth/>
          <ConnectedNotebookEditor/>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
