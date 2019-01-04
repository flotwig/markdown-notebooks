import React from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { GitHubApi } from '../../GitHubApi';
import { connect } from 'react-redux';
import { createAction } from 'redux-starter-kit';

class GitHubLoginLoader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false
        }
    }
    componentDidMount() {
        GitHubApi.getAccessToken(this.props.code, this.props.stateId, token => {
            window.history.pushState(undefined, undefined, '/')
            this.props.setValid(!!token)
            this.props.setToken(token)
            GitHubApi.storeAuth(!!token, token)
            if (!token) {
                this.setState({ error: true })
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

GitHubLoginLoader = connect((state) => {
    return {}
}, (dispatch) => {
    return {
        setValid: (valid) => dispatch(createAction('SET_VALID')(valid)),
        setToken: (token) => dispatch(createAction('SET_TOKEN')(token))
    }
})(GitHubLoginLoader)

export default GitHubLoginLoader