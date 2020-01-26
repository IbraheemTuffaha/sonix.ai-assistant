// Global declarations
var eol = "###"
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


function update_caption() {
    var current_time = vid.currentTime*100.0 + margin;//total_time * elabsed_bar_width;
    var paragraphs = getParagraphs();
    var index = get_index_of_paragraph(paragraphs, current_time);
    if(index==-1){return 0;}//do not do anything if no caption is found
    parag_text = as_text(paragraphs[index]);

    for(index; index < paragraphs.length - 1; index++){
        if (is_parag_complete(paragraphs[index])){break;}
        next_parag_text = as_text(paragraphs[index + 1]);
        parag_text = parag_text.replace(eol, "").concat("<br>").concat(next_parag_text);
    }
    $(caption).html(parag_text.replace(eol, ""));
}

// helper functions
function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
}
// check if paragraph is complete (no splitting)
function is_parag_complete(parag_element) {
    var text = as_text(parag_element);
    return !(text.length >= eol.length && text.substring(text.length - eol.length, text.length) == eol);
}

// function receives a time frame as string ("HH:MM:SS") , and returns a 
// index of corresponding paragraph
function get_index_of_paragraph(paragraphs, current_time) {
    var index = 0;
    var found = false;
    for (index = 0; index < paragraphs.length - 1; index++) {
        if (current_time >= start_time(paragraphs[index]) && current_time < start_time(paragraphs[index + 1])) {
            found = true;
            break;
        }
    }
    //if no matching caption is found, return -1 indicating not found
    if (!found){return -1;}
    for (index; index > 0; index--){
        if (is_parag_complete(paragraphs[index-1])){break;}
    }
    return index;
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
