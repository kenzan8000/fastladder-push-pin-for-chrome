window.onload = function() {
    var defaults = { fastladder: { url: '' } };
    chrome.storage.local.get(defaults, function(items) {
        var fastladderUrl = document.getElementById("fastladder-url");
        fastladderUrl.value = items.fastladder.url;
    });

    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function() {
        var fastladderUrl = document.getElementById("fastladder-url");
        var entity = { fastladder: { url: fastladderUrl.value } };
        chrome.storage.local.set(entity, function() {
            window.close();
        });
    });
};
