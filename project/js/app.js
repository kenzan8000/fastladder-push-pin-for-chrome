chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {

        //var link = tabs[0].url;
        //var title = tabs[0].title;

        var defaults = { fastladder: { url: '' } };
        chrome.storage.local.get(defaults, function(items) {
            // check if fastladder url is valid
            var fastladderUrl  = document.createElement('a');
            fastladderUrl.href = items.fastladder.url;
            if (fastladderUrl.protocol !== 'https:' && fastladderUrl.protocol !== 'http:') {
                chrome.tabs.create({ url: "view/options.html" });
                return;
            }
        });

        //var entity = { fastladder: { url: '' } };
        //chrome.storage.local.set(entity, function() {
        //});

    });
});
