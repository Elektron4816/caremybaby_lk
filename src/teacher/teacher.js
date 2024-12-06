import "./teacher.css";
import "../index.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/displayBalance.js";
import "../component/checkAuth.js";
import "./multiselect/snapselect.min.css";
import "./multiselect/snapselect.min.js";

let WebApp = window.Telegram.WebApp;
// const seeMoreAboutTeacher = document.querySelector(".moreAboutTeacher");

const frame = document.getElementById("isFrame");
const teacherDiv = document.getElementById("showFrame");
const firstMain = document.getElementById("firstMain");
const header = document.getElementById("header");

let clientGroupId = localStorage.getItem("clientGroupId");

// document.getElementById("showFrame").style.height = `${window.innerHeight}px`;
if (clientGroupId != 'n/a' && (clientGroupId != undefined || clientGroupId != null)) {
    document.querySelector(".iframeContainer").style.height = `${window.innerHeight - 120}px`;
    frame.style.height = `${window.innerHeight - 120}px`;
    frame.style.borderRadius = '30px 30px 0 0';
} else {
    document.querySelector(".iframeContainer").style.height = `${window.innerHeight - 50}px`;
    frame.style.height = `${window.innerHeight - 50}px`;
}

const urlFrame = `https://teachers.caremybaby.ru?name=${clientGroupId}`;

window.addEventListener('load', function () {
    frame.src = urlFrame
});

WebApp.BackButton.onClick(() => {
    // firstMain.classList.remove("classHide");
    // teacherDiv.classList.add("classHide");
    // header.style.display = "flex";
    // // navbar.style.display = "flex";
  //  window.location.href = "/another";
    history.back();
    WebApp.BackButton.hide();
})