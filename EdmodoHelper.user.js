// ==UserScript==
// @name         EdmodoHelper
// @namespace    http://wuyuhao.cn/
// @version      0.0.3
// @description  This script helps manipulate pages of edmodo.com.
// @author       Wu Yuhao
// @include  https://*.edmodo.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @require  https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @grant GM_setClipboard
/* StartHistory

v0.03 - 2016-1-12
 - Feature: Automatically expand all comments when copying.

v0.02 - 2016-1-9
 - Bug fix: Button won't appear when there's no page refresh.
 - Feature: Replace popup window with html div for message display.

v0.0.1 - 2016-1-8
 - Init: For sites of edmodo.com, add a 'Copy' button to each post that helps
 copy the post and its comments into clipboard.

EndHistory */
// ==/UserScript==


'use strict';

function showMsg(str) {
    var node = '<div id="header-message"><span>'+ str +'</span></div>';
    $("#topbar-content").prepend(node);
    $("#topbar-content").children("#header-message").fadeOut(5000,function(){
        $(this).remove();
    });
}

function addAllCopyBtn() {
    $(".message-footer").each(function(){
        addCopyBtn($(this));
    });
}

function addCopyBtn(jNode) {
    if (jNode.find(".copy-comments").length===0) {
        var txt='<li class="pull-left"> <div class="dot-li"></div> <a href="javascript:;" class="subtext ttip copy-comments" data-ttip="Copy comments">Copy</a> </li>';
        jNode.append(txt);
    }
}

function getText(obj) {
    if (obj===null || obj.length===0) return "";

    var str = obj.html();
    str = str.replace(/<br>/g,'\r\n').replace(/^\s+/g,'').replace(/\s+$/g,'');

    return str;
}

function findObj() {
    var parent = arguments[0];
    var obj = null;
    for(var i=1; i<arguments.length; i++) {
        obj = parent.find(arguments[i]);
        if (obj.length!==0) break;
    }    
    return obj;
}

function copyComments(msg) {
    var str="";
    str += getText(findObj(msg,".msg-content-text.long-post",".msg-content-text.summary"));
    str += "\n\n";

    msg.find(".comment").each(function(){
        // str += getText(findObj($(this),".comment-sender-name"));
        findObj($(this),".comment-header").find("*").each(function(){
            str += getText($(this)) + " ";
        });
        str += "\n\n";
        str += getText(findObj($(this),".full-comment", ".short-comment"));
        str += "\n\n";
    });
    GM_setClipboard(str);
    showMsg("Comments are copied to clipboard!");
}

function clickExpandBtn(msg, callback) {
    var btn = msg.find(".show-more-comments");
    if(btn.length===0) {
        if (callback) callback(msg);
    } else {
        btn.click();
    }
}

function expandAllComments(msg, callback) {

    var myVar = setInterval(function(){
        
        clickExpandBtn(msg, function() {
            clearInterval(myVar);
            if (callback) callback(msg);
        });

    }, 300);
}


function registerClickCallback() {
    $(".copy-comments").live("click",function(event){
        var msg=$(event.target).parents(".message");
        expandAllComments(msg, copyComments);
    });   
}

$(function(){

    registerClickCallback();
    
    waitForKeyElements(".message-footer",addCopyBtn);    
});
