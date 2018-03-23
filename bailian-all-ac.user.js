// ==UserScript==
// @name         All AC
// @version      0.1
// @description  Just show everything as Accepted :)
// @author       iBug
// @match        http://bailian.openjudge.cn/practice/solution/*
// @grant        none
// ==/UserScript==

((frame) => {
    'use strict';

    const clog = (s) => console.log("[iBug.All-AC] " + s);

    // Globals
    var thisUser = "iBug";

    // Utilities
    var url = window.location.href;
    var randSeed = Number(/solution\/(\d*)/g.exec(url)[1]);
    clog("Extracted submission ID: " + String(randSeed));

    const randInt = function(a, b) {
        randSeed = ((randSeed * 214013) + 2531011) & 0xFFFFFFFF;
        let rnd = (randSeed >>> 16) / 65536.0;
        return Math.floor(rnd * (b-a)) + a;
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
            clog("Detected user: " + thisUser);
        } else {
            clog("User not found. Are you logged in?");
            clog("Not logged in. Stop.");
            return;
        }
    }

    // Change result to AC
    var res = frame.querySelectorAll('p[class="compile-status"]')[0].querySelectorAll('a')[0];
    if (res != undefined) {
        clog("Detected original result: " + res.text);
        res.className = "result-right";
        res.href = res.href.replace(/\/*#.*$/, "");
        res.text = "Accepted";
    }

    // Remove Compiler error information if exist
    res = frame.querySelectorAll('h3[class="h3-compile-status"]')[0];
    if (res != undefined) {
        clog("Detected compiler message, removing...");
        res.nextElementSibling.remove();  // The <pre> block
        res.remove();
        res = frame.querySelectorAll('a[name="compile-error"]')[0];
        if (res != undefined) {
            res.remove();
        }
    }

    // Insert running information if they're missing
    res = frame.querySelectorAll('div[class="compile-info"]')[0];
    var fakeTime = randInt(100,2000), fakeMem = randInt(1000,10000), submissionTime,
        memText = String(fakeMem) + "kB", timeText = String(fakeTime) + "ms";
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
                clog("Detected missing mem info and time info.");
                clog("Filling with mem=" + memText + " and time=" + timeText);
                elm = frame.createElement("dt");
                elm.innerText = "内存:";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dd");
                elm.innerText = memText;
                target.parentElement.insertBefore(elm, target);

                elm = frame.createElement("dt");
                elm.innerText = "时间:";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dd");
                elm.innerText = timeText;
                target.parentElement.insertBefore(elm, target);
            }
        }

        // Obtain submission time
        found = undefined;
        for (let i = 0; i < entries.length; i++){
            if (entries[i].innerText == "提交时间:") {
                found = entries[i];
                break;
            }
        }
        if (found != undefined) {
            submissionTime = found.nextElementSibling.innerText;
            clog("Detected submission time: " + submissionTime);
        }
    }

    // Process "recent submits" section
    var submits = mainSection.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (let i = 0; i < submits.length; i++) {
        let submit = submits[i];
        let items = submit.getElementsByTagName("td");
        if (submit.querySelectorAll('td[class="submit-user"]')[0].getElementsByTagName("a")[0].innerText == thisUser &&
            submit.querySelectorAll('td[class="date"]')[0].getElementsByTagName("abbr")[0].title == submissionTime) {
            let res;
            // Change result
            res = submit.querySelectorAll('td[class="result"]')[0].getElementsByTagName("a")[0];
            res.className  = "result-right";
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
        }
    }
})(document);