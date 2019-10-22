
const SHIKIVIDEOS_CLIENT_ID = process.env.SHIKIVIDEOS_CLIENT_ID;
const SHIKIVIDEOS_CLIENT_SECRET = process.env.SHIKIVIDEOS_CLIENT_SECRET;

const SHIKIMORI_CLIENT_ID = process.env.SHIKIMORI_CLIENT_ID;
const SHIKIMORI_CLIENT_SECRET = process.env.SHIKIMORI_CLIENT_SECRET;

const SHIKIVIDEOS_API = "https://smarthard.net";
const EXTENSION_VERSION = chrome.runtime.getManifest().version;
const EXTENSION_ID = chrome.runtime.getURL('index.html').replace('/index.html', '');

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

async function getInitiator(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.get(tabId, tab => resolve(tab.url))
    });
}

function _authorize() {
    return new Promise(async (resolve, reject) => {
        let code_url = new URL('https://shikimori.one/oauth/authorize?');
        code_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
        code_url.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        code_url.searchParams.set('response_type', 'code');

        chrome.tabs.query({active: true}, ([selectedTab]) =>
            chrome.tabs.create({active: true, url: code_url.toString()}, new_tab => {

                const onRemove = (tabId) => {
                    if (tabId === new_tab.id) {
                        reject({error: 'tab-removed'});
                        remove_listeners();
                    }
                };

                const onUpdate = (tabId, changeInfo) => {
                    const tabUrl = new URL(changeInfo.url);
                    const error = tabUrl.searchParams.get('error');
                    const error_description = tabUrl.searchParams.get('error_description');
                    const code = tabUrl.toString().split('authorize/')[1];

                    if (tabId !== new_tab.id || !changeInfo.url || tabUrl.toString().includes('response_type'))
                        return;

                    if (error || error_description) {
                        reject({error, error_description});
                    } else {
                        resolve(code);
                    }

                    remove_listeners();
                    chrome.tabs.update(
                        selectedTab.id,
                        { active: true },
                        () => chrome.tabs.remove(new_tab.id)
                    );
                };

                const remove_listeners = () => {
                    chrome.tabs.onRemoved.removeListener(onRemove);
                    chrome.tabs.onUpdated.removeListener(onUpdate);
                };

                chrome.tabs.onRemoved.addListener(onRemove);
                chrome.tabs.onUpdated.addListener(onUpdate);
            })
        );
    });
}

async function obtainShikiToken(code) {
    return new Promise(async (resolve, reject) => {
        let token_url = new URL('https://shikimori.one/oauth/token');

        token_url.searchParams.set('grant_type', 'authorization_code');
        token_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
        token_url.searchParams.set('client_secret', SHIKIMORI_CLIENT_SECRET);
        token_url.searchParams.set('code', code);
        token_url.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

        fetch(token_url.toString(), {
            method: 'POST'
        })
            .then(response => resolve(response.json()))
            .catch(err => reject(err));
    });
}

async function refreshShikiToken() {
    return new Promise(async (resolve, reject) => {
        let token = await syncStorageGet('shikimori_token') || null;
        let refresh_url = new URL('https://shikimori.one/oauth/token');

        if (!token || !token.refresh_token)
            reject(new Error('Refresh Token not found'));

        refresh_url.searchParams.set('grant_type', 'refresh_token');
        refresh_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
        refresh_url.searchParams.set('client_secret', SHIKIMORI_CLIENT_SECRET);
        refresh_url.searchParams.set('refresh_token', token.refresh_token);

        fetch(refresh_url.toString(), {
            method: 'POST'
        })
            .then(response => resolve(response.json()))
            .catch(err => reject(err));
    });
}

async function syncStorageSet(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ obj }, () => {
            const err = chrome.runtime.lastError;

            if (err)
                reject(err);
            else
                resolve(obj);
        });
    });
}

async function syncStorageGet(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({ obj }, (items) => {
            const err = chrome.runtime.lastError;

            if (err)
                reject(err);
            else
                resolve(items.obj);
        });
    });
}

function up2date(expires) {
    return Date.now() < expires;
}

async function run() {
    try {
        let videos_token = null;
        let shikimori_token = await syncStorageGet('shikimori_token')
            .catch(err => console.error('shikimori_token error:', err)) || null;

        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
           if (request.open_url) {
               chrome.tabs.create({url: request.open_url, active: true});
           }

           if (request.videos_token) {
                videos_token = await obtainVideosToken();
           }

           if (request.shikimori_sync) {
               const code = await _authorize()
                   .catch(err => console.error(err)) || null;

               if (code) {
                   shikimori_token = await obtainShikiToken(code);
                   await syncStorageSet(shikimori_token);
               }
           }

           return false;
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(
            async (details) => {
                // let initiator = await getInitiator(details.tabId);

                for (let i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders[i].value += ` (with Shikicinema ${EXTENSION_VERSION})`;
                        break;
                    }
                }

                // TODO: solve the issue with angular's HttpClient and cookies
                /* if (initiator.includes(EXTENSION_ID) &&
                    details.url.includes('shikimori') &&
                    !!shikimori_token.access_token
                ) {
                    const expires = new Date((shikimori_token.created_at + shikimori_token.expires_in) * 1000);
                    if (!up2date(expires)) {
                        shikimori_token = await refreshShikiToken() || null;
                        await syncStorageSet(shikimori_token);
                    }

                    details.requestHeaders.push({
                        name: 'Authorization',
                        value: `Bearer ${shikimori_token.access_token}`
                    });
                 } */

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
