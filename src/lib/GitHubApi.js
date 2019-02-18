import { fetch } from 'whatwg-fetch'
import { AUTH_ENDPOINT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_BASEURL, GITHUB_API_BASEURL } from '../env';

/**
 * Facilitates interaction with the GitHub API.
 */
export class GitHubApi {
    /**
     * Stores token and validity in internal storage.
     *
     * @param {boolean} valid
     * @param {string} token
     */
    static storeAuth(valid, token) {
        localStorage.setItem('githubAuth', JSON.stringify({
            valid, token
        }))
    }

    /**
     * Returns the stored auth object, or the default if none exists.
     */
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

    static clearStoredAuth() {
        localStorage.removeItem('githubAuth')
    }

    /**
     * Generates and returns the authorization URL to redirect a user to for login.
     *
     * @param {string} stateId stateId to validate the returned code
     */
    static getAuthUrl(stateId) {
        const scopes = ['gist']
        return GITHUB_BASEURL + "login/oauth/authorize" +
            "?client_id=" + GITHUB_CLIENT_ID +
            "&redirect_uri=" + window.location.origin +
            "&scope=" + scopes.join(' ') +
            "&state=" + stateId
    }

    /**
     * Gets the auth code from the URL and verifies the state code matches what is supplied.
     *
     * @param {string} url URL to parse
     * @param {string} stateId stateId to validate. If incorrect, function will return undefined.
     */
    static getAuthCode(url, stateId) {
        const regex = /\?code=([a-z0-9]+)&state=([0-9]+)/gm;
        let matches = regex.exec(url) || []
        let code = matches[1];
        let state = matches[2];
        if (stateId !== state) return undefined;
        return code;
    }

    /**
     * Uses a third-party server to exchange the code for an access token that will be used for future
     * requests. An external server must be used because the GitHub authorization endpoint requires
     * the client secret and blocks cross-origin requests.
     *
     * @param {string} code The code from OAuth redirect
     * @param {string} stateId stateId to send to validate request
     */
    static getAccessToken(code, stateId) {
        const tokenUrl = AUTH_ENDPOINT +
            "?client_id=" + GITHUB_CLIENT_ID +
            "&code=" + code +
            "&redirect_uri=" + window.location.origin +
            "&state=" + stateId +
            (GITHUB_CLIENT_SECRET ?
                "&client_secret=" + GITHUB_CLIENT_SECRET : "")
        return fetch(tokenUrl).then(response => {
            if (response.status !== 200) {
                console.log('Auth problem')
            } else {
                return response.json()
            }
        }).then(data => data['access_token'])
    }

    static updateGist(gistId, gist) {
        return GitHubApi._fetch('gists/' + gistId, 'PATCH', gist)
    }

    static createGist(gist) {
        return GitHubApi._fetch('gists', 'POST', gist)
    }

    static forkGist(gistId) {
        return GitHubApi._fetch(`gists/${gistId}/forks`, 'POST')
    }

    /**
     * @param {Moment} since Optional. Only gists updated at or after this time are returned.
     */
    static listOwnedGists(since) {
        return GitHubApi._fetch('gists' + (since ? `?since=${since.toISOString()}` : ''))
    }

    static getGist(gistId) {
        return GitHubApi._fetch('gists/' + gistId)
    }

    static getCurrentUser() {
        return GitHubApi._fetch('user')
    }

    /**
     * Internal fetch method that hits GitHub API.
     *
     * @param {string} endpoint API endpoint to reach
     * @param {string} method Optional HTTP method to use
     * @param {object} body Optional object to send as a JSON body
     */
    static _fetch(endpoint, method='GET', body=undefined) {
        let { token } = GitHubApi.getStoredAuth()
        return fetch(GITHUB_API_BASEURL + endpoint, {
            method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "token " + token
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.status > 299) {
                if (response.status === 401) {
                    GitHubApi.clearStoredAuth()
                }
                const err = new Error()
                err.response = response
                throw err
            }

            return response.json()
        })
    }
}
