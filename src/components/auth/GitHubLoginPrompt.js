import React from 'react';
import { GitHubApi } from '../../lib/GitHubApi'
import { AnchorButton } from '@blueprintjs/core';

/**
 * Dialog box that prompts the user to log in to GitHub.
 */
export default class GitHubLoginPrompt extends React.Component {
    render() {
        return (
            <>
                <div className="bp3-dialog-body">
                    MDNB saves your notebooks to GitHub Gists. Please log in with GitHub to continue.
                </div>
                <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                    <AnchorButton
                            className="btn-github-login"
                            onClick={()=>this.onClickLogin()}
                            icon={<img src="/assets/github.svg"
                                       style={{width: '16px', height: '16px'}}
                                       alt=""/>}>
                        Log in with GitHub</AnchorButton>
                    </div>
                </div>
            </>
        )
    }

    onClickLogin() {
        // generate and store a code that will be used to validate the response
        const stateId = Math.random().toString().split('.')[1]
        localStorage.setItem('stateId', stateId)
        this.redirectTo(GitHubApi.getAuthUrl(stateId))
    }

    redirectTo(url) {
        window.location.href = url
    }
}
