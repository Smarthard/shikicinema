
function run() {
    try {
        chrome.runtime.onMessage.addListener((request) => {
           if (request.openUrl) {
               chrome.storage.local.get('settings', (obj) => {
                  const settings = obj.settings;

                  if (settings && settings.playerTabOpens && settings.playerTabOpens === 'same') {
                    chrome.tabs.update({ url: request.openUrl });
                  } else {
                    chrome.tabs.create({ url: request.openUrl, active: true });
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
