// ==UserScript==
// @name         Earthquake, TaoKY!
// @namespace    https://ibugone.com/
// @version      0.1
// @description  Make the strongest blog even stronger!
// @author       iBug
// @match        *://blog.taoky.moe*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName("body")[0].className += " shake-crazy shake-constant";

    var s = document.createElement('link');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('type', 'text/css');
    s.setAttribute('href', 'https://elrumordelaluz.github.io/csshake/csshake.css');
    document.getElementsByTagName('head')[0].appendChild(s);
})();
