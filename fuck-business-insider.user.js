// ==UserScript==
// @name         No ad blocker detector on Business Insider
// @version      0.1
// @description  Get rid of Business Insider's ad blocker prompt
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/fuck-business-insider.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/fuck-business-insider.user.js
// @author       iBug
// @match        *://www.businessinsider.com/*
// @grant        none
// ==/UserScript==

(function(window, document) {
    'use strict';

    var thisInterval;
    var tasksRemaining = 3;

    const removeOverlay = function() {
        if (document.body.classList.contains("tp-modal-open")) {
            document.body.classList.remove("tp-modal-open");
            tasksRemaining--;
        }
        var popup = document.querySelector(".tp-modal");
        if (popup !== null) {
            popup.remove();
            tasksRemaining--;
        }
        var overlay = document.querySelector(".tp-backdrop.tp-active");
        if (overlay !== null) {
            overlay.remove();
            tasksRemaining--;
        }
        if (tasksRemaining === 0) {
            window.clearInterval(thisInterval);
        }
    };

    thisInterval = window.setInterval(removeOverlay, 500);
})(window, document);
