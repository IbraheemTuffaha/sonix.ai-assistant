var eol = "###";

window.addEventListener("load", function () {
    addCounts();
});

window.addEventListener("keyup", function () {
    addCounts();
});

window.addEventListener('scroll', function () {
    addCounts();
    setTimeout(function () { addCounts(); }, 200);
});

function addCounts() {
    $(".characters-count").remove();
    var paragraphs = getCharCountParagraphs();
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

function getCharCountParagraphs() {
    var paragraphs = document.getElementsByClassName("exchange--speaker"),
        paragraphsArray = [].slice.call(paragraphs),
        paragraphsOnShow = paragraphsArray.filter(isVisible);
    return paragraphsOnShow;
}

function isVisible(elm) {
    var vpH = $(window).height(), // Viewport Height
        st = $(window).scrollTop(), // Scroll Top
        y = $(elm).offset().top,
        elementHeight = $(elm).height();

    return (y > st) && ( (y < (vpH + st)) || (y + elementHeight < st + vpH) );
}

// check if paragraph is complete (no splitting)
function is_complete(text) {
    return !(text.length >= eol.length && text.substring(text.length - eol.length, text.length) == eol);
}