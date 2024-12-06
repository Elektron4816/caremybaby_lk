// import { getCookie } from "../auth/script.js";
import "../index.css";
import "./schedule.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/displayBalance.js";
import "../component/checkAuth.js"

import {
  validNumberFromGet,
  showAlert,
} from "../component/functionFromExport.js";
import autosize from "/node_modules/autosize/src/autosize.js";

import union from "../image/Union.svg";
import google from "../image/Google_Calendar_icon_(2020) 1.svg";
import yandex from "../image/yandex_icon.svg";
import check2 from "../image/check2.svg";
import fileText from "../image/file-text.svg";
import group62 from "../image/scheduleIcon/Group 62.svg";
import clock from "../image/scheduleIcon/clock.svg";
import calendar3 from "../image/scheduleIcon/calendar3.svg";
import xLg from "../image/scheduleIcon/x-lg.svg";
import calendarIcon1 from "../image/calendar-week-1.svg"


document.getElementById("closeMoveLessonBtn").src = union;
document.getElementById("closeCalendarButton").src = union;
document.getElementById("closeBtn1").src = union;
document.getElementById("closeBtn2").src = union;
document.getElementById("closeLateLesson").src = union;
document.getElementById("closeReportTeacherButton").src = union;
document.getElementById("check2").src = check2;
document.getElementById("fileText").src = fileText;
document.getElementById("google").src = google;
document.getElementById("yandex").src = yandex;
document.getElementById("calendarIcon").src = calendarIcon1;


const clientGroupId = localStorage.getItem("clientGroupId");
let phoneClient = localStorage.getItem("phoneNumber");

if (phoneClient != "n/a" && phoneClient != null) {
  phoneClient = validNumberFromGet(phoneClient);
}


if (phoneClient == "n/a" || phoneClient == null) {
  window.location.href = "/auth";
}

const radioPrev = document.getElementById("value-2");
const radioNext = document.getElementById("value-1");
const innerNextLesson = document.getElementById("innerNextLesson");
const innerPrevLesson = document.getElementById("innerPrevLesson");
const loadMoreNextButton = document.querySelector(".loadMoreNext");
const loadMorePrevButton = document.querySelector(".loadMorePrev");
const takeBody = document.getElementsByTagName("body")[0];

const goToItems = document.getElementById("goToItems");

let resourceIdFromGet = 0;
let startingIndex = 0;
let endingIndex = 5;
let prevLessonArr = [];
let NextLessonArr = [];

let BIGprevLessonArr = [];
let BIGNextLessonArr = [];

let flagActionCancelLesson = true;

const WebApp = window.Telegram.WebApp;

WebApp.MainButton.setParams({
  text: "Готово",
  color: "#EE7A45",
});

let clientJson = {};
let clientYcId;

setTimeout(() => {
  fetch("/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientPhone: phoneClient,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      clientJson = data;
      clientYcId = data[0].client_yc_id;
    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

goToItems.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=schedule&object=go_to_item_btn&client_id=${clientYcId}`;
  fetch(getUrl);
  setTimeout(() => {
    window.location.href = "/items";
  }, 100)

});

fetch("/nextlessons", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ clientGroupId: clientGroupId }),
})
  .then((res) => res.json())
  .then((data) => {
    if (Object.keys(data).length === 0 && location.search === "") {
      goToItems.classList.remove("classHide");
    }
    if (data.length >= 5) {
      loadMoreNextButton.classList.remove("classHide");
    }
    NextLessonArr = data;
    BIGNextLessonArr = data;
    displayAllNextLesson(data, NextLessonArr.slice(startingIndex, endingIndex));
    // moveLesson(data);

    lateLesson(data);
    hideButton(radioNext, data, goToItems);
  })
  .catch((err) => {
    console.log(err);
  });

setTimeout(() => {
  if (radioNext.checked) {
    loadMorePrevButton.classList.add("classHide");
  }
}, 350);

fetch("/prevlessons", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ clientGroupId: clientGroupId }),
})
  .then((res) => res.json())
  .then((data) => {
    // if (Object.keys(data).length === 0) {
    //   goToItems.classList.remove("classHide");
    // }
    console.info(data);
    if (data.length >= 5 && !radioNext.checked) {
      loadMorePrevButton.classList.remove("classHide");
    }
    prevLessonArr = data;
    BIGprevLessonArr = data;
    displayAllPrevLesson(data, prevLessonArr.slice(startingIndex, endingIndex));
    hideButton(radioPrev, data, goToItems);
  })
  .catch((err) => {
    console.log(err);
  });

loadMoreNextButton.addEventListener("click", () => {
  startingIndex += 5;
  endingIndex += 5;
  displayAllNextLesson(
    BIGNextLessonArr,
    NextLessonArr.slice(startingIndex, endingIndex),
  );
  if (NextLessonArr.length <= endingIndex) {
    loadMoreNextButton.classList.add("classHide");
    innerNextLesson.style.marginBottom = "50px";
  }
});

loadMorePrevButton.addEventListener("click", () => {
  startingIndex += 5;
  endingIndex += 5;
  displayAllPrevLesson(
    BIGprevLessonArr,
    prevLessonArr.slice(startingIndex, endingIndex),
  );
  if (prevLessonArr.length <= endingIndex) {
    loadMorePrevButton.classList.add("classHide");
    innerPrevLesson.style.marginBottom = "50px";
  }
});

const displayAllPrevLesson = (lesson, data) => {
  data.forEach(
    (
      {
        lesson_date,
        lesson_name,
        teacher,
        resource_id,
        cost_full,
        discount,
        client_valute
      },
      index,
    ) => {
      innerPrevLesson.innerHTML += `
    <div class="shedule">
    ${getSaleContainer(discount, cost_full, client_valute)}
        <div class="scheduleAboutPrev ${index}" id="${resource_id}">
          <h2 class="scheduleDate" id="dateLesson">${lesson_date}</h2>
          <p class="sixe" id="nameTeacher">${teacher}</p>
          <p class="sixe" id="lessonName">${lesson_name}</p>
        </div>
    </div>`;
    },
  );

  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  const reportAboutLesson = document.querySelector(".reportAboutLesson");
  const backButtonClass = document.querySelector(".backButtonClass");
  const reportAboutData = document.getElementById("reportAboutData");
  const reportAboutDuration = document.getElementById("reportAboutDuration");
  const reportAboutCost = document.getElementById("reportAboutCost");
  const reportAboutLessonName = document.getElementById(
    "reportAboutLessonName",
  );
  const innerCostSale = document.querySelector(".reportAboutCostSale");
  // const hideIfNoReport = document.getElementById("hideIfNoReport");
  const reportAboutTeacher = document.getElementById("reportAboutTeacher");
  const AllscheduleAboutPrev = document.querySelectorAll(".scheduleAboutPrev");
  const body = document.getElementsByTagName("body")[0];

  reportAboutLesson.style.minHeight = `${window.innerHeight - 120}px`

  const toSearch = location.search;
  console.info(location.search !== "");

  fetch(`/search${toSearch}`)
    .then((responce) => responce.json())
    .then((data) => {
      console.info(data.responce);
      if (data.responce) {
        history.pushState({}, '', location.pathname);
        radioPrev.click()
        document.getElementById(data.responce).click();
      }
    })

  let valute = "₽";

  for (let i = 0; i < AllscheduleAboutPrev.length; i++) {
    AllscheduleAboutPrev[i].addEventListener("click", () => {
      if (lesson[i].client_valute !== "руб") {
        valute = "€";
      }
      body.style.backgroundColor = "#f5f0e7";
      resourceIdFromGet = lesson[i].resource_id;
      const getUrl = `/itemsMetrika?location=schedule&object=open_record_card&resource_id=${resourceIdFromGet}&client_id=${clientYcId}`
      fetch(getUrl);
      fetch("/feadbackstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourseId: resourceIdFromGet }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data == "200") {
            thanksMess.classList.remove("classHide");
            feadbackForm.classList.add("classHide");
            feadBackContainer.classList.add("classHide");
          } else {
            thanksMess.classList.add("classHide");
            feadbackForm.classList.remove("classHide");
            feadBackContainer.classList.remove("classHide");
          }
        });
      let costWithSale = 0;

      if (lesson[i].discount !== "0" && lesson[i].discount !== "100") {
        let result = lesson[i].cost_full * lesson[i].amount;
        innerCostSale.innerText = `${parseFloat(result.toFixed(2))} ${valute}`;
      }
      WebApp.BackButton.show();
      header.style.display = "none";
      main.classList.add("classHide");
      reportAboutLesson.classList.remove("classHide");
      // feadbackForm.classList.remove("classHide");
      reportAboutData.innerText = `${lesson[i].lesson_date}`;
      reportAboutDuration.innerText = `${lesson[i].amount} мин`;
      reportAboutCost.innerText = `${lesson[i].cost_sale} ${valute} `;
      reportAboutLessonName.innerText = `${lesson[i].lesson_name}`;
      reportAboutTeacher.innerText = `${lesson[i].teacher}`;
      // innerReport.innerText = `${lesson[i].teacher_report}`;

      if (lesson[i].teacher_report === null) {
        // hideIfNoReport.style.display = "flex";
        reportFromTeacher.innerText =
          "Преподователь еще не успел написать отчет";
      } else {
        const match = lesson[i].teacher_report.match(/https?:\/\/[^\s]+/gm);

        let string = lesson[i].teacher_report;

        if (match !== null) {
          for (let j = 0; j < match.length; j++) {
            const innerMatch = `<a href="${match[j]}" class="link" target="_blank">${match[j]}</a>`;
            string = string.split(match[j]).join(innerMatch);
          }
        }

        reportFromTeacher.innerHTML = string;
      }
    });
  }


  WebApp.BackButton.onClick(function () {
    closeReportTeacherButton.click();
    innerCostSale.innerText = "";
    body.style.backgroundColor = "";
    header.style.display = "flex";
    main.classList.remove("classHide");
    thanksMess.classList.add("classHide");
    reportAboutLesson.classList.add("classHide");
    feadBackContainer.classList.remove("classHide");
    // hideIfNoReport.style.display = "none";
    for (let i = 0; i < allInput.length; i++) {
      allInput[i].checked = false;
    }
    textFeadBackToSend.value = "";
    hidenTextArea.classList.add("classHide");
    optionSlideBarry.classList.add("classHide");
    WebApp.MainButton.hide();
    WebApp.BackButton.hide();
  });
};


fetch("https://crm.caremybaby.ru/Remotes/lk__getPoint_jheYEG3")
  .then((response) => response.json())
  .then((data) => {
    console.info(data);
    displayLikePoint(data, () => {
      changeIcon(data);
    });
  })
  .catch((error) => console.log("Error:", error));

const displayLikePoint = (data, calback) => {
  let myClass = "icon visible"
  let status = "positive"
  const innerFavIcon = document.querySelector(".slideBar");
  data.forEach((item, index) => {
    if (!item.positive) {
      myClass = "icon";
      status = "negative";
    }
    innerFavIcon.innerHTML += `          
    <div class="${myClass}" data-status="${status}">
      <input type="checkbox" class="favIcon" name="${item.name}" value="true" id="checkbox${index}" />
      <label for="checkbox${index}" class="tooltip"></label>
      <label class="tooltip" for="checkbox${index}">${item.title}</label>
    </div>`
  })
  if (calback) {
    calback();
  }
}

const changeIcon = (data) => {
  const allCheckboxInput = document.querySelectorAll(".favIcon");
  allCheckboxInput.forEach((item, index) => {
    item.style.content = `url(${data[index].inactive_icon})`;
    item.addEventListener("click", () => {
      if (item.checked) {
        item.style.content = `url(${data[index].active_icon})`;
      } else {
        item.style.content = `url(${data[index].inactive_icon})`;
      }
    })
  })
}

const getSaleContainer = (discount, cost_full, client_valute) => {
  let saleContainer = "";
  let costValute = "₽";

  if (client_valute == "евро") {
    costValute = "€";
  }

  if (discount === "100") {
    saleContainer = `
    <div class="freeLesson">
      <p class="tooltip freeLessonText">Бесплатное</p>
    </div>`;

  } else if (discount !== "0") {
    let result = cost_full * (1 - discount / 100)
    saleContainer = `
    <div class="sale">
      <div class="saleItem">
        <p class="tooltip salePercentTitle">Скидка<span class="salePercentItem"> -${discount} %</span></p>
      </div>
      <div class="saleItem">
        <p class="tooltip saleCostPrice">${parseFloat(result.toFixed(2))} ${costValute}/мин <span class="saleCostFull">${cost_full} ${costValute}/мин</span></p>
      </div>
    </div>`;
  }
  return saleContainer;
}

const displayAllNextLesson = (lesson, data) => {
  let innerCopyButton = `
  <div class="footerline">
  <img src="${group62}"/>
  <p class="copyZoom">Скопировать ссылку на Zoom</p>
</div>
<div class="hrl"></div>`;

  let isInIframe;

  try {
    isInIframe = window.self !== window.top;
  } catch (e) {
    isInIframe = true;
  }

  if (isInIframe) {
    innerCopyButton = "";
    // мы в айфрейме
  }
  data.forEach(
    (
      {
        lesson_date,
        lesson_name,
        teacher,
        cost_full,
        discount,
        client_valute
      },
      index,
    ) => {

      innerNextLesson.innerHTML += `
    <div class="shedule">
    ${getSaleContainer(discount, cost_full, client_valute)}
      <div class="scheduleAboutNext">
        <h2 class="scheduleDate" id="dateLesson">${lesson_date}</h2>
        <p class="sixe" id="nameTeacher">${teacher}</p>
        <p class="sixe" id="lessonName">${lesson_name}</p>
      </div>
      <div class="scheduleFoo">
        <div class=classCopy id="copy${index}"> 
          <button class="getZoomBtn" id="getZoomBtn${index}">Подключиться к Zoom</button>
          ${innerCopyButton}
          <div class="footerline">
            <img src="${clock}" alt="clock"/>
            <p class="lateLessonButton">Опаздываю на занятие</p>
          </div>
          <div class="hrl"></div>
        </div>
        <div class="footerline">
          <img src="${calendar3}" alt="calendar"/>
          <p class="addToCalendar">Добавить в календарь</p>
        </div>
      <div class="hrl"></div>
        <div class="footerline">
          <img src="${xLg}" />
          <p style="color: #FF513A;" class="cancelLesson">Отменить занятие</p>
        </div>
      </div>
    </div>`;
    },
  );
  displayModalWindow(lesson);
  actionBodyLessonButton(lesson);
};

/* блок переноса занятия потом добавим
            <div class="footerline">
            <img src="${clock}" />
            <p class="moveLessonButton">Перенести занятие</p>
          </div>
        <div class="hrl"></div>
*/

const lateLesson = (data) => {
  const lateLessonButton = document.querySelectorAll(".lateLessonButton");
  const displayLateLessonPopUp = document.getElementById("lateLessonReferrer");
  const closeLateLesson = document.getElementById("closeLateLesson");
  const closeLatePop = document.getElementById("closeLatePop");
  const sendLateMess = document.getElementById("sendLateMess");

  // const openAlertMessege = document.querySelector(".alertPopUp");
  // const hLessonName = document.getElementById("hLessonName");
  let sendObj = {};
  let postResourceId = 0;
  for (let i = 0; i < lateLessonButton.length; i++) {
    lateLessonButton[i].addEventListener("click", () => {
      postResourceId = data[i].resource_id;
      sendObj = data[i];
      takeBody.classList.add("removeScrolling");
      displayLateLessonPopUp.style.display = "flex";
    });
  }

  sendLateMess.addEventListener("click", () => {
    const getUrl = `/itemsMetrika?location=schedule&object=late&client_id=${clientYcId}&resource_id=${postResourceId}`;
    fetch(getUrl);
    sendObj["client"] = clientJson;
    fetch("/late-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendObj),
    })
      .then((res) => res.text())
      .then((data) => {
        if (data == "true") {
          showAlert("Сообщение отправленно");
        } else {
          showAlert("Произошла ошибка, попробуйте позднее");
        }
      });
    takeBody.classList.remove("removeScrolling");
    displayLateLessonPopUp.style.display = "none";
  });

  displayLateLessonPopUp.addEventListener("click", (e) => {
    if (e.target.id === "lateLessonReferrer") {
      takeBody.classList.remove("removeScrolling");
      displayLateLessonPopUp.style.display = "none";
    }
  });

  closeLatePop.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    displayLateLessonPopUp.style.display = "none";
  });

  closeLateLesson.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    displayLateLessonPopUp.style.display = "none";
  });
};

const moveLesson = (data) => {

  const moveLessonButton = document.querySelectorAll(".moveLessonButton");
  const displayMoveLessonPopUp = document.getElementById("moveLesson");
  const closeMoveLessonBtn = document.getElementById("closeMoveLessonBtn");
  const form = document.getElementById("moveLessonForm");
  const sendFormBtn = document.getElementById("sendFormBtn");
  const hLessonName = document.getElementById("hLessonName");
  let datadata = data;

  for (let i = 0; i < moveLessonButton.length; i++) {
    moveLessonButton[i].addEventListener("click", () => {
      hLessonName.innerText = data[i].lesson_name;
      datadata = data[i];
      displayMoveLessonPopUp.style.display = "flex";
      takeBody.classList.add("removeScrolling");
    });
  }

  sendFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let object = {};
    object["lessonName"] = hLessonName.innerText;
    object["requestType"] = "Перенос занятия";
    object["client"] = clientJson;
    sendFrom(form, datadata, object, () => {
      displayMoveLessonPopUp.style.display = "none";
      takeBody.classList.remove("removeScrolling");
    });
  });

  closeMoveLessonBtn.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    displayMoveLessonPopUp.style.display = "none";
  });

  displayMoveLessonPopUp.addEventListener("click", (e) => {
    if (e.target.id === "moveLesson") {
      takeBody.classList.remove("removeScrolling");
      displayMoveLessonPopUp.style.display = "none";
    }
  });
};

const sendFrom = (form, bigData, object, calback) => {
  // let object = {};
  let data = new FormData(form);
  data.forEach(function (value, key) {
    object[key] = value;
  });
  // object.push({ Занаятие: nameLessonFromTrial });
  object["lesson"] = bigData;
  object["clientPhone"] = phoneClient;
  let json = JSON.stringify(object);

  fetch("/api/movelesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  })
    .then((res) => res.text())
    .then((data) => {
      if (calback) {
        calback(data);
      }
      if (data == "true") {
        showAlert(
          "Заявка отправлена менеджер свяжется с Вами в ближайшее время",
        );
      } else {
        showAlert("Ошибка попробуйте позднее");
      }
    });
};

let lessonDate = 0;
let nowDate = new Date();
nowDate = nowDate.getTime();

class GetLessonDate {
  constructor(string) {
    this.string = string;
  }

  returnDate() {
    const match = this.string.match(/-?\d+(\.\d+)?/g);
    let lessonYear = parseInt(match[0]);
    let lessonMount = parseInt(match[1]);
    let lessonDay = parseInt(match[2]);
    let lessonHour = parseInt(match[3]);
    let lessonMinute = parseInt(match[4]);
    let lessonDate = new Date(
      lessonYear,
      lessonMount,
      lessonDay,
      lessonHour,
      lessonMinute,
    );
    return lessonDate;
  }
}

// let dateLessonCheckPay = new GetLessonDate("2015, 1, 1, 15, 30").returnDate();
// let dateLessonCheckZoom =

const displayPreloader = document.querySelector(".preloader");
const getMainClass = document.querySelector(".main");

function displayModalWindow(lesson) {
  let valute = "₽";

  const AllcancelLessonButton = document.querySelectorAll(".cancelLesson");
  const AllNextModalButton = document.querySelector(".nextModalButton");

  const AllScheduleDate = document.querySelectorAll(".scheduleDate");
  const innerAnotherDate = document.getElementById("innerAnotherDate");
  const sendCancelData = document.getElementById("cancelLesson");

  const secondModal = document.getElementById("secondModal");
  const thirdModal = document.getElementById("thirdModal");
  const payCancel = document.getElementById("payFullCancel");
  const headCloseModalButton1 = document.getElementById("closeBtn1");
  const headCloseModalButton2 = document.getElementById("closeBtn2");
  const bodyCloseModalButton = document.querySelector(".close");

  const takeAllCopyClass = document.querySelectorAll(".classCopy");
  const takeAllScheduleClass = document.querySelectorAll(".shedule");

  const modal = document.getElementById("referrer");
  // const goToMoveLesson = document.querySelector(".goToMove");

  let secondJ;
  // ---- потом убрать и раскоментировать строки ниже
  // for (let i = 0; i < takeAllCopyClass.length; i++) {
  //   if (lesson[i].client_valute !== "руб") {
  //     valute = "€";
  //   }

  //   let dateLessonCheckZoom = new GetLessonDate(
  //     lesson[i].lesson_date_for_js,
  //   ).returnDate();

  //   dateLessonCheckZoom.setHours(dateLessonCheckZoom.getHours() - 2);
  //   const comparseDate = dateLessonCheckZoom.getTime();
  //   if (nowDate <= comparseDate) {
  //     takeAllCopyClass[i].classList.add("classHide");
  //   }
  // }

  //--- 


  for (let i = 0; i < AllcancelLessonButton.length; i++) {
    if (lesson[i].client_valute !== "руб") {
      valute = "€";
    }

    let dateLessonCheckZoom = new GetLessonDate(
      lesson[i].lesson_date_for_js,
    ).returnDate();

    dateLessonCheckZoom.setHours(dateLessonCheckZoom.getHours() - 2);
    const comparseDate = dateLessonCheckZoom.getTime();
    if (nowDate <= comparseDate) {
      takeAllCopyClass[i].classList.add("classHide");
    }

    AllcancelLessonButton[i].addEventListener("click", () => {

      secondJ = i;
      const resourceId = lesson[i].resource_id;
      takeBody.classList.add("removeScrolling");
      displayPreloader.style.display = "flex";
      getMainClass.style.filter = "blur(5px)";

      getTextCancelLesson(resourceId, payCancel, () => {
        modal.style.display = "flex";
        secondModal.classList.remove("classHide");
        displayPreloader.style.display = "none";
        getMainClass.style.filter = "";
      });
    });

    bodyCloseModalButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (
        e.target.id === "referrer" &&
        thirdModal.classList[1] === "classHide"
      ) {
        closeModal();
      }
    });

  }

  function closeModal() {
    takeBody.classList.remove("removeScrolling");
    modal.style.display = "none";
    secondModal.classList.add("classHide");
    thirdModal.classList.add("classHide");
  }

  headCloseModalButton1.addEventListener("click", closeModal);

  headCloseModalButton2.addEventListener("click", () => {
    if (flagActionCancelLesson) {
      takeAllScheduleClass[secondJ].style.display = "none";
    }
    closeModal();
  });

  sendCancelData.addEventListener("click", () => {
    if (flagActionCancelLesson) {
      takeAllScheduleClass[secondJ].style.display = "none";
    }
    closeModal();
  });

  // const displayMoveLessonPopUp = document.getElementById("moveLesson");
  // const hLessonName = document.getElementById("hLessonName");

  // goToMoveLesson.addEventListener("click", () => {
  //   closeModal();
  //   document.querySelectorAll(".moveLessonButton")[secondJ].click();

  //   // displayMoveLessonPopUp.style.display = "flex";
  //   // takeBody.classList.add("removeScrolling");
  //   // hLessonName.innerText = lesson[secondJ].lesson_name;
  //   // moveLesson(lesson[secondJ]);
  // });

  AllNextModalButton.addEventListener("click", () => {

    getActionCancelLesson(lesson[secondJ].resource_id, innerAnotherDate, AllScheduleDate[secondJ], () => {
      displayPreloader.style.display = "none";
      getMainClass.style.filter = "none";
      secondModal.style.filter = "none";
      secondModal.classList.add("classHide");
      thirdModal.classList.remove("classHide");
    });

  });

}


function getTextCancelLesson(req, string, callback) {
  fetch("/cancellesson/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resourceId: req,
      client_id: clientYcId
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("text", data);
      string.innerHTML = data.text;
      if (data.cost == "-1") {
        document.querySelector(".nextModalButton").style.display = "none";
        document.querySelector(".close").innerText = "Закрыть";
      } else {
        document.querySelector(".nextModalButton").style.display = "block";
        document.querySelector(".close").innerText = "Не отменять";
      }
      if (callback) {
        callback(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getActionCancelLesson(req, string, string2, callback) {
  displayPreloader.style.display = "flex";
  getMainClass.style.filter = "blur(5px)";
  document.getElementById("secondModal").style.filter = "blur(5px)";
  fetch("/cancellesson/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resourceId: req,
      client_id: clientYcId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.info("action", data);

      if (data == "204") {
        string.innerText = `Занятие «${string2.innerText}» успешно отменено`;
      } else {
        string.innerText = "Возникла ошибка, попробуйте позднее";
        flagActionCancelLesson = false;
      }

      if (callback) {
        callback(data);
      }

    })
    .catch((err) => {
      console.log(err);
    });
}

if (radioPrev !== null && radioNext !== null) {
  // if (radioNext.checked){

  // }
  radioPrev.addEventListener("click", () => {
    if (BIGprevLessonArr.length >= 5) {
      loadMorePrevButton.classList.remove("classHide");
    }
    // loadMorePrevButton.classList.remove("classHide");
    loadMoreNextButton.classList.add("classHide");
    innerNextLesson.classList.add("classHide");
    innerPrevLesson.classList.remove("classHide");
  });
  radioNext.addEventListener("click", () => {
    if (BIGNextLessonArr.length >= 5) {
      loadMoreNextButton.classList.remove("classHide");
    }
    loadMorePrevButton.classList.add("classHide");
    innerPrevLesson.classList.add("classHide");
    innerNextLesson.classList.remove("classHide");
  });
}

function actionBodyLessonButton(lesson) {
  // const firstLesson = document.getElementById("numberCopy0");
  // const firstButtonToZoom = document.getElementById("getZoomBtn0");

  const allCopyZoomurl = document.querySelectorAll(".copyZoom");
  const allGetZoom = document.querySelectorAll(".getZoomBtn");

  const addToCalendarAll = document.querySelectorAll(".addToCalendar");
  const calendarPopUP = document.getElementById("firstReferrer");
  const googleButton = document.getElementById("googleButton");
  const yandexButton = document.getElementById("yandexButton");

  const closeCalendarButton = document.getElementById("closeCalendarButton");

  for (let i = 0; i < addToCalendarAll.length; i++) {
    let urlfFromCalendar = `http://www.google.com/calendar/event?action=TEMPLATE&text=${lesson[i].lesson_name} - CareMyBaby&dates=${lesson[i].lesson_date_for_ics}/${lesson[i].lesson_date_for_ics_plus}&details=${lesson[i].zoom_url}&crm=AVAILABLE`;
    let urlYandex = `https://calendar.yandex.ru/week/create?startTs=${lesson[i].lesson_date_for_ics}&endTs=${lesson[i].lesson_date_for_ics_plus}&name=${lesson[i].lesson_name}&description=${lesson[i].zoom_url}`;

    addToCalendarAll[i].addEventListener("click", () => {
      const getUrl = `/itemsMetrika?location=schedule&object=add_calendar&client_id=${clientYcId}&resource_id=${lesson[i].resource_id}`;
      fetch(getUrl);
      calendarPopUP.style.display = "flex";
      takeBody.classList.add("removeScrolling");
    });

    googleButton.addEventListener("click", () => {
      const getUrl = `/itemsMetrika?location=schedule&object=select_cal_google&client_id=${clientYcId}&resource_id=${lesson[i].resource_id}`;
      fetch(getUrl);
      window.open(urlfFromCalendar, "_blank", "noopener");
      calendarPopUP.style.display = "none";
    });

    yandexButton.addEventListener("click", () => {
      const getUrl = `/itemsMetrika?location=schedule&object=select_cal_ya&client_id=${clientYcId}&resource_id=${lesson[i].resource_id}`;
      fetch(getUrl);
      window.open(urlYandex, "_blank", "noopener");
      calendarPopUP.style.display = "none";
    });

    allGetZoom[i].addEventListener("click", () => {
      window.open(lesson[i].zoom_url, "_blank", "noopener");
    });
    if (allCopyZoomurl.length > 0) {
      allCopyZoomurl[i].addEventListener("click", function () {
        navigator.clipboard
          .writeText(lesson[i].zoom_url)
          .then(function () {
            showAlert("Скопировано");
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    }
  }

  closeCalendarButton.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    calendarPopUP.style.display = "none";
  });

  calendarPopUP.addEventListener("click", (e) => {
    if (e.target.id === "firstReferrer") {
      takeBody.classList.remove("removeScrolling");
      calendarPopUP.style.display = "none";
    }
  });
}

const hidenTextArea = document.getElementById("textArea");
const AllStars = document.querySelectorAll(".allRadio");
const allInput = document.querySelectorAll(".allInput");
const textFeadBackToSend = document.getElementById("textFeadBack");
const feadbackForm = document.getElementById("feadbackForm");
const thanksMess = document.querySelector(".thanks");
// const innerReport = document.getElementById("innerReport");
const showTeacherReport = document.getElementById("showTeacherReport");
const firstStar = document.getElementById("star1");
const feadBackContainer = document.getElementById("feadBackContainer");
const optionSlideBarry = document.querySelector(".favor");

const showTeacherReportPopUp = document.getElementById("secondReferrer");
const reportFromTeacher = document.getElementById("reportFromTeacher");
const closeReportTeacherButton = document.getElementById(
  "closeReportTeacherButton",
);

let sendFeadBackRating = 0;

showTeacherReport.addEventListener("click", () => {
  // innerReport.classList.remove("classHide");
  const getUrl = `/itemsMetrika?location=schedule&object=open_report&client_id=${clientYcId}&resource_id=${resourceIdFromGet}`;
  fetch(getUrl);
  takeBody.classList.add("removeScrolling");
  showTeacherReportPopUp.style.display = "flex";
});

showTeacherReportPopUp.addEventListener("click", (e) => {
  if (e.target.id === "secondReferrer") {
    takeBody.classList.remove("removeScrolling");
    showTeacherReportPopUp.style.display = "none";
  }
});

closeReportTeacherButton.addEventListener("click", () => {
  takeBody.classList.remove("removeScrolling");
  showTeacherReportPopUp.style.display = "none";
});

for (let i = 0; i < AllStars.length; i++) {
  AllStars[i].addEventListener("click", () => {
    const getUrl = `/itemsMetrika?location=schedule&object=select_star&client_id=${clientYcId}&resource_id=${resourceIdFromGet}`;
    fetch(getUrl);
    hidenTextArea.classList.remove("classHide");
    optionSlideBarry.classList.remove("classHide");
    sendFeadBackRating = allInput[i].value;

    // if (allInput[i].value <= 3) {
    //   document.querySelectorAll(".icon").forEach(item => {
    //     if (item.getAttribute("data-status") == "negative") {
    //       item.classList.add("visible");
    //     } else {
    //       item.classList.remove("visible");
    //     }
    //   })
    // } else {
      document.querySelectorAll(".icon").forEach(item => {
        if (item.getAttribute("data-status") == "negative") {
          item.classList.remove("visible");
        } else {
          item.classList.add("visible");
        }
      })
    //}

    setTimeout(() => {
      window.scrollBy(0, 300);
    }, 150);
    WebApp.MainButton.show();
  });
}

// const sendButton = document.getElementById("testingRemotse");
// let j = 0;
// sendButton.addEventListener("click", (e) => {
//   e.preventDefault();

//   let checkBoxData = {};
//   let data = new FormData(feadbackForm);
//   console.log("это форма", data);
//   data.forEach(function (value, key) {
//     checkBoxData[key] = value;
//   });

//   checkBoxData.resource_id = resourceIdFromGet;

//   postData("/sendfeadback", checkBoxData).then((data) => {
//     console.log(data); // JSON data parsed by `response.json()` call
//   });
// });

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(function (error) {
    console.log(error);
  });
  return await response.text();
}

WebApp.MainButton.onClick(function () {
  const getUrl = `/itemsMetrika?location=schedule&object=send_feedback&resource_id=${resourceIdFromGet}&client_id=${clientYcId}`
  fetch(getUrl);

  let checkBoxData = {};
  let data = new FormData(feadbackForm);
  data.forEach(function (value, key) {
    checkBoxData[key] = value;
  });

  checkBoxData.resource_id = resourceIdFromGet;

  postData("/sendfeadback", checkBoxData).then((data) => {
    // JSON data parsed by `response.json()` call
  });

  WebApp.MainButton.hide();
  feadbackForm.classList.add("classHide");
  hidenTextArea.classList.add("classHide");
  optionSlideBarry.classList.add("classHide");
  thanksMess.classList.remove("classHide");
  feadBackContainer.classList.add("classHide");

  // реализация отправки рейтинга и отзыва
});

autosize(document.getElementById("textFeadBack"));

const hideButton = (radioButton, obj, element) => {
  radioButton.addEventListener("change", () => {
    if (Object.keys(obj).length !== 0) {
      element.classList.add("classHide");
    } else {
      element.classList.remove("classHide");
    }
  });
};

const allFavIcon = document.querySelectorAll(".icon");

for (let i = 0; i < allFavIcon.length; i++) {
  allFavIcon[i].addEventListener("click", () => {
    const getUrl = `/itemsMetrika?location=schedule&object=select_like&resource_id=${resourceIdFromGet}&client_id=${clientYcId}`
    fetch(getUrl);
  })
}