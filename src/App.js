import React from 'react';
import GitHubAuth from './components/auth/GitHubAuth'
import NotebookEditor from './components/notebook/NotebookEditor';
import Notebook from './models/Notebook';

class App extends React.Component {
  render() {
    return (<React.Fragment>
      <GitHubAuth/>
      <NotebookEditor notebook={new Notebook()}/>
    </React.Fragment>);
  }
}

export default App;
