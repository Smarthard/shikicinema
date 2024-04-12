
function run() {
    try {
        chrome.runtime.onMessage.addListener((request, sender) => {
           if (request.openUrl) {
               chrome.storage.local.get('settings', (obj) => {
                  const settings = obj.settings;

                  if (settings && settings.playerTabOpens && settings.playerTabOpens === 'same') {
                    chrome.tabs.update(sender.tab.id, { url: request.openUrl });
                  } else {
                    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                        const currentIndex = tabs[0].index;
                        chrome.tabs.create({ url: request.openUrl, index: currentIndex + 1, active: true });
                    });
                  }
               });
           }

           return false;
        });
    } catch (err) {
        console.log(err);
    }
}

run();
