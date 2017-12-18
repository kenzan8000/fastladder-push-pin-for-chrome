chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {

        var defaults = { fastladder: { url: '' } };
        chrome.storage.local.get(defaults, function(items) {
            // check if fastladder url is valid
            var fastladderUrl  = document.createElement('a');
            fastladderUrl.href = items.fastladder.url;
            if (fastladderUrl.protocol !== 'https:' && fastladderUrl.protocol !== 'http:') {
                chrome.tabs.create({ url: "view/options.html" });
                chrome.notifications.create(
                    "",
                    { type: "basic", title: "Fastladder URL is invalid.", message: "Check out your settings.", iconUrl:"icons/icon48.png" },
                    function(id) { }
                );
                return;
            }
            // add a pin
            var link = tabs[0].url;
            var title = tabs[0].title;
            var apiUrl = items.fastladder.url + "/api/pin/add?link=" + encodeURIComponent(link) + "&title=" + encodeURIComponent(title);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(data) {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    var responseJson = {};
                    try { responseJson = JSON.parse(xhr.responseText); }
                    catch (e) { }
                    // succeeded
                    var successfullyAdded = (responseJson.isSuccess === true);
                    var alreadyAdded = (xhr.status === 500 && xhr.responseText.indexOf('ActiveRecord::RecordNotUnique') !== -1); // !?!?
                    if (successfullyAdded || alreadyAdded) {
                        chrome.notifications.create(
                            title,
                            { type: "basic", title: "Successfully added a pin.", message: title + "\n" + link, iconUrl:"icons/icon48.png" },
                            function(id) { }
                        );
                    }
                    // failed?
                    else {
                        var loginUrl = items.fastladder.url + "/login";
                        chrome.tabs.create({ url: loginUrl });
                        chrome.notifications.create(
                            "",
                            { type: "basic", title: "Failed to push a pin.", message: "Login to Fastladder.", iconUrl:"icons/icon48.png" },
                            function(id) { }
                        );
                    }
                }
            };
            xhr.open('POST', apiUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });

    });
});
