import { IMGUR_CLIENT_ID } from './env';

const API_BASEURL = 'https://api.imgur.com/3/';

/**
 * Facilitates interactions with the imgur.com API.
 */
export default class ImgurApi {
    /**
     * Upload an image to Imgur. Returns a promise with the response.
     * 
     * @param {string} image base64-encoded image string
     * @param {string} title description, title, and name of uploaded image
     */
    static uploadImage(image, title) {
        return ImgurApi._fetch('image', 'POST', {
            name: title,
            title,
            description: title,
            image
        })
    }

    /**
     * Helper method to convert Blob objects to base64 strings.
     * 
     * @param {Blob} blob Input blob
     * @param {Function} cb Callback that will receive the base64 string
     */
    static blobToBase64(blob, cb) {
        var reader = new FileReader();
        reader.onload = function() {
           var dataUrl = reader.result;
           var base64 = dataUrl.split(',')[1];
           cb(base64);
        };
        reader.readAsDataURL(blob);
    };

    /**
     * Internal fetch method that hits Imgur API.
     * 
     * @param {string} endpoint API endpoint to reach
     * @param {string} method Optional HTTP method to use
     * @param {object} body Optional object to send as a JSON body
     */
    static _fetch(endpoint, method='GET', body=undefined) {
        return fetch(API_BASEURL + endpoint, {
            method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Client-ID " + IMGUR_CLIENT_ID
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
    }
}
