// whenever the popup window is opened, get the stored option variables
chrome.storage.local.get(['counts_always'], function (result) {
    document.getElementById('addon_counts_switch').checked = result.counts_always
});

chrome.storage.local.get(['show_captions'], function (result) {
    document.getElementById('addon_captions_switch').checked = result.show_captions
});

//handlers
function toggle_counts_update(event) {
    chrome.storage.local.set({ counts_always: this.checked });
}

function addon_captions_switch(event) {
    chrome.storage.local.set({ show_captions: this.checked });
}

// listen for toggle switch changes, add handlers that set the stored option variables 
// variable 1: counts_always: if true, count update is executed for every 
// keyup, scroll events
// it 's used in file: count_charachters.js
// variable 2: show_captions, to enable/disable captions below the video
// it 's used in file: add_captions.js
document.getElementById('addon_counts_switch').addEventListener('change', toggle_counts_update);  
document.getElementById('addon_captions_switch').addEventListener('change', addon_captions_switch);