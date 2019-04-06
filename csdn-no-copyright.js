// ==UserScript==
// @name         No CSDN copyright info!
// @namespace    https://github.com/iBug
// @version      0.1
// @description  Prevents CSDN from appending copyright information when copying code from blogs
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/csdn-no-copyright.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/csdn-no-copyright.js
// @author       iBug
// @match        *://blog.csdn.net/*
// @grant        none
// ==/UserScript==

(function(window) {
    'use strict';

    if (window.csdn && window.csdn.copyright) {
        window.csdn.copyright.textData = null;
    }
})(window);
