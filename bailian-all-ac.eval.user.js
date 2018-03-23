// ==UserScript==
// @name         Bailian All AC (Evaluation copy)
// @version      0.1 beta
// @description  Just show everything as Accepted on OpenJudge Bailian :)
// @author       iBug
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/bailian-all-ac.eval.user.js
// @match        http://bailian.openjudge.cn/practice/solution/*
// @grant        none
// ==/UserScript==

(function(frame) {
    'use strict';

    const clog = function(s) {
        console.log("[iBug.All-AC.eval] " + s);
    };

    // Globals
    var thisUser = "iBug";

    // Utilities
    var url = window.location.href;
    var randSeed = 0;

    const randInt = function(a, b) {
        return Math.floor(Math.random() * (b-a)) + a;
    };

    // Initialize stuff
    var mainSection = frame.getElementById("main");
    if (mainSection == undefined) {
        // It's a typo, who knows...
        mainSection = frame.getElementById("main\"");
    }

    // Try to identify current user from toolbar
    var userToolbar = frame.getElementById("userToolbar");
    {
        let items = userToolbar.getElementsByTagName("a");
        let userLink;
        for (let i = 0; i < items.length; i++) {
            if (items[i].innerText == "Messages" || items[i].innerText == "信箱") {
                userLink = items[i].parentElement.previousElementSibling.firstChild;
                break;
            }
        }
        if (userLink != undefined) {
            thisUser = userLink.innerText;
            clog("Identified user: " + thisUser);
        } else {
            clog("User not found. Are you logged in?");
            clog("Not logged in. Stop.");
        }
    }

    // Change result to AC
    var res = frame.querySelectorAll('p[class="compile-status"]')[0].querySelectorAll('a')[0];
    res.href = res.href.replace(/\/*#.*$/, "");
    res.text = "Accepted";

    // Remove Compiler error information if exist
    res = frame.querySelectorAll('h3[class="h3-compile-status"]')[0];
    if (res != undefined) {
        let t = res;
        res = t.nextElementSibling;  // The <pre> block
        t.remove();
        res.remove();
        res = frame.querySelectorAll('a[name="compile-error"]')[0];
        if (res != undefined) {
            res.remove();
        }
    }

    // Insert running information if they're missing
    res = frame.querySelectorAll('div[class="compile-info"]')[0];
    var fakeTime = randInt(1000,10000), fakeMem = randInt(1000,2000);
    {
        let entries = res.querySelectorAll('dt');
        let found;
        for (let i = 0; i < entries.length; i++){
            if (entries[i].innerText == "提交人:") {
                found = entries[i];
                break;
            }
        }
        if (found != undefined) {
            let target = found.nextElementSibling.nextElementSibling, elm;
            if (target != undefined && target.innerText == "语言:") {
                elm = frame.createElement("dt");
                elm.innerText = "内存:";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dd");
                elm.innerText = String(fakeMem) + "kB";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dt");
                elm.innerText = "时间:";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dd");
                elm.innerText = String(fakeTime) + "ms";
                target.parentElement.insertBefore(elm, target);
            }
        }
    }

    // Process "recent submits" section
    var submits = mainSection.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (let i = 0; i < submits.length; i++) {
        let submit = submits[i];
        let items = submit.getElementsByTagName("td");
        if (submit.querySelectorAll('td[class="submit-user"]')[0].getElementsByTagName("a")[0].innerText == thisUser) {
            let res;
            // Change result
            res = submit.querySelectorAll('td[class="result"]')[0].getElementsByTagName("a")[0];
            res.href = res.href.replace(/\/*#.*$/, "");
            res.innerText = "Accepted";
            // Change Mem
            res = submit.querySelectorAll('td[class="memory"]')[0];
            if (res.innerText === "")
                res.innerText = String(fakeMem) + "kB";
            // Change Time
            res = submit.querySelectorAll('td[class="spending-time"]')[0];
            if (res.innerText === "")
                res.innerText = String(fakeTime) + "ms";
            // For now only process the first one
            break;
        }
    }
})(document);
