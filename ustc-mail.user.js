// ==UserScript==
// @name             USTC Mail Custom Style
// @description      My Custom Styles for USTC Mail
// @author           iBug
// @namespace        https://github.com/iBug/userscript
// @updateURL        https://raw.githubusercontent.com/iBug/userscript/master/ustc-mail.meta.js
// @downloadURL      https://raw.githubusercontent.com/iBug/userscript/master/ustc-mail.user.js
// @version          1.0.0
// @match            *://mail.ustc.edu.cn/*
// @run-at           document-start
// @grant            none
// ==/UserScript==

// SEMI-IMPORTANT: If you wish to avoid flickering on pageload, this script must run before the page content loads
// If using Tampermonkey, you may need to enable instant script injection via:
// Settings -> Experimental -> Inject Mode -> Instant

'use strict';

(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = `
.watermark-wrap {
  display: none;
  opacity: 0;
}
`;

