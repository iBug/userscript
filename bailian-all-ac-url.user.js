// ==UserScript==
// @name         All AC (URL hide)
// @version      0.1
// @description  Just show everything as Accepted :)
// @run-at       document-start
// @author       iBug
// @match        http://bailian.openjudge.cn/practice/solution/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var newUrl = url.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/*$/, "");
    if (newUrl != url) {
        window.location.href = newUrl;
    }
})();
