/* eslint-disable no-use-before-define */
export function getAuthorizationCode(shikimoriDomain: string, shikimoriOAuthClientId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const codeUrl = new URL(`${shikimoriDomain}/oauth/authorize`);
        codeUrl.searchParams.set('client_id', shikimoriOAuthClientId);
        codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        codeUrl.searchParams.set('response_type', 'code');

        chrome.tabs.query({ active: true }, ([selectedTab]) =>
            chrome.tabs.create({ active: true, url: codeUrl.toString() }, (authCodeTab) => {
                const onRemove = (tabId) => {
                    if (tabId === authCodeTab.id) {
                        reject(new Error('tab-removed'));
                        removeListeners();
                    }
                };

                const onUpdate = (tabId, changeInfo) => {
                    const isUrlNoTChanged = !changeInfo.url;
                    const isShouldSignIn = changeInfo?.url?.toString()?.includes('sign_in');

                    if (isUrlNoTChanged || isShouldSignIn) {
                        return;
                    }

                    const tabUrl = new URL(changeInfo.url);
                    const error = tabUrl.searchParams.get('error');
                    const message = tabUrl.searchParams.get('error_description');
                    const code = tabUrl.toString().split('authorize/')[1];

                    if (
                        tabId !== authCodeTab.id ||
                        isUrlNoTChanged ||
                        tabUrl.toString().includes('response_type')
                    ) {
                        return;
                    }

                    if (error || message) {
                        reject(new Error(error || message));
                    } else {
                        resolve(code);
                    }

                    removeListeners();
                    chrome.tabs.update(
                        selectedTab.id,
                        { active: true },
                        () => chrome.tabs.remove(authCodeTab.id),
                    );
                };

                const removeListeners = () => {
                    chrome.tabs.onRemoved.removeListener(onRemove);
                    chrome.tabs.onUpdated.removeListener(onUpdate);
                };

                chrome.tabs.onRemoved.addListener(onRemove);
                chrome.tabs.onUpdated.addListener(onUpdate);
            }),
        );
    });
}
