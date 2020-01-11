window.addEventListener("load", function() {
    addCounts();
});

window.addEventListener("keyup", function() {
    addCounts();
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
    $(extra).append("<span class=\"characters-count\">" + count.toString() + "</span>");
};

function getParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker");
    return paragraphs;
};
