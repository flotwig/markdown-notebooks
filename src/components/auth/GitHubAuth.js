import React from 'react';
import { GitHubApi } from '../../GitHub';
import GitHubLoginPrompt from './GitHubLoginPrompt';
import GitHubLoginLoader from './GitHubLoginLoader';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux'

class GitHubAuth extends React.Component {
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
            <Dialog 
                    canEscapeKeyClose={false}
                    canOutsideClickClose={false}
                    isOpen={!this.props.auth.valid}>
                <div className="bp3-dialog-header">
                    <h4 className="bp3-heading">Welcome to Markdown Notebooks!</h4>
                </div>
                {!this.state.code ? 
                    <GitHubLoginPrompt/> 
                    : 
                    <GitHubLoginLoader code={this.state.code} stateId={this.state.stateId}/>}
            </Dialog>
        )
    }
}

GitHubAuth = connect(
    (state, ownProps) => {
        return {
            auth: state.auth
        }
    }
)(GitHubAuth)

export default GitHubAuth