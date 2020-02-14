function toggle_counts_update(event) {
    chrome.storage.local.set({ captions_on: true });
}

function addon_captions_switch(event) {
    chrome.storage.local.set({ captions_on: false });
}

document.getElementById('addon_counts_switch').addEventListener('change', toggle_counts_update);  
document.getElementById('addon_captions_switch').addEventListener('change', addon_captions_switch);  