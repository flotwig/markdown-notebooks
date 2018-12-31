import React from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { GitHubApi } from '../../GitHub';

export default class GitHubLoginLoader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false
        }
    }
    componentDidMount() {
        GitHubApi.getAccessToken(this.props.code, this.props.stateId, token => {
            window.history.pushState(undefined, undefined, '/')
            if (!token) {
                this.setState({ error: true })
            } else {
                this.props.github.saveAccessToken(token)
            }
        })
    }
    render() {
        return (
            <div className="bp3-dialog-body">
                {this.state.error ? 
                    <NonIdealState icon="error"
                                description="An authentication error has occurred. Please reload the page."/>
                    :
                    <NonIdealState icon={<Spinner/>}
                               description="Logging you in..."/>}
            </div>
        )
    }
} 