const PhoneCookie = localStorage.getItem("phoneNumber");
const authButton = document.getElementById("auth");
const logInWindow = document.querySelector(".logInWindow");
const header = document.querySelector(".header");
const main = document.querySelector(".main");
const mButton = document.querySelectorAll(".mButton");

const mainAll = document.querySelectorAll(".main");
const hideFeadbackRadioBtn = document.querySelector(".onlyUser")
const mainPromo = document.querySelector(".mainPromo");

if (mButton != null) {
  for (let i = 0; i < mButton.length; i++) {
    mButton[i].addEventListener("click", (e) => {
      e.preventDefault();

      if (PhoneCookie == "n/a" || PhoneCookie == null) {
        window.location.href = "/auth";
      } else {
        window.location.href = mButton[i].getAttribute("href");
      }
    });
  }
}

if (PhoneCookie == null || PhoneCookie == "n/a") {
  if (authButton !== null) {
    authButton.classList.remove("classHide");
  }
  for (let i = 0; i < mainAll.length; i++) {
    console.info("ok");
    mainAll[i].style.minHeight = `${window.innerHeight - 50}px`;
  }
} else {
  header.style.display = "flex";
  if (hideFeadbackRadioBtn != null) {
    hideFeadbackRadioBtn.classList.remove("classHide");
  }
  if (mainPromo != null ) {
    mainPromo.classList.remove("classHide");
  }
  if (logInWindow !== null) {
    logInWindow.classList.remove("classHide");
  }
  for (let i = 0; i < mainAll.length; i++) {
    mainAll[i].classList.add("addBorderRadius");
    mainAll[i].style.minHeight = `${window.innerHeight - 120}px`;
  }
}
