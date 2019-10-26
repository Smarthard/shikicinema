
function run() {
    try {
        chrome.runtime.onMessage.addListener((request) => {
           if (request.open_url) {
               chrome.tabs.create({url: request.open_url, active: true});
           }

           return false;
        });
    } catch (err) {
        console.log(err);
    }
}

run();
