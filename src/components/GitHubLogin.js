import React from 'react';
import { GitHubApi } from '../GitHub'
import { Dialog, AnchorButton } from '@blueprintjs/core';

export default class GitHubLogin extends React.Component {
    render() {
        return (
            <Dialog icon="github"
                    canEscapeKeyClose={false}
                    canOutsideClickClose={false}
                    isOpen={true}>
                <div class="bp3-dialog-header">
                    <span class="bp3-icon-large bp3-icon-door"></span>
                    <h4 class="bp3-heading">Hello world!</h4>
                </div>
                <div class="bp3-dialog-body">
                    Welcome to Markdown Notebooks! To save your work, please log in.
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
            </Dialog>
        )
    }
}