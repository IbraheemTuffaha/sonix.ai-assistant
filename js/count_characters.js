var counts_always;

function count_onload() {
    addCounts();
};

function count_onkeyup() {
    addCounts();
}

function count_onscroll() {
    addCounts();
    setTimeout(function () { addCounts() }, 200);
};

function count_onplay() {
    addCounts();
    window.addEventListener("keyup", clearCounts);
};


chrome.storage.local.get(['counts_always'], function (result) {
    counts_always = result.counts_always;
    if (counts_always) {
        window.addEventListener("load", count_onload);
        window.addEventListener("keyup", count_onkeyup);
        window.addEventListener('scroll', count_onscroll);
    }
});


chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("counts_always" in changes) {
        if (!changes["counts_always"].oldValue && changes["counts_always"].newValue) {
            window.addEventListener("load", count_onload);
            window.addEventListener("keyup", count_onkeyup);
            window.addEventListener('scroll', count_onscroll);
            vid.removeEventListener("play", count_onplay);
            window.removeEventListener("keyup", clearCounts);
        }
        if (changes["counts_always"].oldValue && !changes["counts_always"].newValue) {
            window.removeEventListener("load", count_onload);
            window.removeEventListener("keyup", count_onkeyup);
            window.removeEventListener("scroll", count_onscroll);
            vid.addEventListener("play", count_onplay);
            window.addEventListener("keyup", clearCounts);         
        }
    }

});



var eol = "###"

var vid = document.getElementById("vjs_video_3_html5_api");

vid.addEventListener("play", count_onplay);

function addCounts() {
    $(".characters-count").remove();
    var paragraphs = getParagraphs();
    for (var i = 0; i < paragraphs.length; ++i) {
        addCount(paragraphs[i]);
    }
};

function addCount(obj) {
    content = obj.getElementsByClassName("exchange--content");
    extra = obj.getElementsByClassName("exchange--extra");

    var text = $(content).text();


    text = text.match(ACCEPTED_CHARS_REGEX).join("");

    var count = text.length;

    if (!is_complete(text)) {
        count -= eol.length;
    }

    $(extra).append("<span class=\"characters-count\">" + count.toString() + "</span>");
};

function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
}
// check if paragraph is complete (no splitting)
function is_complete(text) {
    return !(text.length >= eol.length && text.substring(text.length - eol.length, text.length) == eol);
}

function clearCounts(event) {
    //if any button is pressed clear counts and remove keyup eventListner.
    //except when Tab (play) button is pressed
    if (event.keyCode !== 9) {
        $(".characters-count").remove();
        window.removeEventListener("keyup", clearCounts);
    }
}