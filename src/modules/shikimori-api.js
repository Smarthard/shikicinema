
import axios from 'axios';

export default class ShikiAPI {

    static _getDomain() {
        if (window.location.toString().includes('shikimori.one')) {
            return 'shikimori.one';
        } else {
            return 'shikimori.org';
        }
    }

    static isLoggedIn() {
        return new Promise(resolve => {
            axios.get(`https://${ShikiAPI._getDomain()}/api/users/whoami`).then(value => {
                resolve(value.data != null)
            }).catch(err => {
                console.error(err);
                resolve(false)
            });
        });
    }
}
