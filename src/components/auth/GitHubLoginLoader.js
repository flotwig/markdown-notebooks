import React from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';

export default class GitHubLoginLoader extends React.Component {
    render() {
        return (
            <div class="bp3-dialog-body">
                <NonIdealState icon={<Spinner/>}
                               description="Logging you in..."/>
            </div>
        )
    }
}