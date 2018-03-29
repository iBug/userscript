// ==UserScript==
// @name         All AC
// @version      0.1
// @description  Just show everything as Accepted :)
// @author       iBug
// @updateURL    https://raw.githubusercontent.com/iBug/userscript/master/bailian-all-ac.meta.js
// @downloadURL  https://raw.githubusercontent.com/iBug/userscript/master/bailian-all-ac.user.js
// @match        http://bailian.openjudge.cn/practice/solution/*
// @match        http://bailian.openjudge.cn/mine*
// @grant        none
// ==/UserScript==

(function(document, window) {
    'use strict';

    // System
    const clog = (s) => console.log("[iBug.All-AC] " + s);
    const export_api = (name, obj) => window[name] = obj;
    export_api("all_ac", "iBug.All-AC");

    // Utilities
    var url = window.location.href;
    var randSeed = 0;

    const randInt = function(a, b) {
        randSeed = ((randSeed * 214013) + 2531011) & 0xFFFFFFFF;
        let rnd = (randSeed >>> 16) / 65536.0;
        return Math.floor(rnd * (b-a)) + a;
    };

    // Globals
    var thisUser = "iBug";
    const toMockObject = function(id) {
        // May be useful later
        return {"id": id};
    };
    const store = {
        data: {},
        getMocks: function() {
            this.load();
            if (this.data.mocks == undefined) {
                this.data.mocks = {};
            }
            return this.data.mocks;
        },
        addMock: function(mockObj) {
            if (!this.isMock(mockObj)) {
                this.data.mocks[mockObj.id] = true;
                this.save();
            }
        },
        removeMock: function(mockObj) {
            if (this.isMock(mockObj)) {
                delete this.data.mocks[mockObj.id];
            }
        },
        isMock: function(mockObj) {
            clog("Testing if " + String(mockObj.id) + " is mocked");
            return mockObj.id in this.data.mocks;
        },
        save: function() {
            clog("Saving local storage");
            if (this.data === null || this.data === undefined) {
                this.data = {mocks: {}};
            }
            localStorage.setItem("all_ac", JSON.stringify(this.data));
        },
        load: function() {
            clog("Loading local storage");
            this.data = JSON.parse(localStorage.getItem("all_ac"));
            if (this.data === null) {
                this.data = {};
                this.save();
            }
        },
        toString: ()=>"iBug.All-AC.localStorageObject"
    };
    export_api("ac_store", store);

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
        clog("Running on settings page");

        // Create the extra menu
        store.load();
        let form = document.querySelectorAll('dl[class="form"]')[0];
        var mock_title = document.createElement("dt"), mock_body = document.createElement("dd");
        mock_title.innerText = "Mock";
        form.appendChild(mock_title);
        form.appendChild(mock_body);
        var infoTable = document.createElement("dl");
        mock_body.appendChild(infoTable);
        var mockList_title = document.createElement("dt"), mockList = document.createElement("dd");
        mockList_title.innerText = "Mocked submits:";
        mockList_title.style = "width: 10em";
        mockList.innerText = "[ ";
        let localMockList = store.getMocks();
        for (let id in localMockList) {
            if (localMockList.hasOwnProperty(id)) {
                mockList.innerText += String(id) + " ";
            }
        }
        mockList.innerText += "]";
        infoTable.appendChild(mockList_title);
        infoTable.appendChild(mockList);
    };

    const submissionPage = function(document) {
        clog("Running on submission page");

        // Initialize stuff
        var mainSection = document.getElementById("main");
        if (mainSection == undefined) {
            // It's a typo, who knows...
            mainSection = document.getElementById("main\"");
        }
        var submissionID = Number(/solution\/(\d*)/g.exec(url)[1]);
        clog("Extracted submission ID: " + String(submissionID));
        randSeed = submissionID;

        var fakeTime, fakeMem, submissionTime, memText, timeText,
            sidebarTitle, sidebarMem, sidebarTime, recentsMem, recentsTime;

        var ojResult = document.querySelectorAll('p[class="compile-status"]')[0].querySelectorAll('a')[0],
            compileStatus = document.querySelectorAll('h3[class="h3-compile-status"]')[0],
            runInfo = document.querySelectorAll('div[class="compile-info"]')[0],
            submits = mainSection.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        sidebarTitle = runInfo.firstElementChild;
        // Change result to AC
        const mock = function() {
            if (ojResult != undefined) {
                clog("Detected original result: " + ojResult.text);
                ojResult.className = "result-right";
                ojResult.href = ojResult.href.replace(/\/*#.*$/, "");
                ojResult.text = "Accepted";
            }

            // Remove Compiler error information if exist
            if (compileStatus != undefined) {
                clog("Detected compiler message, removing...");
                let compilerOutput = compileStatus.nextElementSibling;  // The <pre> block
                if (compilerOutput != undefined) {
                    compilerOutput.remove();
                }
                compileStatus.remove();
                compileStatus = document.querySelectorAll('a[name="compile-error"]')[0];
                if (compileStatus != undefined) {
                    compileStatus.remove();
                }
            }

            // Insert running information if they're missing
            fakeTime = randInt(100,2000);
            fakeMem = randInt(1000,10000);
            memText = String(fakeMem) + "kB";
            timeText = String(fakeTime) + "ms";
            {
                let entries = runInfo.querySelectorAll('dt'),
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
        };

        if (store.isMock(toMockObject(submissionID))) {
            mock();
        } else {
            sidebarTitle.onclick = function() {
                store.addMock(toMockObject(submissionID));
                mock();
            };
        }
    };

    store.load();
    if (url.startsWith("http://bailian.openjudge.cn/practice/solution/")) {
        submissionPage(document);
    } else if (url.startsWith("http://bailian.openjudge.cn/mine")) {
        minePage(document);
    } else {
        clog("Unknown page URL, exiting...");
        return;
    }
})(document, window);
