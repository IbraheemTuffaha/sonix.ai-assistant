var eol = "###"

var vid = document.getElementById("vjs_video_3_html5_api");

vid.addEventListener("play", function () {
    addCounts();
    window.addEventListener("keyup", clearCounts);
});

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