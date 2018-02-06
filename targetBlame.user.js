// ==UserScript==
// @name         !!/blame your target
// @version      1.0
// @description  Generate targeted "!!/blame" command
// @author       iBug
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/targetBlame.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/targetBlame.user.js
// @match        https://chat.stackexchange.com/rooms/11540/charcoal-hq
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Support

  const makeElement = function(type, classes = [], text = "") {
    const elm = document.createElement(type);
    if (classes.constructor === Array) {
      for (let i = 0; i < classes.length; i++) {
        elm.classList.add(classes[i]);
      }
    } else {
      elm.className = classes;
    }
    if (text) {
      elm.textContent = text;
    }
    return elm;
  };

  const makeText = function(text){
    return document.createTextNode(text);
  };

  const makeButton = function(text, classes, click, type) {
    const elm = makeElement(type || "button", classes, text);
    if (text && typeof text === "function") {
      elm.textContent = text();
      elm.onclick = evt => {
        click(evt);
        elm.textContent = text();
      };
    } else {
      elm.onclick = click;
    }
    return elm;
  };

  const makeInput = function(id, classes) {
    const elm = makeElement("input", classes, "");
    elm.setAttribute("id", id);
    return elm;
  };

  // UI

  const uiIssueBlame = function(){
    blameIssue(Number(inputBox.value));
  };

  const insertRef = document.getElementById("footer-legal");
  var insertData;

  insertRef.insertBefore(makeText(" | "), insertRef.firstChild);

  insertData = makeButton("blame", [], uiIssueBlame, "a");
  insertData.href = "#";
  insertData.addEventListener("click", e => e.preventDefault());
  insertRef.insertBefore(insertData, insertRef.firstChild);

  insertRef.insertBefore(makeText(" "), insertRef.firstChild);

  insertData = makeInput("blame-id", "");
  insertData.setAttribute("style", "width: 60px;");
  insertRef.insertBefore(insertData, insertRef.firstChild);
  const inputBox = document.getElementById("blame-id");
  inputBox.value = "120914";

  // Core functionality

  const blameEncodeString = function(id){
    var map = ["\u180E", "\u200B", "\u200C", "\u200D", "\u2060", "\u2063", "\uFEFF"];
    var s = "";
    for (; id > 0; id = Math.floor(id/7)){
      s = map[id % 7] + s;
    }
    return s;
  };

  const blameCreateCommand = function(id){
    return "!!/blame\u180E " + blameEncodeString(id);
  };

  const blameWriteCommand = function(id){
    document.getElementById("input").value = blameCreateCommand(id);
  };

  const blameIssue = function(id){
    var savedText = document.getElementById("input").value;
    blameWriteCommand(id);
    document.getElementById("sayit-button").click();
    document.getElementById("input").value = savedText;
  };

})();
