// ==UserScript==
// @name         iBug's review shortcut keys
// @version      1.0.1
// @description  Use [/] to open post in new tab and [\] to skip
// @author       iBug
// @match        https://stackoverflow.com/review/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/reviewShortcut.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/reviewShortcut.user.js
// @run-at       document-end
// ==/UserScript==

(function(frame) {
  'use strict';

  /*
  const getPostLink = function(){
    var review_content = frame.querySelectorAll('div.review-content')[0];
    var review_items = review_content.querySelectorAll('div');
    var sidebar = review_items[0].querySelector('div.sidebar');
    var postlink = sidebar.querySelector('a[target="_blank"]');
    return postlink;
  };
  */

  const getPostLink = function(){
	return frame.querySelector('div.review-content div div.sidebar a[target="_blank"]');
  }
  
  const getSkipButton = function(){
    return frame.querySelector('input[value="Skip"]');
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
  
  frame.addEventListener('keyup', iBugKeyUpListener, false);
})(document);
