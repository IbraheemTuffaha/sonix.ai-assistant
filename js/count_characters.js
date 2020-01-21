//var time_bar = document.getElementById("waveform");
//var current_time = time_bar.getElementsByClassName("timecode text--noselect")[0]


// events for testing
window.setInterval(update_subtitle, 5000);

// Global declarations
var time_bar = document.getElementById("waveform");
var caption = document.createElement("p");
//var t = window.setTimeout(function(){ window.clearInterval(t);}, 5000);
//window.setInterval(get_script, 100);


caption.setAttribute("id", "caption");
var text = document.createTextNode("intital");
caption.appendChild(text);
var element = document.getElementById("vjs_video_3");
element.appendChild(caption);
//_________END my chnages________________



window.addEventListener("load", function() {
    addCounts();
});

window.addEventListener("keyup", function() {
    addCounts();
});

window.addEventListener('scroll', function() {
    addCounts();
    setTimeout(function(){ addCounts() }, 200);
});

function addCounts() {
    $(".characters-count").remove();
    var paragraphs = getParagraphs();
    for(var i = 0; i < paragraphs.length; ++i) {
        addCount(paragraphs[i]);
    }
};

function addCount(obj) {
    content = obj.getElementsByClassName("exchange--content");
    extra = obj.getElementsByClassName("exchange--extra");

    var text = $(content).text();


    text = text.match(ACCEPTED_CHARS_REGEX).join("");

    var count = text.length;

    if(text.length >= 3 && text.substring(text.length-3, text.length) == "###") {
        count -= 3;
    }

    $(extra).append("<span class=\"characters-count\">" + count.toString() + "</span>");
};

function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
};

// my changes_________________________-


//make a class for paragraph

function get_script(){
var current_time = time_bar.getElementsByClassName("timecode text--noselect")[0];
updateCaption(current_time.innerText); 
}





function update_subtitle(){
    var current_time = time_bar.getElementsByClassName("timecode text--noselect")[0];
    get_index_of_paragraph(current_time.innerText);  


        
 

    // function receives a time frame as string ("HH:MM:SS") , and returns a 
    // paragraph object
    function get_index_of_paragraph(timestr){
        
        var timeint = timestr2int(timestr);
        var paragraphs =  getParagraphs();
        var parag = new Paragraph(paragraphs[0]);
        var stime = parag.start_time();
        var etime = parag.end_time();
        var text = parag.as_text();
        debugger;


        



    // convert time in string format ("HH:MM:SS") to seconds as int (65)
    function timestr2int(timestr){
        var segments = timestr.split(":");
        var weight = 3600;
        var result = 0;
        for (segment of segments) {
            result += parseInt(segment)*weight;
            weight /= 60;
        } 
        return result;
    };
    };

    function updateCaption(val){  
        caption.textContent = val;
        };
};



// Paragraphs class
class Paragraph {
    constructor(parag_element, eol="###") {
      this.parag_element = parag_element;
      this.eol = eol;
      this.nextParagraph = false;
    }

    end_time(){
        if (!this.nextParagraph){
            this.as_text(); //to update nextParag var 
        }   
        this._end_time = this.nextParagraph.getElementsByClassName("exchange--timestamp-value").item(0).innerText;
        return this._end_time;
    }

    as_text(){
        return this._extract_text(this.parag_element);
    }

    start_time(){
        this._start_time = this.parag_element.getElementsByClassName("exchange--timestamp-value").item(0).innerText;
        return this._start_time;
    }

  
    _extract_text(parag_element){
        this.nextParagraph = parag_element.nextSibling;
        var content = parag_element.getElementsByClassName("exchange--content");
        text = $(content).text();
        if (!this._is_complete(text)){
            return text.replace(this.eol, "").concat(" ").concat(this._extract_text(parag_element.nextSibling));
        }
         
        return text;
    }
    
    _is_complete(text){
        return !(text.length >= this.eol.length && text.substring(text.length-this.eol.length, text.length) == this.eol);
      }  
}


