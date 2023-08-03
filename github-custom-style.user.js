// ==UserScript==
// @name             GitHub Custom Style
// @description      My Custom Styles for GitHub
// @author           iBug
// @namespace        https://github.com/iBug/userscript
// @version          1.0.1
// @updateURL        https://raw.githubusercontent.com/iBug/userscript/master/github-custom-style.user.js
// @downloadURL      https://raw.githubusercontent.com/iBug/userscript/master/github-custom-style.user.js
// @match            *://github.com/*
// @match            *://*.github.com/*
// @run-at           document-start
// @grant            none
// ==/UserScript==

// SEMI-IMPORTANT: If you wish to avoid flickering on pageload, this script must run before the page content loads
// If using Tampermonkey, you may need to enable instant script injection via:
// Settings -> Experimental -> Inject Mode -> Instant

'use strict';

let e = document.createElement("link");
e.rel = "stylesheet";
e.href = "https://cdn.jsdelivr.net/npm/amazon-fonts@1.0.1/fonts/stylesheet.min.css";
(document.head || document.documentElement).appendChild(e);

(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = `
body {
  --ff-sans: Amazon Ember,Microsoft YaHei UI,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji !important;
  --ff-mono: Amazon Ember Mono,Consolas,Roboto Mono,monospace !important;
}

body, .markdown-body {
  font-family: var(--ff-sans) !important;
}

code, pre, tt, .text-mono,
.blob-num, .blob-code-inner {
  font-family: var(--ff-mono) !important;
}
`;
