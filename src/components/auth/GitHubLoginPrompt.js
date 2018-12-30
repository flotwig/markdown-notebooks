import React from 'react';
import { GitHubApi } from '../../GitHub'
import { AnchorButton } from '@blueprintjs/core';

/**
 * Dialog box that prompts the user to log in to GitHub.
 */
export default class GitHubLoginPrompt extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div class="bp3-dialog-body">
                    MDNB saves your notebooks to GitHub Gists. Please log in with GitHub to continue.
                </div>
                <div class="bp3-dialog-footer">
                    <div class="bp3-dialog-footer-actions">
                    <AnchorButton 
                            onClick={()=>GitHubApi.redirectLogin()}
                            icon={<img src="/assets/github.svg" 
                            style={{width: '16px', height: '16px'}}/>}>
                        Log in with GitHub</AnchorButton>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}