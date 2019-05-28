// ==UserScript==
// @name        Solution aux Âmes en Peine
// @namespace   https://github.com/iBug/
// @description Adds a shortcut to down-/close-/delete vote and post a welcoming comment to Lost Souls on Meta Stack Exchange.
// @author      Glorfindel
// @contributor iBug
// @updateURL   https://raw.githubusercontent.com/iBug/userscript/master/stack-exchange/blatantly-ot.user.js
// @downloadURL https://raw.githubusercontent.com/iBug/userscript/master/stack-exchange/blatantly-ot.user.js
// @version     0.4.3
// @match       *://meta.stackexchange.com/questions/*
// @match       *://meta.stackoverflow.com/questions/*
// @match       *://softwarerecs.stackexchange.com/questions/*
// @match       *://softwarerecs.stackexchange.com/review/first-posts*
// @match       *://hardwarerecs.stackexchange.com/questions/*
// @match       *://hardwarerecs.stackexchange.com/review/first-posts*
// @exclude     *://meta.stackexchange.com/questions/ask
// @exclude     *://meta.stackoverflow.com/questions/ask
// @exclude     *://softwarerecs.stackexchange.com/questions/ask
// @exclude     *://hardwarerecs.stackexchange.com/questions/ask
// @grant       none
// ==/UserScript==

// This is not original work, it's indeed a fork of
//   https://github.com/Glorfindel83/SE-Userscripts/blob/master/saviour-of-lost-souls/saviour-of-lost-souls.user.js

(function ($) {
  "use strict";
  let question = $('#question');

  // Check if author is likely to be a lost soul
  let owner = $('div.post-signature.owner');
  if (owner.length == 0)
    // happens with Community Wiki posts
    return;
  let reputation = owner.find('span.reputation-score')[0].innerText;
  let questionScore = parseInt(question.find('div.js-vote-count').text());
  if (reputation === "1") {
    // Do nothing: 1 rep qualifies for a lost soul
  } else {
    // Child meta sites require some reputation to post a question, so we need other rules:
    let isNewContributor = owner.find('span.js-new-contributor-label').length > 0;
    let hasLowReputation = reputation <= 101; // association bonus
    let negativeQuestionScore = questionScore < 0;
    let numberOfReasons = (isNewContributor ? 1 : 0) + (hasLowReputation ? 1 : 0) + (negativeQuestionScore ? 1 : 0);
    if (numberOfReasons < 2)
      return;
  }

  // My reputation; you need 5 reputation to comment
  let myReputation = parseInt($('a.my-profile div.-rep')[0].innerText.replace(/,/g, ''));
  if (myReputation < 5)
    return;

  let isModerator = $("a.js-mod-inbox-button").length > 0;

  // Add post menu button
  let menu = question.find('div.post-menu');
  menu.append($('<span class="lsep">|</span>'));
  let button = $('<a href="#" title="down-/close-/delete vote and post a welcoming comment">off-topic</a>');
  menu.append(button);
  button.click(function() {
    if (!confirm('Are you sure you want to down-/close-/delete vote and post a welcoming comment?'))
      return;

    // Downvoted?
    let downvoted = question.find('a.vote-down-on').length > 0;

    // Closed?
    let status = $('div.question-status h2 b');
    let statusText = status.length > 0 ? status[0].innerText : '';
    let closed = statusText == 'marked' || statusText == 'put on hold' || statusText == 'closed';

    // Prepare votes/comments
    let postID = parseInt(question.attr('data-questionid'));
    console.log('Lost soul #' + postID);
    let fkey = window.localStorage["se:fkey"].split(",")[0];

    // Is there any comment not by the author?
    let comments = question.find('ul.comments-list');
    var nonOwnerComment = false;
    comments.find('a.comment-user').each(function() {
      if (!$(this).hasClass('owner')) {
        nonOwnerComment = true;
      }
    });
    if (!nonOwnerComment) {
      // Post comment
      let author = owner.find('div.user-details a')[0].innerText;
      let comment = window.location.host === "softwarerecs.stackexchange.com"
      ? ("Hi " + author + ", welcome to [softwarerecs.se]! " +
          "This question does not appear to be about software recommendations, within [the scope defined on meta](https://softwarerecs.meta.stackexchange.com/questions/tagged/scope) and in the [help center](/help/on-topic). " +
          "If you think you can [edit] it to become on-topic, please have a look at the [question quality guidelines](https://softwarerecs.meta.stackexchange.com/q/336/32168).")
      : ("Hi " + author + ", welcome to Meta Stack Exchange! " +
         "This site is for discussions, bug reports, and feature requests *about* the Stack Exchange network of Q&A sites; " +
         "unfortunately, we have to mark this question as \"off-topic\" on this site. " +
         "Please post your question on the [correct site](https://stackexchange.com/sites), " +
         "and check the help center to make sure your question is on-topic for the site you've chosen.");
      $.post({
        url: "https://" + document.location.host + "/posts/" + postID + "/comments",
        data: "fkey=" + fkey + "&comment=" + encodeURIComponent(comment),
        success: function () {
          console.log("Comment posted.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          window.alert("An error occurred, please try again later.");
          console.log("Error: " + textStatus + " " + errorThrown);
        }
      });
    }

    // Upvote all comments containing "welcome to"
    comments.find("li").each(function() {
      if ($(this).find("span.comment-copy")[0].innerText.toLowerCase().indexOf("welcome to") >= 0) {
        // Click the "up" triangle
        let upButtons = $(this).find("a.comment-up");
        if (upButtons.length > 0) {
          upButtons[0].click();
        }
      }
    });

    // You can't flag without 15 rep
    if (myReputation < 15)
      return;

    if (!downvoted && myReputation >= 100) {
      // Downvote
      $.post({
        url: "https://" + document.location.host + "/posts/" + postID + "/vote/3", // 3 = downvote
        data: "fkey=" + fkey,
        success: function () {
          // TODO: set downvote button color
          console.log("Downvote cast.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          window.alert("An error occurred, please try again later.");
          console.log("Error: " + textStatus + " " + errorThrown);
        }
      });
    }

    if (!closed) {
      // Flag/vote to close (doesn't matter for the API call)
      $.post({
        url: "https://" + document.location.host + "/flags/questions/" + postID + "/close/add",
        data: "fkey=" + fkey + "&closeReasonId=OffTopic&closeAsOffTopicReasonId=" + (window.location.host === "softwarerecs.stackexchange.com" ? "1" : "8"),
        success: function () {
          // TODO: update close vote count
          console.log("Close flag/vote cast.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          window.alert("An error occurred, please try again later.");
          console.log("Error: " + textStatus + " " + errorThrown);
        }
      });
    } else if ((myReputation >= 20000 && questionScore <= -3) || isModerator) {
      // Delete vote
      // TODO, at least for non-moderators: also if myReputation >= 10000 and question age >= 48 hours
      $.post({
        url: "https://" + document.location.host + "/posts/" + postID + "/vote/10", // 10 = delete
        data: "fkey=" + fkey,
        success: function () {
          // TODO: update delete vote count
          console.log("Delete vote cast.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          window.alert("An error occurred, please try again later.");
          console.log("Error: " + textStatus + " " + errorThrown);
        }
      });
    }

    // Reload page; this is less elegant than waiting for all POST calls but it works.
    window.setTimeout(() => window.location.reload(false), 800);
  });
})(window.jQuery);
