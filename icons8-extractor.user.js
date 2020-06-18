// ==UserScript==
// @name         Icons8 Extractor
// @version      0.0.1
// @description  Get SVG from Icons8 webpage with one click!
// @author       iBug
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/icons8-extractor.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/icons8-extractor.user.js
// @include      https://icons8.com/icon/*
// @grant        none
// ==/UserScript==

(function (document) {
  var myDiv = document.createElement('div');
  myDiv.innerHTML = '<button id="myButton" type="button">Download</button>';
  myDiv.setAttribute('id', 'myDiv');
  myDiv.setAttribute('style', 'position: fixed; left: 160px; top: 10px; z-index: 100;');
  document.body.appendChild(myDiv);

  document.getElementById("myButton").addEventListener("click", ButtonClickAction, false);

  function ButtonClickAction(zEvent) {
    var svg = document.querySelector('.content .icon .app-icon svg');
    svg.removeAttribute("x");
    svg.removeAttribute("y");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.removeAttribute("id");

    var title = document.querySelector('.is-exact-active')
    if (title) {
      title = title.getAttribute("href");
    } else {
      title = document.baseURI;
    }
    title = title.substr(title.lastIndexOf('/') + 1) + ".svg";

    //var data = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + svg.outerHTML;
    var data = svg.outerHTML;
    var link = document.createElement("a");
    link.download = title;
    link.href = "data:application/octet-stream;base64," + btoa(data);
    link.innerHTML = title;
    myDiv.appendChild(link);
    link.click();
    myDiv.removeChild(link);
  }
})(document);
