import React from 'react';
import GitHub, { GitHubApi } from '../../GitHub';
import GitHubLoginPrompt from './GitHubLoginPrompt';
import GitHubLoginLoader from './GitHubLoginLoader';
import { Dialog } from '@blueprintjs/core';

export default class GitHubAuth extends React.Component {
    constructor(props) {
        super(props)
        let stateId = localStorage.getItem('stateId')
        this.state = {
            code: GitHubApi.getAuthCode(window.location.href, stateId),
            stateId
        }
    }
    render() {
        return (
            <GitHub.Consumer>
                {gh => <Dialog 
                        canEscapeKeyClose={false}
                        canOutsideClickClose={false}
                        isOpen={!gh.auth.valid}>
                    <div className="bp3-dialog-header">
                        <h4 className="bp3-heading">Welcome to Markdown Notebooks!</h4>
                    </div>
                    {!this.state.code ? <GitHubLoginPrompt/> : <GitHubLoginLoader code={this.state.code} stateId={this.state.stateId} github={gh}/>}
                </Dialog>}
            </GitHub.Consumer>
        )
    }
}