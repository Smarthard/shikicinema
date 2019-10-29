
function run() {
    try {
        chrome.runtime.onMessage.addListener((request) => {
           if (request.openUrl) {
               chrome.tabs.create({url: request.openUrl, active: true});
           }

           return false;
        });
    } catch (err) {
        console.log(err);
    }
}

run();
