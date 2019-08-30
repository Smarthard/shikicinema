
const SHIKIVIDEOS_CLIENT_ID = process.env.SHIKIVIDEOS_CLIENT_ID;
const SHIKIVIDEOS_CLIENT_SECRET = process.env.SHIKIVIDEOS_CLIENT_SECRET;

const SHIKIVIDEOS_API = "https://smarthard.net";
const EXTENSION_URL = chrome.runtime.getURL('player.html').replace('/player.html', '');

class ShikivideosApi {

    constructor() {}

    async _getToken() {
        return new Promise(async (resolve, reject) =>  {
            chrome.storage.local.get('token', (result) => {
                let storage_token = result.token;

                if (storage_token && !ShikivideosApi.expired(storage_token))
                    resolve(storage_token);
                else
                    this.obtainToken()
                        .then(token => resolve(token))
                        .catch(err => reject(err));
            });
        });
    };

    obtainToken() {
        return new Promise((resolve, reject) => {
            let query = buildQueryString({
                grant_type: 'client_credentials',
                client_id: SHIKIVIDEOS_CLIENT_ID,
                client_secret: SHIKIVIDEOS_CLIENT_SECRET,
                scopes: 'database:shikivideos_create',
            });
            let url = `${SHIKIVIDEOS_API}/oauth/token?${query}`;

            fetch(url)
                .then(response => response.json())
                .then(access => {
                    this.access_token = access;

                    chrome.storage.local.set({ 'token': access }, () => resolve(access))
                })
                .catch(err => reject(err));
        });
    }

    async getToken() {
        let token = null;

        try {
            token = this.access_token && !ShikivideosApi.expired(this.access_token)
                ? this.access_token
                : await this._getToken();
        } catch (err) {
            console.error(err);
        }

        return token;
    }

    static expired(token) {
        return Date.now() > new Date(token.expires);
    }
}

function buildQueryString(params) {
    return Object.keys(params)
        .map(key => [key, params[key]].join('='))
        .join('&').replace(/%20/g, '+');
}

function shikimoriGetToken() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('shikimori_token', (storage_token) => {
            resolve(storage_token ? storage_token.shikimori_token : null);
        })
    });
}

async function run() {
    try {
        let videos_token = null;

        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
           if (request.open_url) {
               chrome.tabs.create({url: request.open_url, active: true});
           }

           if (request.videos_token) {
                videos_token = await shikivideos_api.obtainToken();
           }

           return false;
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(
            async (details) => {
                let shikimori_token = await shikimoriGetToken();

                if (details.url.includes('shikimori')) {
                    for (let i = 0; i < details.requestHeaders.length; i++) {
                        if (details.requestHeaders[i].name === 'User-Agent') {
                            details.requestHeaders[i].value += ' (with Shikicinema)';
                            break;
                        }
                    }

                    details.requestHeaders.push({
                        name: 'Authorization',
                        value: `Bearer ${shikimori_token.access_token}`
                    });
                }

                return { requestHeaders: details.requestHeaders };
            },
            { urls: ['https://shikimori.one/*', 'https://shikimori.org/*'] },
            ['requestHeaders', 'blocking']
        );
    } catch (err) {
        console.log(err);
    }
}

let shikivideos_api = new ShikivideosApi();

run()
    .catch(err => console.error(err));
