import React from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';

/**
 * Component to display loading screen while token is retrieved.
 */
export default class GitHubLoginLoader extends React.Component {
    render() {
        return (
            <div className="bp3-dialog-body">
                {this.props.error ? 
                    <NonIdealState icon="error"
                                description="An authentication error has occurred. Please reload the page."/>
                    :
                    <NonIdealState icon={<Spinner/>}
                               description="Logging you in..."/>}
            </div>
        )
    }
}