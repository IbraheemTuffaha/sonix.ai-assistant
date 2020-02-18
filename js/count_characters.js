var eol = "###";
var counts_always; // UI option to set update mode: continously or on play

//load event handler
function count_onload() {
    addCounts();
};
//keyup event handler
function count_onkeyup() {
    addCounts();
}
//scroll event handler
function count_onscroll() {
    addCounts();
    setTimeout(function () { addCounts() }, 200);
};
//video on play event handler
function count_onplay() {
    addCounts();
    // clear counts if user made changes (typed something) to paragraph since 
    //the counts must be updated
    window.addEventListener("keyup", clearCounts);
};

// this is neeeded for initialization, when the user opens sonix,
// the user-saved options are retrieved
chrome.storage.local.get(['counts_always'], function (result) {
    counts_always = result.counts_always;
    if (counts_always) {
        window.addEventListener("load", count_onload);
        window.addEventListener("keyup", count_onkeyup);
        window.addEventListener('scroll', count_onscroll);
    }
    else{
    vid.addEventListener("play", count_onplay);    
    }
});

// this is needed if user changes the preferences/options while he is editing
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("counts_always" in changes) {
        // if count_always has become true (after being flase), listen for keyup and scroll
        //events
        // and remove onplay event
        if (!changes["counts_always"].oldValue && changes["counts_always"].newValue) {
            window.addEventListener("load", count_onload);
            window.addEventListener("keyup", count_onkeyup);
            window.addEventListener('scroll', count_onscroll);
            vid.removeEventListener("play", count_onplay);
            //remove clearCounts that was used to clear the counts if the user
            //types something
            window.removeEventListener("keyup", clearCounts);
        }
        // if count_always has become flase (after being true), listen onplay event
        //and remove all other event listners
        if (changes["counts_always"].oldValue && !changes["counts_always"].newValue) {
            window.removeEventListener("load", count_onload);
            window.removeEventListener("keyup", count_onkeyup);
            window.removeEventListener("scroll", count_onscroll);
            vid.addEventListener("play", count_onplay);
            window.addEventListener("keyup", clearCounts);         
        }
    }

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

// clear counts, used for deleteing out dated counts which are no longer correct
function clearCounts(event) {
    //if any button is pressed clear counts and remove keyup eventListner.
    //except when Tab (play) button is pressed
    if (event.keyCode !== 9) {
        $(".characters-count").remove();
        window.removeEventListener("keyup", clearCounts);
    }
}