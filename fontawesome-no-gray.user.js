// ==UserScript==
// @name         Font Awesome No Gray
// @namespace    https://github.com/iBug
// @version      0.1
// @description  Show all icons in solid colors!
// @author       iBug
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/fontawesome-no-gray.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/fontawesome-no-gray.user.js
// @match        https://fontawesome.com/icons*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const updateClasses = function(mutationsList, observer) {
        var elementList = document.querySelectorAll("#results-icons a.gray4");
        console.log("Running on " + elementList.length + " icons");
        for (let i of elementList) {
            i.classList.remove("gray4");
            i.classList.add("gray7");
        }
    }

    const observer = new MutationObserver(updateClasses);

    const waitForTarget = function() {
        var target = document.getElementById("results-icons");
        if (!target) {
            setTimeout(waitForTarget, 100);
            return;
        }
        target = target.firstChild;
        if (!target) {
            setTimeout(waitForTarget, 100);
            return;
        }
        console.log("Watching " + target);
        observer.observe(target, {childList: true});
        updateClasses();
    }

    waitForTarget();
})();
