import { createContext } from 'react';
import { githubClientId } from './env';

export class GitHubApi {
    constructor() {
        this.auth = GitHubApi.getStoredAuth()
    }

    static getStoredAuth() {
        let storedAuth = localStorage.getItem('githubAuth');
        if (!storedAuth) return {};
        return JSON.parse(storedAuth);
    }

    static redirectLogin() {
        const scopes = ['gist']
        const stateId = Math.random().toString().split('.')[1]
        localStorage.setItem('stateId', stateId)
        window.location.href = "https://github.com/login/oauth/authorize?" +
            "&client_id=" + githubClientId +
            "&redirect_uri=" + window.location.origin +
            "&scope=gist" +
            "&state=" + stateId
    }
}

const GitHub = createContext(new GitHubApi());

export default GitHub;