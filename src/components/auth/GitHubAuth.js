import React from 'react';
import { GitHubApi } from '../../lib/GitHubApi';
import GitHubLoginPrompt from './GitHubLoginPrompt';
import GitHubLoginLoader from './GitHubLoginLoader';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux'
import { FETCH_TOKEN, TOGGLE_AUTH_PROMPT, FETCH_USER } from '../../state/authActions';

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
        if (this.props.auth.token) {
            this.props.fetchUser()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.auth.valid !== this.props.auth.valid) {
            //window.history.pushState(undefined, undefined, '/')
        }
    }

    render() {
        return (
            <Dialog
                    className="dialog-github-auth"
                    canEscapeKeyClose={false}
                    canOutsideClickClose={false}
                    isOpen={this.props.auth.showAuthPrompt}>
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
            fetchUser: () => dispatch(FETCH_USER()),
            fetchToken: (code, stateId) => dispatch(FETCH_TOKEN(code, stateId)),
            toggleAuthPrompt: (toggle) => dispatch(TOGGLE_AUTH_PROMPT(toggle))
        }
    }
)(GitHubAuth)

export default ConnectedGitHubAuth
