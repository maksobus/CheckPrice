chrome.tabs.onUpdated.addListener(checkTab);

function checkTab() {
    chrome.tabs.query({active: true}, function (tabs) {
        let tab = tabs[0];
        if (tab.status !== 'complete') return;
        if (!tab.url) return;

        console.log(tab.status);
        let regex = /item\/\d+\.html/;

        if (regex.test(tab.url)) {
            chrome.scripting
                .executeScript({
                    target: {"tabId": tab.id},
                    files: ["script.js"],
                })
                .then(() => console.log("script injected"));
        }
    });
}

