var show_captions;


chrome.storage.local.get(['show_captions'], function (result) {
    show_captions = result.show_captions;
    if (show_captions) {
        vid.addEventListener("play", on_play_event);
        vid.addEventListener("pause", on_pause_event);
    }
});
// Global declarations
var eol = "###"
var vid = document.getElementById("vjs_video_3_html5_api");




function on_play_event() {
    vid.addEventListener("timeupdate", update_caption);
}

function on_pause_event() {
    vid.removeEventListener("timeupdate", update_caption);
};
// if current time is close to the next paragraph by this margin
// switch to the next paragraph
var margin = 5
// video window element
var element = document.getElementById("vjs_video_3");

// create a div, to be added as a child to video elemen
//this div will hold the captions
var caption_container = document.createElement("div");
caption_container.setAttribute("id", "caption_container");
caption_container.setAttribute("dir", "rtl");
caption_container.className = "caption-container";
element.appendChild(caption_container);
var caption = document.createElement("p");
caption.setAttribute("id", "caption");
caption.className = "caption";
var text = document.createTextNode("");
caption.appendChild(text);
caption_container.appendChild(caption);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("show_captions" in changes) {
        if (!changes["show_captions"].oldValue && changes["show_captions"].newValue) {
            vid.addEventListener("play", on_play_event);
            vid.addEventListener("pause", on_pause_event);
            document.getElementById("caption_container").style.display = "block";
            update_caption()
        }
        if (changes["show_captions"].oldValue && !changes["show_captions"].newValue) {
            vid.removeEventListener("play", on_play_event);
            vid.removeEventListener("pause", on_pause_event);
            vid.removeEventListener("timeupdate", update_caption);
            document.getElementById("caption_container").style.display = "none";
        }
    }

});


function update_caption() {
    var current_time = vid.currentTime * 100.0 + margin;//total_time * elabsed_bar_width;
    var paragraphs = getParagraphs();
    var index = get_index_of_paragraph(paragraphs, current_time);
    //do not do anything if no caption is found
    if (index == -1) {
        $(caption).html("");
        return 0;
    }
    parag_text = as_text(paragraphs[index]);

    for (index; index < paragraphs.length - 1; index++) {
        if (is_parag_complete(paragraphs[index])) { break; }
        next_parag_text = as_text(paragraphs[index + 1]);
        parag_text = parag_text.replace(eol, "").concat("<br>").concat(next_parag_text);
    }
    $(caption).html(parag_text);
}

// helper functions

// function receives a time frame as string ("HH:MM:SS") , and returns a 
// index of corresponding paragraph
function get_index_of_paragraph(paragraphs, current_time) {
    var index = 0;
    var found = false;
    for (index = 0; index < paragraphs.length; index++) {
        if (is_match(current_time, paragraphs, index)) {
            found = true;
            break;
        }
    }
    //if no matching caption is found, return -1 indicating not found
    if (!found) { return -1; }
    // check previous paragraphs
    for (index; index > 0; index--) {
        if (is_parag_complete(paragraphs[index - 1])) { break; }
    }
    return index;
}

function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
}

// check if paragraph is complete (no splitting)
function is_parag_complete(parag_element) {
    var text = as_text(parag_element);
    return !(text.length >= eol.length && text.substring(text.length - eol.length, text.length) == eol);
}

// get text content of a paragraph
function as_text(parag_element) {
    var content = parag_element.getElementsByClassName("exchange--content");
    return $(content).text();
}

// Check if current time belongs to the duration of the selected paragraph
function is_match(current_time, paragraphs, index) {
    var stime, etime;
    //start time
    if (index > 0) {
        if (!is_parag_complete(paragraphs[index - 1])) {
            var words = paragraphs[index - 1].getElementsByClassName("word");
            stime = parseFloat(words[0].dataset.from);
        }
        else {
            var words = paragraphs[index].getElementsByClassName("word");
            stime = parseFloat(words[0].dataset.from);
        }
    }
    else {
        var words = paragraphs[index].getElementsByClassName("word");
        stime = parseFloat(words[0].dataset.from);
    }

    //end time
    if (index < paragraphs.length - 1 && !is_parag_complete(paragraphs[index])) {
        var words = paragraphs[index + 1].getElementsByClassName("word");
        etime = parseFloat(words[words.length - 1].dataset.to);
    }
    else {
        var words = paragraphs[index].getElementsByClassName("word");
        etime = parseFloat(words[words.length - 1].dataset.to);
    }
    return (current_time >= stime && current_time < etime);
}
