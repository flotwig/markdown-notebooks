import React from 'react';
import GitHubAuth from './components/auth/GitHubAuth'
import ActiveNotebookEditor from './components/notebook/ActiveNotebookEditor';

class App extends React.Component {
  render() {
    return (<React.Fragment>
      <GitHubAuth/>
      <ActiveNotebookEditor/>
    </React.Fragment>);
  }
}

export default App;
