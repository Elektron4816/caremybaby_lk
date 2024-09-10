import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/checkAuth.js";
import "../component/displayBalance.js";
import { validNumberFromGet, showAlert } from "../component/functionFromExport.js";

import { Zuck } from './zuck.js'

import './zuck.js/dist/zuck.css';
import './zuck.js/dist/skins/snapgram.css';

import "../index.css";
import "./mainPage.css";


import chevronRight from "../image/chevron-right.svg";
import gift from "../image/gift.svg";
import group from "../image/Group 50.svg";
import group1 from "../image/Group 51.svg";
import closeBtn1 from "../image/Union.svg";
import house1 from "../image/house-1.svg";
import chatDots from "../image/chat-dots-1.svg"


document.getElementById("chevronRight").src = chevronRight;
document.getElementById("gift").src = gift;
document.getElementById("group").src = group;
document.getElementById("group1").src = group1;
document.getElementById("closeBtn1").src = closeBtn1;
document.getElementById("houseIcon").src = house1;
document.getElementById("chatDots").src = chatDots;
document.getElementById("closeBtn2").src = closeBtn1;


const clientGroupId = localStorage.getItem("clientGroupId");
let clientPhone = localStorage.getItem("phoneNumber");

if (clientPhone != "n/a" && clientPhone != null && clientPhone != undefined) {
  clientPhone = validNumberFromGet(clientPhone);
}

let clientYcId;
let clientObj;

let WebApp = window.Telegram.WebApp;
WebApp.expand();
WebApp.BackButton.hide();
WebApp.isClosingConfirmationEnabled = true;
let chatId = WebApp.initDataUnsafe.user.id;
//let chatId = "456072370";
const scheduleMoreButton = document.getElementById("scheduleMoreButton");
let AllSсheduleItem = "";
const goToPayPage = document.getElementById("payLoad");
const innerLesson = document.querySelector(".scheduleBody");
const todaySchedule = document.getElementById("todaySchedule");

goToPayPage.addEventListener("click", () => {
  window.location.href = "/pay";
});

if (clientGroupId != "n/a" && clientGroupId != undefined) {
  fetch("/nextlessons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientGroupId: clientGroupId }),
  })
    .then((res) => res.json())
    .then((data) => {
      displayLesson(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

let todayDate = new Date();

const displayLesson = (lesson) => {
  if (lesson.length > 0) {
    let flag = true;
    lesson.forEach(
      ({ lesson_name, lesson_date, teacher, lesson_date_for_js }, index) => {
        const match = lesson_date_for_js.match(/-?\d+(\.\d+)?/g);
        let lessonDay = parseInt(match[2]);
        let lessonMount = parseInt(match[1]);

        if (
          lessonDay == todayDate.getDate() &&
          lessonMount == todayDate.getMonth()
        ) {
          innerLesson.innerHTML += `
    <div class="scheduleItem">
      <div class="scheduleAbout">
        <h2 class="scheduleDate">
         ${lesson_date}
        </h2>
        <p class="sixe">${teacher}</p>
        <p class="sixe">${lesson_name}</p>
      </div>
    </div>`;
          flag = false;
        }
        if (lessonDay != todayDate.getDate() && flag) {
          todaySchedule.innerText = "На сегодня нет занятий";
          innerLesson.innerHTML = `
          <div class="scheduleItem">
            <div class="scheduleAbout">
              <h2 class="scheduleDate">
               Перейдите в расписание
              </h2>
            </div>
          </div>`;
        }
      },
    );
  } else {
    innerLesson.innerHTML += `
    <div class="scheduleItem">
      <div class="scheduleAbout">
        <h2 class="scheduleDate">
         Нет занятий в расписании
        </h2>
      </div>
    </div>`;
  }
  AllSсheduleItem = document.querySelectorAll(".scheduleItem");

  for (let i = 0; i < AllSсheduleItem.length; i++) {
    AllSсheduleItem[i].addEventListener("click", goToSchedule);
  }
};

fetch("/materials")
  .then((res) => res.json())
  .then((data) => {
    displayPopUp(data);
    displayMaterial(data);
  });

const popUp = document.getElementById("referrer");
const nameMaterialPopUp = document.getElementById("nameMaterialPopUp");
const descriptionPopUp = document.getElementById("descriptionPopUp");
const zero = document.getElementById("zero");

const innerPopUp = document.querySelector(".material");
const downLoad = document.getElementById("downLoad");

const takeBody = document.getElementsByTagName("body")[0];

const buttonName = document.getElementById("nameButtonPop");


buttonName.addEventListener("click", () => {
  const nameMaterial = document.getElementById("nameMaterialPopUp").innerText;
  const getUrl = `/itemsMetrika?location=main_materials&object=open-site&material_name=${nameMaterial}`;
  fetch(getUrl)
})

const displayMaterial = (data) => {
  const test = document.querySelectorAll(".openPopUp");

  for (let i = 0; i < test.length; i++) {
    test[i].addEventListener("click", () => {
      downLoad.setAttribute("href", data[i].url);
      takeBody.classList.add("removeScrolling");
      popUp.style.display = "flex";
      nameMaterialPopUp.innerHTML = data[i].name;
      descriptionPopUp.innerHTML = data[i].about;
      zero.style.backgroundImage = `url(${data[i].src})`;
      buttonName.innerHTML = data[i].button;
      const getUrl = `/itemsMetrika?location=main_materials&object=open-popup&material_name=${data[i].name}`;
      fetch(getUrl)
    });
  }
};

const displayPopUp = (data) => {
  data.forEach(({ name, src }, index) => {
    innerPopUp.innerHTML += `
        <div class="openPopUp" value="0">
            <div class="imgDiv" style="background-image: url(${src})"></div>
      
            <p class="labelFromImg">${name}</p>
        </div>`;
  });
};

popUp.addEventListener("click", (e) => {
  if (e.target.id === "referrer") {
    takeBody.classList.remove("removeScrolling");
    popUp.style.display = "none";
  }
});

const closePopUpButton = document.getElementById("closeBtn1");

closePopUpButton.addEventListener("click", () => {
  takeBody.classList.remove("removeScrolling");
  popUp.style.display = "none";
});

const goToSchedule = () => {
  window.location.href = "/schedule/";
};

scheduleMoreButton.addEventListener("click", goToSchedule);

const innerSlideBar = document.querySelector(".owerFlowWindod");

const regButton = document.getElementById("regis");
let flagRegis = false;

let allRefBanners = "";


const checkReferal = () => {
  fetch("/refProg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId: chatId }),
  })
    .then((res) => res.json())
    .then((data) => {
      clientObj = data;
      clientObj.type = "noAuth";
      if (data.status) {
        for (let i = 0; i < allRefBanners.length; i++) {
          if (data.refferal_program == "None") {
            allRefBanners[i].classList.forEach((value) => {
              if (value === "user") {
                allRefBanners[i].style.display = "flex";
              }
            })
          } else {
            allRefBanners[i].style.display = "flex";
            if (data.client_id === null) {
              document.querySelector(".btn").classList.add("classHide");
              regButton.classList.remove("classHide");
              document.getElementById("authText").innerText = 'Зарегистрируйтесь в личном кабинете CareMyBaby';
            }
          }
        }
      }


    })
    .catch((err) => {
      console.log(err);
    });
}


function getApiImport(yclientId) {

  fetch("/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      yclientId: yclientId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
    })
    .catch((err) => {
      console.log(err);
    });
}

const checkFirstLesson = () => {
  fetch("/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientPhone: clientPhone,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      getStory();
      if (data.length > 0) {
        clientObj = data;
        clientObj.type = "auth";
        console.info(clientObj);
        console.info(clientObj.type);

        clientYcId = data[0].client_yc_id;
        if (data[0].deposit_id === null) {
          getApiImport(data[0].client_yc_id);
        }

        // if (localStorage.getItem("avatar") === null) {
        getAvatar(data[0].client_yc_id);
        // }

        if (data[0].client_paid_multivalute === 0) {
          checkReferal();
        } else {
          for (let i = 0; i < allRefBanners.length; i++) {
            allRefBanners[i].classList.forEach((value) => {
              if (value === "user") {
                allRefBanners[i].style.display = "block";
              }
            })
          }
        }
      } else {
        flagRegis = true;
        checkReferal();
      }

    })
    .catch((err) => {
      console.log(err);
    });
};


function getAvatar(clientYcId) {
  fetch("/getAvatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientYcId: clientYcId,
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (localStorage.getItem("avatar") !== `url(${data.url})`) {
          localStorage.setItem("avatar", `url(${data.url})`);
          location.reload();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
}


fetch("/banners")
  .then((res) => res.json())
  .then((data) => {
    displayBanners(data);
    checkFirstLesson();
    sendNotify();
  })
  .catch((err) => {
    console.log(err);
  });

const displayBanners = (data) => {
  console.info(data);
  let innerP = "";
  data.forEach(({ name, src, about, segment, button }, index) => {
    if (about === null) {
      innerP = "";
    } else {
      innerP = `<p class="tooltip">${about}</p>`;
    }
    let innerButton = "";
    if (button !== undefined) {
      if (button.url == "send_notify") {
        innerButton = `<button class="smallBtn sendForm" data-name="${name}" data-title="${about}">${button.name}</button>`
      } else {
        innerButton = `<a href=${button.url} target=${button.target}><button class="smallBtn">${button.name}</button></a>`;
      }
    }
    innerSlideBar.innerHTML += `
    <div class="slide ${segment.join(" ")}" style="background-image: url('${src}');">
    <h2 class="h3Ower">${name}</h2>
    ${innerP}
    ${innerButton}
  </div>`;
  });
  allRefBanners = document.querySelectorAll(".ref");
};

function sendNotify() {
  const allSlideBtn = document.querySelectorAll(".sendForm");
  const displayNotify = document.getElementById("notify");
  const closeNotify = document.getElementById("closeBtn2");
  const confirmSendBtn = document.getElementById("confirmSend");
  const cancelSendBtn = document.getElementById("cancelSend");
  let nameNotify = "";
  let titleNotify = "";
  for (let i = 0; i < allSlideBtn.length; i++) {
    allSlideBtn[i].addEventListener("click", () => {
      nameNotify = allSlideBtn[i].getAttribute("data-name");
      titleNotify = allSlideBtn[i].getAttribute("data-title");
      displayNotify.style.display = "flex";
    })
  }

  confirmSendBtn.addEventListener("click", () => {
    fetch("./sendNotify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client: clientObj, nameNotify: nameNotify, type: clientObj.type, title: titleNotify })
    })
      .then((responce) => responce.text())
      .then((data) => {
        console.info(data);
        if (data == "true") {
          showAlert("Мы скоро Вам напишем!");
        } else {
          showAlert("Возникла ошибка, попробуйте позднее!");
        }

        displayNotify.style.display = "none";
      })
  })

  displayNotify.addEventListener("click", (e) => {
    if (e.target.id == "notify") {
      displayNotify.style.display = "none";
    }
  })
  cancelSendBtn.addEventListener("click", () => {
    displayNotify.style.display = "none";
  })
  closeNotify.addEventListener("click", () => {
    displayNotify.style.display = "none";
  })
}




var timestamp = function () {
  var timeIndex = 0;
  var shifts = [35, 60, 60 * 3, 60 * 60 * 2, 60 * 60 * 25, 60 * 60 * 24 * 4, 60 * 60 * 24 * 10];

  var now = new Date();
  var shift = shifts[timeIndex++] || 0;
  var date = new Date(now - shift * 1000);

  return date.getTime() / 1000;
};

const options = {
  skin: 'Snapgram',
  backNative: true,
  backButton: false,
  previousTap: true,
  avatars: true,
  list: false,
  autoFullScreen: false,
  cubeEffect: true,
  paginationArrows: true,
  localStorage: true,
};

const element = document.getElementById("stories");
const stories = Zuck(element, options);


function getStory() {
  fetch("/getStory")
    .then((response) => response.json())
    .then((data) => {
      displayStory(data, () => {
        const takeAllStory = document.querySelectorAll(".story");
        for (let i = 0; i < takeAllStory.length; i++) {
          takeAllStory[i].addEventListener("click", () => {
            const storyId = takeAllStory[i].getAttribute("data-id");
            const getUrl = `/itemsMetrika?location=stories&object=open&stories_id=${storyId}&client_id=${clientYcId}`
            fetch(getUrl);

          })
        }
      });
    })
}

function displayStory(data, callback) {
  data.forEach((value, index) => {
    const testStoryItem = [];

    if (value.data.length > 0) {
      for (let i = 0; i < value.data.length; i++) {
        let length = 0;
        if (value.data.type === "photo") {
          length = 6;
        }
        if (value.data[i].button.url) {
          testStoryItem.push({ id: i, type: value.data.type, redirect: value.data[i].button.redirect, link: value.data[i].button.url, linkText: value.data[i].button.title, src: value.data[i].item, preview: value.data[i].item, time: timestamp(), length: length })
        } else {
          testStoryItem.push({ id: i, type: value.data.type, src: value.data[i].item, preview: value.data[i].item, time: timestamp(), length: length })
        }
      }
    }
    const story = {
      id: `number-${value.id}`,
      clientId: clientYcId,
      items: testStoryItem,
      photo: value.preview,
      time: timestamp(),
    }
    stories.add(story);
  })
  if (callback) {
    callback();
  }
}

const anyFeadbackBnt = document.getElementById("anyFeadback");

anyFeadbackBnt.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=main-feedback&object=open_main_feedback&source=main-page&client_id=${clientYcId}`
  fetch(getUrl);
})