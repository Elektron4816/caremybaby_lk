import "../index.css";
import "./items.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/displayBalance.js";
import "../component/checkAuth.js";

import { validNumberFromGet, showAlert } from "../component/functionFromExport";

import mortarboard1 from "../image/mortarboard-1.svg";
import ellipse from "../image/Ellipse 208.svg";
import clockIcok from "../image/clock-icok.svg";
import rubIcon from "../image/rub-icon.svg";
import closeCross from "../image/Union.svg";

document.getElementById("mortarboardIcon").src = mortarboard1;
document.getElementById("closeCross").src = closeCross;
document.getElementById("closeCross1").src = closeCross;
document.getElementById("closeCross2").src = closeCross;
document.getElementById("ellipse").src = ellipse;
document.getElementById("clockIcok").src = clockIcok;
document.getElementById("rubIcon").src = rubIcon;

const WebApp = window.Telegram.WebApp;
WebApp.BackButton.hide();

const lessons = document.getElementById("innerLessonHier");
let liveInput = document.getElementById("liveInput");
let PhoneClient = localStorage.getItem("phoneNumber");
const takeBody = document.getElementsByTagName("body")[0];
let chatId = WebApp.initDataUnsafe.user.id; // id чата tg клиента


if (PhoneClient != "n/a" && PhoneClient != null) {
  PhoneClient = validNumberFromGet(PhoneClient);
}

// const testTest = document.querySelectorAll(".item");
let clienVisit = 0;

let clientJson = {};

setTimeout(() => {
  fetch("/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientPhone: PhoneClient,
      chatId: chatId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data[0] != undefined) {
        clienVisit = data[0].client_visit_count;
        clientJson = data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}, 1000);

fetch("/lesson")
  .then((res) => res.json())
  .then((data) => {
    displayLesson(data);
    searchLesson();
    signUpLesson();
    showMoreAboutLesson(data);
  });

const searchLesson = () => {
  liveInput.addEventListener("keyup", function () {
    let value = this.value;
    const testTest = document.querySelectorAll(".item");
    lessons.querySelectorAll(".liveBlockItem").forEach(function (item, index) {
      if (!item.innerHTML.toLowerCase().includes(value.toLowerCase())) {
        testTest[index].classList.add("classHide");
      } else {
        testTest[index].classList.remove("classHide");
      }
    });
  });
};

function signUpLesson() {
  const allSignUpButton = document.querySelectorAll(".signUp");
  const textOnButton = document.getElementById("textOnButton");
  let nameLesson = "";
  for (let i = 0; i < allSignUpButton.length; i++) {
    allSignUpButton[i].addEventListener("click", () => {
      nameLesson = document.getElementById(`${i}`);
      const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
      const getUrl = `/itemsMetrika?location=items&object=out_btn_signUp&item_name=${nameLesson.innerText}&client_id=${client_id}`;
      fetch(getUrl);
      takeBody.classList.add("removeScrolling");
      if (PhoneClient == "n/a") {
        displayPopUpNoAuthTrial.style.display = "flex";
      } else if (clienVisit > 1) {
        displayPopUpAuthClient.style.display = "flex";
      } else {
        displayPopUAuthTrial.style.display = "flex";
      }
      for (let j = 0; j < displayNameLesson.length; j++) {
        displayNameLesson[j].innerText = nameLesson.innerText;
      }
    });
  }

  textOnButton.addEventListener("click", () => {
    nameLesson = document.getElementById("setNameLesson");
    if (PhoneClient == "n/a") {
      displayPopUpNoAuthTrial.style.display = "flex";
    } else if (clienVisit > 1) {
      displayPopUpAuthClient.style.display = "flex";
    } else {
      displayPopUAuthTrial.style.display = "flex";
    }
    for (let j = 0; j < displayNameLesson.length; j++) {
      displayNameLesson[j].innerText = nameLesson.innerText;
    }
    const getAtr = document.getElementById("setNameLesson").innerText;
    const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
    const getUrl = `/itemsMetrika?location=items&object=in_btn_signUp&item_name=${getAtr}&client_id=${client_id}`;
    fetch(getUrl);
  });
}

const displayLesson = (data) => {
  data.forEach(({ name, age, cost, duration, src }, index) => {
    lessons.innerHTML += `
    <div class="item" id="${name}">
        <div class="imgBackground"
        style="
        background-image: url(${src});">
            <div class="age">
                <img src="${ellipse}" />
                <p class="tooltip">${age}</p>
            </div>
            <div class="inlineContainer">
                <div class="duration">
                    <img src="${clockIcok}" />
                    <h3>${duration}</h3>
                </div>
                <div class="cost">
                    <img src="${rubIcon}" />
                    <h3>${cost}</h3>
                </div>
            </div>
        </div>
        <div class="bottom">
            <h1 class="liveBlockItem" id=${index}>${name}</h1>
            <div class="inlineContainer">
                <button class="more">Подробнее</button>
               
                <button class="signUp">Попробовать</button>
            </div>
        </div>
    </div>`;
  });
};

function showMoreAboutLesson(data) {
  // const backTolesson = document.getElementById("backToLesson");
  const goToSite = document.querySelector(".goToSite");
  const allMoreButton = document.querySelectorAll(".more");
  const testTest = document.querySelectorAll(".item");
  const moreContainer = document.querySelector(".moreAboutLesson");
  const setNameLesson = document.getElementById("setNameLesson");
  const setBgImage = document.getElementById("setBgImage");
  const setAgeLesson = document.getElementById("setAgeLesson");
  const setDurationLesson = document.getElementById("setDurationLesson");
  const setCostLesson = document.getElementById("setCostLesson");
  const setAboutLesson = document.getElementById("setAboutLesson");
  const textOnButton = document.getElementById("textOnButton");

  const linkToSite = document.getElementById("linkToSite");
  let toScroll = "";

  for (let i = 0; i < allMoreButton.length; i++) {
    allMoreButton[i].addEventListener("click", () => {
      WebApp.BackButton.show();
      const nameLesson = document.getElementById(`${i}`);
      const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
      const getUrl = `/itemsMetrika?location=items&object=out_btn_more&item_name=${nameLesson.innerText}&client_id=${client_id}`;
      fetch(getUrl);
      // const positionElem = allMoreButton[i].getBoundingClientRect();
      toScroll = window.scrollY;
      // if (clienVisit >= 1) {
      //   textOnButton.innerText = "Записаться";
      // }
      window.scrollTo(0, 0);
      document.querySelector(".mainHeader").classList.add("classHide");

      setNameLesson.innerText = data[i].name;
      setBgImage.setAttribute("style", `background-image: url(${data[i].src}`);
      setAgeLesson.innerText = data[i].age;
      setDurationLesson.innerText = data[i].duration;
      setCostLesson.innerText = data[i].cost;
      setAboutLesson.innerHTML = data[i].about;
      linkToSite.setAttribute("href", data[i].url);

      moreContainer.classList.remove("classHide");

      for (let j = 0; j < testTest.length; j++) {
        testTest[j].classList.add("classHide");
      }
    });
  }

  WebApp.BackButton.onClick(() => {
    moreContainer.classList.add("classHide");
    document.querySelector(".mainHeader").classList.remove("classHide");
    liveInput.value = "";
    for (let j = 0; j < testTest.length; j++) {
      testTest[j].classList.remove("classHide");
    }
    window.scrollBy(0, toScroll);
    WebApp.BackButton.hide();
  });

  // backTolesson.addEventListener("click", () => {
  //   moreContainer.classList.add("classHide");
  //   document.querySelector(".mainHeader").classList.remove("classHide");
  //   liveInput.value = "";
  //   for (let j = 0; j < testTest.length; j++) {
  //     testTest[j].classList.remove("classHide");
  //   }
  //   window.scrollBy(0, toScroll);
  // });
  goToSite.addEventListener("click", () => {
    const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
    const getUrl = `/itemsMetrika?location=items&object=in_btn_more_site&item_name=${setNameLesson.innerText}&client_id=${client_id}`;
    fetch(getUrl);
  })
}

function closePopUp() {
  takeBody.classList.remove("removeScrolling");
  displayPopUpNoAuthTrial.style.display = "none";
  displayPopUAuthTrial.style.display = "none";
  displayPopUpAuthClient.style.display = "none";
}

const closePopUpButton = document.querySelectorAll(".closePopUp");
const displayPopUpNoAuthTrial = document.getElementById("referrernoAuthTrial");
const displayPopUAuthTrial = document.getElementById("referrerAuthTrial");
const displayPopUpAuthClient = document.getElementById("referrerAuthClient");

const displayNameLesson = document.querySelectorAll(".innerNameLesson");

for (let i = 0; i < closePopUpButton.length; i++) {
  closePopUpButton[i].addEventListener("click", () => {
    closePopUp();
  });
}

displayPopUpNoAuthTrial.addEventListener("click", (e) => {
  if (e.target.id == "referrernoAuthTrial") {
    takeBody.classList.remove("removeScrolling");
    displayPopUpNoAuthTrial.style.display = "none";
  }
});
displayPopUAuthTrial.addEventListener("click", (e) => {
  if (e.target.id == "referrerAuthTrial") {
    takeBody.classList.remove("removeScrolling");
    displayPopUAuthTrial.style.display = "none";
  }
});
displayPopUpAuthClient.addEventListener("click", (e) => {
  if (e.target.id == "referrerAuthClient") {
    takeBody.classList.remove("removeScrolling");
    displayPopUpAuthClient.style.display = "none";
  }
});

const submitNoAuthTrialButton = document.getElementById("submitNoAuthTrial");
const submitAuthTrialButton = document.getElementById("submitAuthTrial");
const submitAuthClientButton = document.getElementById("submitAuthClient");

const requiredNumber1 = document.getElementById("requiredNumber1");
const requiredNumber2 = document.getElementById("requiredNumber2");

const errMsg1 = document.getElementById("errMsg1");
const errMsg2 = document.getElementById("errMsg2");

let iti2 = intlTelInput(requiredNumber2, {
  nationalMode: true,
  initialCountry: "auto",
  // strictMode: true,
  separateDialCode: true,
  autoPlaceholder: "off",
  geoIpLookup: (callback) => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => callback(data.country_code))
      .catch(() => callback("us"));
  },

  utilsScript: "/node_modules/intl-tel-input/build/js/utils.js",
});

requiredNumber2.addEventListener("paste", function () {
  setTimeout(() => {
    iti2.setNumber(requiredNumber2.value, { nationalMode: true });
  }, 50);
});

let iti1 = window.intlTelInput(requiredNumber1, {
  nationalMode: true,
  initialCountry: "auto",
  // strictMode: true,
  separateDialCode: true,
  autoPlaceholder: "off",
  geoIpLookup: (callback) => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => callback(data.country_code))
      .catch(() => callback("us"));
  },

  utilsScript: "/node_modules/intl-tel-input/build/js/utils.js",
});

requiredNumber1.addEventListener("paste", function () {
  setTimeout(() => {
    iti1.setNumber(requiredNumber1.value, { nationalMode: true });
  }, 50);
});

submitNoAuthTrialButton.addEventListener("click", (e) => {
  e.preventDefault();
  // if (requiredNumber1.value < 1) {
  //   requiredNumber1.style.border = "1px solid red";
  //   errMsg1.innerText = "Обязательное поле";
  //   return;
  // }

  if (!iti1.isValidNumber()) {
    requiredNumber1.style.border = "1px solid red";
    errMsg1.innerText = "Некорректный номер";
    return;
  }

  requiredNumber1.style.border = "none";
  errMsg1.innerText = "";
  const element = document.getElementById("nameLessonFromTrial");
  const nameLessonFromTrial = element.innerText;

  let form = document.getElementById("noAuthTrial");

  let object = {};
  object["lessonName"] = nameLessonFromTrial;
  object["requestType"] = "Пробное занятие (не авторизован)";

  const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
  const getUrl = `/itemsMetrika?location=items&object=in_btn_signUp_submit&item_name=${nameLessonFromTrial}&client_id=${client_id}`;
  fetch(getUrl);

  sendFrom(form, object);

  // sendFrom(form, nameLessonFromTrial);
  takeBody.classList.remove("removeScrolling");
  displayPopUpNoAuthTrial.style.display = "none";
});

submitAuthTrialButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (!iti2.isValidNumber()) {
    requiredNumber2.style.border = "1px solid red";
    errMsg2.innerText = "Некорректный номер";
    return;
  }

  requiredNumber2.style.border = "none";
  errMsg2.innerText = "";
  const element = document.getElementById("nameLessonAuthTrial")
  const nameLessonAuthTrial = element.innerText;
  let form = document.getElementById("AuthTrial");

  let object = {};
  object["lessonName"] = nameLessonAuthTrial;
  object["requestType"] = "Пробное занятие (авторизован)";

  const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
  const getUrl = `/itemsMetrika?location=items&object=in_btn_signUp_submit&item_name=${nameLessonAuthTrial}&client_id=${client_id}`;
  fetch(getUrl);

  sendFrom(form, object);
  takeBody.classList.remove("removeScrolling");
  displayPopUAuthTrial.style.display = "none";
});

submitAuthClientButton.addEventListener("click", (e) => {
  e.preventDefault();
  const element = document.getElementById("lessonAuthClient");
  const lessonAuthClient = element.innerText;
  let form = document.getElementById("authClient");
  let object = {};
  object["lessonName"] = lessonAuthClient;
  object["requestType"] = "Регулярное занятие";
  const client_id = clientJson[0].client_yc_id == undefined ? "none" : clientJson[0].client_yc_id;
  const getUrl = `/itemsMetrika?location=items&object=in_btn_signUp_submit&item_name=${lessonAuthClient}&client_id=${client_id}`;
  fetch(getUrl);

  sendFrom(form, object);
  takeBody.classList.remove("removeScrolling");
  displayPopUpAuthClient.style.display = "none";
});

const sendFrom = (form, object) => {
  // let object = {};
  const addCode = document.querySelector(".iti__selected-dial-code");

  console.log(addCode);

  let data = new FormData(form);
  data.forEach(function (value, key) {
    if (addCode != null) {
      if (key == "phoneNumber") {
        object[key] = `${addCode.innerText}${value}`;
      } else {
        object[key] = value;
      }
    } else {
      object[key] = value;
    }

  });
  console.log(object);
  // object.push({ Занаятие: nameLessonFromTrial });
  object["client"] = clientJson;
  let json = JSON.stringify(object);

  fetch("/api/form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
      if (data == "true") {
        showAlert(
          "Заявка отправлена менеджер свяжется с Вами в ближайшее время",
        );
      } else {
        showAlert("Произошла ошибка попробуйте позднее");
      }
    });

  // showAlert("Заявка отправлена меннеджер свяжеться с Вами в ближайшее время");
};

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
) {
  console.log("mobile");
} else {
  console.log("desktop");
}
