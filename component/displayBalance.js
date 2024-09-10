import { validNumberFromGet } from "./functionFromExport.js";

const displayName = document.getElementById("displayName");
const circleName = document.querySelector(".circleName");
const displayHeaderRub = document.getElementById("headerRub");
const displayHeaderEuro = document.getElementById("headerEuro");
const displayBodyRub = document.getElementById("displayBobyRub");
const displayBodyEuro = document.getElementById("displayBodyEuro");
const displayBodyBonus = document.getElementById("BodyBonus");
const GoToProfileButton = document.querySelector(".header2");

const innerAvatar = document.querySelector(".circle");

let clientPhone = localStorage.getItem("phoneNumber");

let clientGroupId = localStorage.getItem("clientGroupId");
let WebApp = window.Telegram.WebApp;
let chatId = WebApp.initDataUnsafe.user.id; // id чата tg клиента
//let chatId = "456072370";
let clientYcId;
const goToPay = document.querySelector(".balanceHeader");

goToPay.addEventListener("click", () => {
  window.location.href = "/pay";
})


if (clientPhone != "n/a" && (clientPhone != undefined || clientPhone != null)) {
  clientPhone = validNumberFromGet(clientPhone);

  const objectClient = {};
  objectClient["clientPhone"] = clientPhone;
  objectClient["chatId"] = chatId;
  objectClient["clientGroupId"] = clientGroupId;

  fetch("/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objectClient),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      checkClientId(data);
      clientYcId = data[0].client_yc_id;
      displayClienName(data);
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    fetch("/valute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectClient),
    })
      .then((res) => res.json())
      .then((data) => {
        displayValuteAmount(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, 100);

}

function checkClientId(data) {
  let cliendIdToLocal = data[0].client_group_id_wout_letter;
  let nowLocalClientId = localStorage.getItem("clientGroupId");

  if (cliendIdToLocal != nowLocalClientId) {
    localStorage.setItem("clientGroupId", cliendIdToLocal);
    location.reload();
  }
}

let flag = false;

const displayValuteAmount = (amount) => {
  amount.forEach(({ client_valute, balance_valute }, index) => {
    if (client_valute == "руб") {
      displayHeaderRub.innerText = balance_valute;
      if (displayBodyRub !== null) {
        displayBodyRub.innerText = balance_valute;
      }

      if (displayBodyBonus != null && !flag) {
        displayBodyBonus.innerText += " ₽";
        flag = true;
      }
    }
    if (client_valute == "евро") {
      displayHeaderEuro.innerText = balance_valute;
      if (displayBodyEuro !== null) {
        displayBodyEuro.innerText = balance_valute;
      }
      if (displayBodyBonus != null && !flag) {
        displayBodyBonus.innerText += " €";
        flag = true;
      }
    }
  });
};

const displayClienName = (amount) => {
  amount.forEach(({ client_name, bonuses }, index) => {
    if (index === 0) {
      if (client_name !== undefined) {
        // const match = client_name.match(/(?<=)[А-Яа-яa-zA-Z,ё,Ё]+$/g);
        const match = client_name.match(/[А-Яа-яa-zA-Z,ё,Ё]+$/g);
        displayName.innerText = match[0];
        if (localStorage.getItem("avatar") === null) {
          circleName.innerText = match[0].slice(0, 1);
        } else {
          innerAvatar.style.backgroundImage = localStorage.getItem("avatar");
        }

        if (displayBodyBonus != null) {
          if (bonuses != null) {
            displayBodyBonus.innerText = bonuses;
          } else {
            displayBodyBonus.innerText = "0";
          }
        }
      }
    }
  });
};

GoToProfileButton.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=profile&object=open_profile&client_id=${clientYcId}`
  fetch(getUrl);
  window.location.href = "/profile";
});
