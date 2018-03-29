// ==UserScript==
// @name         All AC
// @version      0.1
// @description  Just show everything as Accepted :)
// @author       iBug
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/bailian-all-ac.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/bailian-all-ac.user.js
// @match        http://bailian.openjudge.cn/practice/solution/*
// @match        http://bailian.openjudge.cn/mine
// @grant        none
// ==/UserScript==

(function(document, window) {
    'use strict';

    const clog = (s) => console.log("[iBug.All-AC] " + s);

    // Globals
    var thisUser = "iBug";
    const store = {
        data: {},
        save: function() {
            if (this.data === null || this.data === undefined) {
                this.data = {};
                window.localStorage.setItem("all-ac", JSON.stringify(this.data));
            }
        },
        load: function() {
            this.data = JSON.parse(window.localStorage.getItem("all-ac"));
            if (this.data === null) {
                this.data = {};
                this.save();
            }
        },
        toString: ()=>"iBug.All-AC.localStorageObject"
    };

    // Utilities
    var url = window.location.href;
    var randSeed = 0;

    const randInt = function(a, b) {
        randSeed = ((randSeed * 214013) + 2531011) & 0xFFFFFFFF;
        let rnd = (randSeed >>> 16) / 65536.0;
        return Math.floor(rnd * (b-a)) + a;
    };

    // Try to identify current user from toolbar
    var userToolbar = document.getElementById("userToolbar");
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

    const minePage = function(document) {
        let form = document.querySelectorAll('dl[class="form"]');
    };

    const submissionPage = function(document) {
        clog("Running on submission page");

        // Initialize stuff
        var mainSection = document.getElementById("main");
        if (mainSection == undefined) {
            // It's a typo, who knows...
            mainSection = document.getElementById("main\"");
        }
        randSeed = Number(/solution\/(\d*)/g.exec(url)[1]);
        clog("Extracted submission ID: " + String(randSeed));

        // Change result to AC
        var res = document.querySelectorAll('p[class="compile-status"]')[0].querySelectorAll('a')[0];
        if (res != undefined) {
            clog("Detected original result: " + res.text);
            res.className = "result-right";
            res.href = res.href.replace(/\/*#.*$/, "");
            res.text = "Accepted";
        }

        // Remove Compiler error information if exist
        res = document.querySelectorAll('h3[class="h3-compile-status"]')[0];
        if (res != undefined) {
            clog("Detected compiler message, removing...");
            res.nextElementSibling.remove();  // The <pre> block
            res.remove();
            res = document.querySelectorAll('a[name="compile-error"]')[0];
            if (res != undefined) {
                res.remove();
            }
        }

        // Insert running information if they're missing
        res = document.querySelectorAll('div[class="compile-info"]')[0];
        var fakeTime = randInt(100,2000), fakeMem = randInt(1000,10000), submissionTime,
            memText = String(fakeMem) + "kB", timeText = String(fakeTime) + "ms",
            sidebarTitle = res.firstElementChild, sidebarMem, sidebarTime, recentsMem, recentsTime;
        {
            let entries = res.querySelectorAll('dt'),
                found;
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
                    elm = document.createElement("dt");
                    elm.innerText = "内存:";
                    target.parentElement.insertBefore(elm, target);
                    elm = document.createElement("dd");
                    elm.innerText = memText;
                    target.parentElement.insertBefore(elm, target);
                    sidebarMem = elm;

                    elm = document.createElement("dt");
                    elm.innerText = "时间:";
                    target.parentElement.insertBefore(elm, target);
                    elm = document.createElement("dd");
                    elm.innerText = timeText;
                    target.parentElement.insertBefore(elm, target);
                    sidebarTime = elm;
                } else if (target != undefined && target.innerText == "内存:") {
                    let memDT = target,
                        memDD = memDT.nextElementSibling;
                    let timeDT = memDT.nextElementSibling.nextElementSibling,
                        timeDD = timeDT.nextElementSibling;
                    sidebarMem = memDD;
                    sidebarTime = timeDD;
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
                recentsMem = submit.querySelectorAll('td[class="memory"]')[0];
                if (recentsMem.innerText === "")
                    recentsMem.innerText = String(fakeMem) + "kB";
                // Change Time
                recentsTime = submit.querySelectorAll('td[class="spending-time"]')[0];
                if (recentsTime.innerText === "")
                    recentsTime.innerText = String(fakeTime) + "ms";
            }
        }

        sidebarTitle.onclick = () => {
            if (sidebarMem != undefined) {
                sidebarMem.innerText = memText;
            }
            if (sidebarTime != undefined) {
                sidebarTime.innerText = timeText;
            }
            if (recentsMem != undefined) {
                recentsMem.innerText = memText;
            }
            if (recentsTime != undefined) {
                recentsTime.innerText = timeText;
            }
        };
    };

    if (url.startsWith("http://bailian.openjudge.cn/practice/solution/") || url.startsWith("https://bailian.openjudge.cn/practice/solution/")) {
        submissionPage(document);
    } else {
        clog("Unknown page URL, exiting...");
        return;
    }
})(document, window);
