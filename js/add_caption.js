// Global declarations
var eol = "###"
var time_bar = document.getElementById("waveform");
var vid = document.getElementById("vjs_video_3_html5_api");

vid.addEventListener("timeupdate", update_caption);
window.addEventListener("keyup", update_caption);

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


function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
}
// check if paragraph is complete (no splitting)
function is_complete(text) {
    return !(text.length >= eol.length && text.substring(text.length - eol.length, text.length) == eol);
}


function update_caption() {
    var current_time = vid.currentTime*100.0;//total_time * elabsed_bar_width;
    var paragraphs = getParagraphs();
    var index = get_index_of_paragraph(paragraphs, current_time);
    parag_text = as_text(paragraphs[index]);
    if (!is_complete(parag_text) && index < paragraphs.length - 1) {
        next_parag_text = as_text(paragraphs[index + 1]);
        parag_text = parag_text.replace(eol, "").concat("<br>").concat(next_parag_text);
    }
    $(caption).html(parag_text.replace(eol, ""));
}

// helper functions

// function receives a time frame as string ("HH:MM:SS") , and returns a 
// index of corresponding paragraph
function get_index_of_paragraph(paragraphs, current_time) {
    var paragraph_index = 0;
    var i;
    for (i = 0; i < paragraphs.length - 1; i++) {
        if (current_time+margin < start_time(paragraphs[i + 1])) {
            break;
        }
    }
    paragraph_index = i;
    if (paragraph_index > 0) {
        previous_parag_text = as_text(paragraphs[paragraph_index - 1]);
        if (!is_complete(previous_parag_text)) {
            return paragraph_index - 1;
        }
    }
    return paragraph_index;
}

// convert time in string format ("HH:MM:SS") to seconds as total seconds (int)
function timestr2int(timestr) {
    var segments = timestr.split(":");
    var weight = 3600;
    var result = 0;
    for (segment of segments) {
        result += parseInt(segment) * weight;
        weight /= 60;
    }
    return result;
}

// get start time of a paragraph 
function start_time(parag_element) {
    return parseFloat(parag_element.dataset.exchangeFrom);
}

// get text content of a paragraph
function as_text(parag_element) {
    var content = parag_element.getElementsByClassName("exchange--content");
    return $(content).text();
}
