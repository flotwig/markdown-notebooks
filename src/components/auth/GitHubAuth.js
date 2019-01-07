import React from 'react';
import { GitHubApi } from '../../GitHubApi';
import GitHubLoginPrompt from './GitHubLoginPrompt';
import GitHubLoginLoader from './GitHubLoginLoader';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux'
import { FETCH_TOKEN } from '../../state/authActions';

/**
 * Top-level GitHub auth component. Handles displaying either the login button or displaying the
 * loading screen while the GitHub token is retrieved.
 */
class GitHubAuth extends React.Component {
    constructor(props) {
        super(props)
        let stateId = localStorage.getItem('stateId')
        this.state = {
            code: GitHubApi.getAuthCode(window.location.href, stateId),
            stateId
        }
    }

    componentDidMount() {
        if (this.state.code) {
            this.props.fetchToken(this.state.code, this.state.stateId)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.auth.valid !== this.props.auth.valid) {
            window.history.pushState(undefined, undefined, '/')
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
                {!this.props.auth.isLoadingToken ? 
                    <GitHubLoginPrompt fetchToken={this.props.fetchToken}/> 
                    : 
                    <GitHubLoginLoader code={this.state.code} stateId={this.state.stateId}/>}
            </Dialog>
        )
    }
}

const ConnectedGitHubAuth = connect(
    (state) => {
        return {
            auth: state.auth
        }
    },
    (dispatch) => {
        return {
            fetchToken: (code, stateId) => dispatch(FETCH_TOKEN(code, stateId))
        }
    }
)(GitHubAuth)

export default ConnectedGitHubAuth