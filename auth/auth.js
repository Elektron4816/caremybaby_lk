// import connect from "../node_modules/connect/index.js";
import "../index.css";
import "./auth.css";

import "../component/fixConsoleLog.js";
import {
  validNumberFromGet,
  showAlert,
} from "../component/functionFromExport.js";

import logo from "../image/logo.svg";

document.getElementById("logo").src = logo;

let input = document.getElementById("phoneNumber");
let iti = 0;

const form = document.querySelector("#login");
const message = document.querySelector("#message");
const showCheckField = document.getElementById("checkField");
const WebApp = window.Telegram.WebApp;

const displayPreloader = document.querySelector(".preloader");
const getMainClass = document.querySelector(".main");

let chatId = WebApp.initDataUnsafe.user.id; // id чата tg клиента

const randCheckCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
const getCheck = document.getElementById("btn");
let letPhoneNumber = "";

let PhoneClient = "";
const checkCode = document.getElementById("sendCode");

if (window.location.pathname == "/auth/") {
  WebApp.BackButton.show();
}

// displayPreloader.style.display = "flex";
// getMainClass.style.filter = "blur(5px)";

window.onload = () => {
  displayPreloader.style.display = "none";
  getMainClass.style.filter = "none";
  console.log("done");
};

WebApp.onEvent("backButtonClicked", function () {
  if (window.location.pathname != "/schedule/") {
    history.back();
  }
  WebApp.BackButton.hide();
});

if (showCheckField != null) {
  showCheckField.addEventListener("input", function (e) {
    var inp = event.target;
    var inps = this.querySelectorAll("input");
    var value = Array.prototype.map.call(inps, (x) => x.value).join("");
    var i = +inp.dataset.start + inp.selectionStart,
      pos = value.length;

    for (var q = 0; q < inps.length; ++q) {
      var start = +inps[q].dataset.start,
        len = +inps[q].dataset.len;
      inps[q].value = value.substr(start, len);

      if (start + len >= i) {
        inp = inps[q];
        pos = i - start;
        i = NaN;
      }
    }

    inp.focus();
    inp.selectionStart = inp.selectionEnd = pos;
  });
}
// const output = document.querySelector(".iti");

if (input != null) {
  input.addEventListener("paste", function () {
    input.value = "";
  });

  iti = intlTelInput(input, {
    nationalMode: false,
    initialCountry: "auto",
    strictMode: true,
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
  input.addEventListener("paste", function () {
    setTimeout(() => {
      iti.setNumber(input.value, { nationalMode: true });
    }, 50);
  });
}

// let resultBoolCheckCode = false;

function sendCheckCode(callback) {
  displayPreloader.style.display = "flex";
  getMainClass.style.filter = "blur(5px)";
  fetch("/sendcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ codeFromClient: randCheckCode, chatId: chatId }),
  })
    .then((res) => res.json())
    .then((data) => {
      displayPreloader.style.display = "none";
      getMainClass.style.filter = "none";
      if (callback) {
        callback(data);
      }
      if (data.ok) {
        message.textContent = "Подтверждение кода отправлено";
      } else {
        message.innerHTML = `Пользователь не авторизован в <a href="https://t.me/caremybot" target="_blank" rel="noopener" class="tooltip">боте</a>`;
      }
    })
    .catch((err) => {
      console.log(err);
      message.textContent = "Возникла ошибка при отправке кода";
    });
}

// обратный отсчет на повторную отправку проверочного кода

if (checkCode != null) {
  checkCode.setAttribute("disabled", "");
  checkCode.style.cursor = "not-allowed";
}
function timerCountDown() {
  let time = 60;
  const timer = setInterval(() => {
    let timedown = document.getElementById("countdown");
    if (time === 0) {
      timedown.innerText = "";
      checkCode.removeAttribute("disabled");
      checkCode.style.cursor = "pointer";
      clearInterval(timer);
    } else {
      timedown.innerText = time--;
    }
  }, 1000);
}
// }
const sendCheckCodeButton = document.getElementById("sendCode");

if (sendCheckCodeButton != null) {
  sendCheckCodeButton.addEventListener("click", () => {
    sendCheckCode();
    checkCode.setAttribute("disabled", "");
    timerCountDown();
  });
}

function vaildNumber(phoneNumber) {
  // преобразование введенного номера телефона в нормальный формат
  let result;
  let nums = phoneNumber.match(/\d+/g).join("");
  result = "+" + nums;
  return result;
}

function checkPhoneNumber(letPhoneNumber, PhoneClient) {
  letPhoneNumber = vaildNumber(letPhoneNumber);

  if (letPhoneNumber == PhoneClient) {
    return true;
  } else {
    return false;
  }
}

const comparionTgNumberAndYc = (client) => {
  let res = false;

  client.findIndex((element, index) => {
    if (index === 0) {
      chatId = element.tg_id_current_user;

    }

    if (element.tg_phone_plus == PhoneClient) {
      console.log("ok");
      res = true;
    }
  });
  return res;
};

const getClientFunc = (obj, callback) => {
  fetch("/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem(
        "clientGroupId",
        data[0].client_group_id_wout_letter,
      );
      if (callback) {
        callback(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

if (getCheck != null) {
  getCheck.addEventListener("click", (e) => {
    // отправка формы
    e.preventDefault();
    if (!iti.isValidNumber() || input.value <= 0) {
      message.innerHTML = "Неверный номер телефона"; // если номер телефона не корректный
      input.style.border = "1px solid red";
      message.classList.add("errText");
      displayPreloader.style.display = "none";
      getMainClass.style.filter = "none";
      return;
    }
    letPhoneNumber = document.querySelector(
      ".iti__selected-dial-code",
    ).innerText;
    letPhoneNumber += document.getElementById("phoneNumber").value;

    let phoneNumberFromGet = validNumberFromGet(letPhoneNumber);

    const objectClient = {};
    objectClient["clientPhone"] = phoneNumberFromGet;
    objectClient["chatId"] = chatId;

    // objectClient["clientGroupId"] = clientGroupId;
    displayPreloader.style.display = "flex";
    getMainClass.style.filter = "blur(5px)";
    getClientFunc(objectClient, (data) => {
      // checkPhoneFromTgAndLk = comparionTgNumberAndYc(data);
      PhoneClient = data[0].client_phone;
      displayPreloader.style.display = "none";
      getMainClass.style.filter = "none";
      message.classList.remove("errText");
      message.textContent = "";
      input.style.border = "none";

      if (checkPhoneNumber(letPhoneNumber, PhoneClient)) {
        if (!comparionTgNumberAndYc(data)) {
          sendCheckCode((data) => {
            // console.log("callback", data);
            if (data.ok) {
              clientIsLogin(validNumberFromGet(letPhoneNumber), "confirm", WebApp.initDataUnsafe.user.id)
              showCheckField.style.display = "block";
              getCheck.style.display = "none";
              getMainClass.style.filter = "none";
              timerCountDown();
            } else {
              clientIsLogin(validNumberFromGet(letPhoneNumber), "user_unauth", WebApp.initDataUnsafe.user.id)
            }
          });
        } else {
          // fetch(`/loginHash?phone=${validNumberFromGet(letPhoneNumber)}`)
          // .then((responce) => responce.text())
          // .then((data) => {
          //   console.log(data);
          // })
          clientIsLogin(validNumberFromGet(letPhoneNumber), "auth", WebApp.initDataUnsafe.user.id);
          localStorage.setItem("phoneNumber", `${letPhoneNumber}`);
          form.submit();
          window.location.href = "/";
        }
      } else {
        e.preventDefault(); // если номер телефона не найден в базе
        clientIsLogin(validNumberFromGet(letPhoneNumber), "user_unexist", WebApp.initDataUnsafe.user.id)
        showAlert(
          "Вы не зарегистрированы, проверьте введеный номер телефона или обратитесь к менеджеру",
        );
      }
    });
  });
}

function clientIsLogin(phone, string, tgId) {
  fetch("/isLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientPhone: phone, type: string, tgId: tgId }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
}

// function clientError(phone, string, idTg) {
//   fetch("/isLogin", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ clientPhone: phone, type: "error", error: string, tgId: idTg }),
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       console.log(data);
//     })

// }

function checkCodeValid() {
  // проверка проверочного кода
  // получаем данные из полей ввода
  const checkInput1 = document.getElementById("checkInput1").value;
  const checkInput2 = document.getElementById("checkInput2").value;
  const checkInput3 = document.getElementById("checkInput3").value;
  const checkInput4 = document.getElementById("checkInput4").value;

  let chIn1 = Math.floor(randCheckCode / 1000);
  let chIn2 = Math.floor((randCheckCode / 100) % 10);
  let chIn3 = Math.floor((randCheckCode / 10) % 10); // в эти переменные получим из кода который отправили
  let chIn4 = Math.floor(randCheckCode % 10);

  if (
    checkInput1 == chIn1 &&
    checkInput2 == chIn2 &&
    checkInput3 == chIn3 &&
    checkInput4 == chIn4
  ) {
    return true;
  } else {
    return false;
  }
}

const sendForm = document.getElementById("confirm");

if (sendForm != null) {
  sendForm.addEventListener("click", (e) => {
    e.preventDefault();
    if (checkCodeValid()) {
      clientIsLogin(validNumberFromGet(letPhoneNumber));
      localStorage.setItem("phoneNumber", letPhoneNumber);
      form.submit();
      window.location.href = "/";
    } else {
      showAlert("Неверный код");
    }
  });
}
