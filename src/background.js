
const SHIKIVIDEOS_CLIENT_ID = process.env.SHIKIVIDEOS_CLIENT_ID;
const SHIKIVIDEOS_CLIENT_SECRET = process.env.SHIKIVIDEOS_CLIENT_SECRET;

const SHIKIVIDEOS_API = "https://smarthard.net";
const EXTENSION_VERSION = chrome.runtime.getManifest().version;
const EXTENSION_ID = chrome.runtime.getURL('player.html').replace('/player.html', '');

function obtainVideosToken() {
    const _generateNewToken = () => {
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
    };

    return new Promise((resolve, reject) => {
        chrome.storage.local.get('token', async (videos_token) => {
            let token = videos_token.token;

            if (!token || !token.access_token || Date.now() > new Date(token.expires))
                token = await _generateNewToken().catch(err => reject(err));

            resolve(token);
        })
    });
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

async function getInitiator(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.get(tabId, tab => resolve(tab.url))
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
                videos_token = await obtainVideosToken();
           }

           return false;
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(
            async (details) => {
                let shikimori_token = await shikimoriGetToken();
                let initiator = await getInitiator(details.tabId);

                for (let i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders[i].value += ` (with Shikicinema ${EXTENSION_VERSION})`;
                        break;
                    }
                }

                if (initiator.includes(EXTENSION_ID) && details.url.includes('shikimori') && !!shikimori_token) {
                    details.requestHeaders.push({
                        name: 'Authorization',
                        value: `Bearer ${shikimori_token.access_token}`
                    });
                }

                return { requestHeaders: details.requestHeaders };
            },
            { urls: ['https://shikimori.one/api/*', 'https://shikimori.org/api/*', 'https://smarthard.net/*'] },
            ['requestHeaders', 'blocking']
        );
    } catch (err) {
        console.log(err);
    }
}

run()
    .catch(err => console.error(err));
