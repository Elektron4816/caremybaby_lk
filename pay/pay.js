import "../index.css";
import "./pay.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/displayBalance.js";

import {
  showAlert,
  validNumberFromGet,
} from "../component/functionFromExport.js";

import gift from "../image/gift.svg";
import group from "../image/Group 50.svg";
import group1 from "../image/Group 51.svg";
import closeBtn1 from "../image/Union.svg";

import wallet1 from "../image/wallet2-1.svg";

document.getElementById("gift").src = gift;
document.getElementById("group").src = group;
document.getElementById("group1").src = group1;
document.getElementById("closeBtn1").src = closeBtn1;
document.getElementById("closeBtn2").src = closeBtn1;
document.getElementById("walletIcon").src = wallet1;

const WebApp = window.Telegram.WebApp;

const amountBalanceButton = document.querySelector(".btn");
// const amountCancelButton = document.querySelector(".button");
const closeBalanceWindow = document.getElementById("referrer");

const closePopoUp = document.getElementById("firstReferrer");

const radioEuro = document.getElementById("typeEuro");
const radioRuble = document.getElementById("typeRub");
const sendPayment = document.getElementById("sendPayment");
const amountInput = document.getElementById("summ");
const bonusInput = document.getElementById("bonusInput");
const displayPreloader = document.querySelector(".preloader");
const getMainClass = document.querySelector(".main");
const howGetButton = document.getElementById("howGetLink");
const emailInput = document.getElementById("userEmail");

let clientPhone = localStorage.getItem("phoneNumber");

clientPhone = validNumberFromGet(clientPhone);

let startingIndex = 0;
let endingIndex = 10;
let clientDataArr = [];
let jsonClientObj = {};
let clientYcId = "";

const innerHistory = document.getElementById("innerHistory");

// let clientGroupId = getCookie("clientGroupId");
let clientGroupId = localStorage.getItem("clientGroupId");

WebApp.BackButton.hide();

const showMoreButton = document.querySelector(".loadMore");

const closeBalanceWindowButton = document.getElementById("closeBtn1");
const closePopoUpButton = document.getElementById("closeBtn2");
const closePopoDownButton = document.getElementById("closePopUpButton");

const takeBody = document.getElementsByTagName("body")[0];

amountBalanceButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (flagDeposit) {
    showAlert("Менеджер еще не завел счет");
    return;
  }
  const getUrl = `/itemsMetrika?location=balance&object=open-popup-payments&clinet_id=${clientYcId}`;
  fetch(getUrl);
  takeBody.classList.add("removeScrolling");
  document.getElementById("referrer").style.display = "flex";
});

howGetButton.addEventListener("click", () => {
  takeBody.classList.add("removeScrolling");
  closePopoUp.style.display = "flex";
});

closePopoUpButton.addEventListener("click", () => {
  takeBody.classList.remove("removeScrolling");
  closePopoUp.style.display = "none";
});

closePopoUp.addEventListener("click", (e) => {
  if (e.target.id === "firstReferrer") {
    takeBody.classList.remove("removeScrolling");
    closePopoUp.style.display = "none";
  }
});

closePopoDownButton.addEventListener("click", () => {
  takeBody.classList.remove("removeScrolling");
  closePopoUp.style.display = "none";
});

closeBalanceWindowButton.addEventListener("click", () => {
  takeBody.classList.remove("removeScrolling");
  closeBalanceWindow.style.display = "none";
});

closeBalanceWindow.addEventListener("click", (e) => {
  if (e.target.id === "referrer") {
    takeBody.classList.remove("removeScrolling");
    closeBalanceWindow.style.display = "none";
  }
});

const innerErrMessage = document.getElementById("errMess");
const innerErrEmail = document.getElementById("errEmail");


emailInput.addEventListener("focus", () => {
  innerErrEmail.innerText = "";
  emailInput.style.border = "none";
})

amountInput.addEventListener("focus", () => {
  innerErrMessage.innerText = "";
  amountInput.style.border = "none";
});

let flagDeposit = false;

setTimeout(() => {
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
      if (data[0].deposit_id === null) {
        flagDeposit = true;
      }
      clientYcId = data[0].client_yc_id;
      jsonClientObj = data;
      checkClientValute(data);
    })
    .catch((err) => {
      console.log(err);
    });
}, 400);

const checkClientValute = (data) => {
  if (data[0].client_valute === "евро") {
    radioEuro.checked = true;
    emailInput.classList.add("classHide");
  }
  radioRuble.addEventListener("change", () => {

    if (data[0].client_valute === "евро") {
      showAlert("Для подключения оплаты в рублях обратитесь координатору");
      radioEuro.checked = true;
    }
  })

  radioEuro.addEventListener("change", () => {
    if (data[0].client_valute === "руб") {
      showAlert("Для подключения оплаты в евро обратитесь к координатору");
      radioRuble.checked = true;
    }

  })
}


const innerErrBonus = document.getElementById("errMessBonus");

bonusInput.addEventListener("focus", () => {
  innerErrBonus.innerText = "";
  bonusInput.style.border = "none";
});

function validateEmail(email) {
  var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

amountInput.addEventListener("input", () => {
  let input = amountInput.value;
  if (input.includes(".")) {
    let afterDot = input.split(".")[1];
    if (afterDot.length > 2) {
      amountInput.value = input.substring(0, input.length - 1);
    }
  }
})

sendPayment.addEventListener("click", (e) => {
  e.preventDefault();

  if (amountInput.value.length <= 0 || parseFloat(amountInput.value) < 1) {
    innerErrMessage.innerText = "Введите корректную сумму";
    amountInput.style.border = "1px solid red";
    return
  }
  if (radioRuble.checked) {

    if (!validateEmail(emailInput.value)) {
      innerErrEmail.innerText = "Введите корректную почту";
      emailInput.style.border = "1px solid red";
      return
    }
  }

  getMainClass.style.filter = "blur(5px)";
  closeBalanceWindow.style.filter = "blur(5px)";
  displayPreloader.style.display = "flex";
  if (radioRuble.checked) {
    if (bonusInput.value.length > 0) {
      checkPromo((bool) => {
        if (bool) {
          sendAmountRub();
        }
      });
    } else {
      sendAmountRub();
    }
    // sendAmount();
  } else if (radioEuro.checked) {
    sendAmountEuro();
    setTimeout(() => {
      displayPreloader.style.display = "none";
      getMainClass.style.filter = "";
      closeBalanceWindow.style.filter = "";
      closeBalanceWindow.style.display = "none";
    }, 3000)
  }
  // closeBalanceWindow.style.display = "none";
  // closeBalanceWindow.style.filter = "";
  // getMainClass.style.filter = "";
  // displayPreloader.style.display = "none";

});

function checkPromo(callback) {
  fetch("/promo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promo: bonusInput.value,
      client: clientYcId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let testTestReturn = false;
      if (data.status === 404) {
        displayPreloader.style.display = "none";
        getMainClass.style.filter = "";
        closeBalanceWindow.style.filter = "";
        innerErrBonus.innerText = "Промокод не найден";
        bonusInput.style.border = "1px solid red";
      }
      if (data.status === 409) {
        displayPreloader.style.display = "none";
        getMainClass.style.filter = "";
        closeBalanceWindow.style.filter = "";
        innerErrBonus.innerText = "Промокод уже активирован";
        bonusInput.style.border = "1px solid red";
      }
      if (data.status === 200) {
        // getMainClass.style.filter = "blur(5px)";
        // displayPreloader.style.display = "flex";
        closeBalanceWindow.style.display = "none";
        closeBalanceWindow.style.filter = "";
        testTestReturn = true;
        // sendAmount();
      }
      if (callback) {
        callback(testTestReturn);
      }
      resultComparsePromo = data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const getRandNumber = () => {
  let date = new Date();
  let randNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  let cT = `${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${randNumber}`;
  return cT;
};

const sendAmountEuro = () => {
  let cT = getRandNumber();

  fetch("/api/amount/euro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: parseFloat(amountInput.value),
      bonus: bonusInput.value,
      client: jsonClientObj,
      client_reference_id: cT,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      let isInIframe;

      try {
        isInIframe = window.self !== window.top;
      } catch (e) {
        isInIframe = true;
      }

      if (isInIframe) {
        window.open(data.url, "_blank", "noopener")
        // мы в айфрейме
      } else {
        window.location.replace(data.url);
      }
    });
};

const sendAmountRub = () => {
  let cT = getRandNumber();

  fetch("/api/amount/rub", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      MNT_AMOUNT: parseFloat(amountInput.value),
      bonus: bonusInput.value,
      MNT_TRANSACTION_ID: cT,
      MNT_CUSTOM3: emailInput.value,
      client: jsonClientObj,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // setTimeout(() => {
      window.location.assign(
        `https://moneta.ru/assistant.widget?version=v3&operationId=${data}&MNT_CUSTOM3=${emailInput.value}`,
      );
      // setTimeout(() => {
      //   displayPreloader.style.display = "none";
      //   getMainClass.style.filter = "";
      // }, 2000);
      // }, 1000);
    })
    .catch((err) => {
      console.log(err);
    });
};

fetch("/getrecords", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    clientGroupId: clientGroupId,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    clientDataArr = data;

    if (clientDataArr.length >= 10) {
      showMoreButton.classList.remove("classHide");
    }
    if (showMoreButton.classList[1] == "classHide") {
      innerHistory.style.marginBottom = "50px";
    }
    displayHistory(clientDataArr.slice(startingIndex, endingIndex));
  })
  .catch((err) => {
    console.log(err);
  });

const displayHistory = (client) => {
  client.forEach(
    (
      { lesson_date, client_valute, cost_sale, amount, type_id, is_bonus },
      index,
    ) => {
      let icon = "₽";
      let degree = "+";
      let message = "Пополнение счета";
      let innerSpan = `<p class="historyDate">${lesson_date}</p>`;
      if (client_valute === "евро") {
        icon = "€";
      }
      if (is_bonus) {
        message = "Бонусы";
      }
      if (type_id != 10) {
        degree = "-";
        message = "Платная отмена";
      }

      if (amount != undefined) {
        // if (type_id == 10){}
        innerHistory.innerHTML += `
        <div class="history">
        ${innerSpan}
        <div class="operation">
          <p>${message}</p>
          <p class="amount">${degree} ${amount} ${icon}</p>
        </div>`;
      } else {
        innerHistory.innerHTML += `
      <div class="history">
      ${innerSpan}
      <div class="operation">
        <p>Оплата за урок</p>
        <p class="amount">- ${cost_sale} ${icon}</p>
      </div>`;
      }
    },
  );
  checkDateLesson();
}; // нужна ли обработка нулевых занятий?

const checkDateLesson = () => {
  const allHistory = document.querySelectorAll(".history");
  const allLesDay = document.querySelectorAll(".historyDate");

  for (let i = 0; i < allHistory.length; i++) {
    if (allLesDay[i + 1] != undefined) {
      if (allLesDay[i].innerText == allLesDay[i + 1].innerText) {
        allLesDay[i + 1].classList.add("classHide");
        allHistory[i].classList.add("removeMargin");
      }
    }
  }
};

const fetchMoreClient = () => {
  startingIndex += 10;
  endingIndex += 10;
  displayHistory(clientDataArr.slice(startingIndex, endingIndex));
  if (clientDataArr.length <= endingIndex) {
    showMoreButton.classList.add("classHide");
    innerHistory.style.marginBottom = "50px";
  }
};

showMoreButton.addEventListener("click", fetchMoreClient);
