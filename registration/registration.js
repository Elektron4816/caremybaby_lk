import "../index.css"
import "./registration.css"
import logo from "../image/logo.svg"

document.getElementById("logo").src = logo;

import "../component/fixConsoleLog.js";

import { showAlert } from "../component/functionFromExport.js";

const WebApp = window.Telegram.WebApp;

WebApp.BackButton.show();

WebApp.onEvent("backButtonClicked", function () {
    history.back();
    WebApp.BackButton.hide();
});

const sendButton = document.getElementById("sendButton");
const nameClientField = document.getElementById("nameClient");



let chatId = WebApp.initDataUnsafe.user.id;

const inputNumber = document.getElementById("numberFromTg");
inputNumber.disabled = true;
console.log(inputNumber.disabled);
fetch("/client", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        chatId: chatId,
    }),
})
    .then((response) => response.json())
    .then((data) => {

        displayClientPhone(data);
    })
    .catch((err) => {
        console.log(err);
    });

const displayClientPhone = (client) => {
    client.forEach(({ tg_phone_plus }) => {
        inputNumber.value = tg_phone_plus;
    });
};

const innerErrMessage = document.getElementById("errMess");

nameClientField.addEventListener("focus", () => {
    innerErrMessage.innerText = "";
    nameClientField.style.border = "none";
});

sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (nameClientField.value < 1) {
        innerErrMessage.innerText = "Введите имя";
        nameClientField.style.border = "1px solid red";
        return;
    }
    fetch("/newclient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: nameClientField.value,
            phone: inputNumber.value,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                showAlert("Вы успешно зарегистрированы. Мы скоро с Вами свяжемся");
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 2000);
            }
            if (
                data.description ==
                "Клиент с указанным телефоном уже существует в базе"
            ) {
                showAlert("Вы уже зарегистрированы, авторизуйтесь");
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 2000);
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
