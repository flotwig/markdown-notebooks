import { createContext } from 'react';
import { authEndpoint, githubClientId } from './env';

const GH_BASEURL = 'https://github.com/';
const API_BASEURL = 'https://api.github.com/';

export class GitHubApi {
    static storeAuth(valid, token) {
        localStorage.setItem('githubAuth', JSON.stringify({
            valid, token
        }))
    }

    static getStoredAuth() {
        let storedAuth = localStorage.getItem('githubAuth') || 'undefined';
        try {
            return JSON.parse(storedAuth);
        } catch {
            return {
                valid: false,
                token: undefined
            }
        }
    }

    static redirectLogin() {
        const scopes = ['gist']
        const stateId = Math.random().toString().split('.')[1]
        localStorage.setItem('stateId', stateId)
        window.location.href = GH_BASEURL + "login/oauth/authorize" +
            "?client_id=" + githubClientId +
            "&redirect_uri=" + window.location.origin +
            "&scope=" + scopes.join(' ') +
            "&state=" + stateId
    }

    /**
     * Gets the auth code from the URL and verifies the state code matches.
     */
    static getAuthCode(url, stateId) {
        const regex = /\?code=([a-z0-9]+)&state=([0-9]+)/gm;
        let matches = regex.exec(url) || []
        let code = matches[1];
        let state = matches[2];
        if (stateId !== state) return undefined;
        return code;
    }

    static getAccessToken(code, stateId, cb) {
        const tokenUrl = authEndpoint +
            "?client_id=" + githubClientId +
            "&code=" + code +
            "&redirect_uri=" + window.location.origin +
            "&state=" + stateId
        fetch(tokenUrl).then(response => {
            if (response.status !== 200) {
                console.log('Auth problem')
            } else {
                response.json().then(data => {
                    cb(data['access_token'])
                })
            }
        })
    }

    static updateGist(gistId, gist) {
        return GitHubApi._fetch('gists/' + gistId, 'PATCH', gist)
    }

    static createGist(gist) {
        return GitHubApi._fetch('gists', 'POST', gist)
    }

    static listOwnedGists() {
        return GitHubApi._fetch('gists')
    }

    static getGist(gistId) {
        return GitHubApi._fetch('gists/' + gistId)
    }

    static _fetch(endpoint, method='GET', body=undefined) {
        let { token } = GitHubApi.getStoredAuth()
        return fetch(API_BASEURL + endpoint, {
            method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "token " + token
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
    }
}

const GitHub = createContext(new GitHubApi());

export default GitHub;