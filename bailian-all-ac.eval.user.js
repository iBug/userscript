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

    // Constants
    const thisUser = "iBug";

    // Utilities
    const randInt = function(a, b) {
        var rnd = Math.random();
        return Math.floor(rnd * (b-a)) + a;
    };

    // Initialize stuff
    var mainSection = frame.getElementById("main");
    if (mainSection == undefined) {
        // It's a typo, who knows...
        mainSection = frame.getElementById("main\"");
    }
    randSeed = strHash(url);

    // Change result to AC
    var res = frame.querySelectorAll('p[class="compile-status"]')[0].querySelectorAll('a')[0];
    res.text = "Accepted";

    // Remove Compiler error information
    res = frame.querySelectorAll('h3[class="h3-compile-status"]')[0];
    if (res != undefined) {
        var t = res;
        res = t.nextElementSibling;  // The <pre> block
        t.remove();
        res.remove();
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
                elm.innerText = String(fakeTime) + "kB";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dt");
                elm.innerText = "时间:";
                target.parentElement.insertBefore(elm, target);
                elm = frame.createElement("dd");
                elm.innerText = String(fakeMem) + "ms";
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