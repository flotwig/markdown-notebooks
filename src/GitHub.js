import { createContext } from 'react';
import { githubClientId } from './env';

const GH_BASEURL = 'https://github.com/';

export class GitHubApi {
    constructor() {
        this.auth = GitHubApi.getStoredAuth()
    }

    saveAccessToken(token) {
        this.auth = {
            valid: true,
            token
        };
        this.storeAuth();
    }

    storeAuth() {
        localStorage.setItem('githubAuth', JSON.stringify(this.auth))
    }

    static getStoredAuth() {
        let storedAuth = localStorage.getItem('githubAuth');
        if (!storedAuth) return {
            valid: false,
            token: undefined
        };
        return JSON.parse(storedAuth);
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
        const tokenUrl = "https://za.chary.us/projects/mdnb-auth.php" +
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
}

const GitHub = createContext(new GitHubApi());

export default GitHub;