chrome.storage.local.get(['counts_always'], function (result) {
    document.getElementById('addon_counts_switch').checked = result.counts_always
});

chrome.storage.local.get(['hide_captions'], function (result) {
    document.getElementById('addon_captions_switch').checked = result.hide_captions
});

function toggle_counts_update(event) {
    chrome.storage.local.set({ counts_always: this.checked });
}

function addon_captions_switch(event) {
    chrome.storage.local.set({ hide_captions: this.checked });
}

document.getElementById('addon_counts_switch').addEventListener('change', toggle_counts_update);  
document.getElementById('addon_captions_switch').addEventListener('change', addon_captions_switch);