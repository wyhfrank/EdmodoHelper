// ==UserScript==
// @name         EdmodoHelper
// @namespace    http://wuyuhao.cn/
// @version      0.0.1
// @description  This script helps manipulate pages of edmodo.com.
// @author       Wu Yuhao
// @include  https://*.edmodo.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @grant GM_setClipboard
/* StartHistory

v0.0.1 - 2016-1-8
 - Init: For sites of edmodo.com, add a 'Copy' button to each post that helps
 copy the post and its comments into clipboard.

EndHistory */
// ==/UserScript==


'use strict';

function addCopyLink() {
	var txt='<li class="pull-left"> <div class="dot-li"></div> <a href="javascript:;" class="subtext ttip copy-comments" data-ttip="Copy comments">Copy</a> </li>';
	//var txt = '<li class=""><a id="copy_comments" href="javascript:;" class="ttip" data-ttip="Copy Comments" color="#ffffff">Copy</a></li>';
	$(".message-footer").append(txt);
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
    alert("Comments are copied to clipboard!");
}

function clickExpandBtn(msg) {
    var btn = msg.find(".show-more-comments");
    if(btn.length===0) {
        copyComments(msg);
    } else {
        btn.click();
    }
}

function expandComments(msg) {
    msg.find(".comments").bind('DOMNodeInserted',msg,clickExpandBtn);
    clickExpandBtn(msg);
}

addCopyLink();

$(".copy-comments").click(function(event){
    var msg=$(event.target).parents(".message");
    //expandComments(msg);
    copyComments(msg);
});