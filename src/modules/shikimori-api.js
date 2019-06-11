
const axios = require('axios');

let _DOMAIN = _getDomain();

function _getDomain() {
    if (window.location.toString().includes('shikimori.one')) {
        return 'shikimori.one';
    } else {
        return 'shikimori.org';
    }
}

module.exports.isLoggedIn = function isLoggedIn() {
    return new Promise(resolve => {
        axios.get(`https://${_DOMAIN}/api/users/whoami`).then(value => {
            resolve(value.data != null)
        }).catch(err => {
            console.error(err);
            resolve(false)
        });
    });
};


