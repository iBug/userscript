// ==UserScript==
// @name         iBug's review shortcut keys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use [/] to open post in new tab and [\] to skip
// @author       iBug
// @match        https://stackoverflow.com/review/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/reviewShortcut.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/reviewShortcut.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const getPostLink = function(){
    var review_content = document.querySelector('div[class="review-content"]');
    var review_items = review_content.querySelectorAll('div');
    var sidebar = review_items[0].querySelector('div[class="sidebar"]');
    var postlink = sidebar.querySelector('a[target="_blank"');
    return postlink;
  };
  
  const getSkipButton = function(){
    var skipButton = document.querySelector('input[value="Skip"]');
    return skipButton;
  }
  
  const iBugKeyUpListener = function(e){
    switch(e.keyCode){
      case 191: // Slash
        getPostLink().click();
        break;
      case 220: // Backslash
        getSkipButton().click();
        break;
      default:
        break;
    }
  };
  
  document.addEventListener('keyup', iBugKeyUpListener, false);
})();
