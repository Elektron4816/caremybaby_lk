import "../../index.css";
import "./paymentError.css";
import "../../component/Navbar.js";

import subtract from "../../image/Subtract.svg";
document.getElementById("subtract").src = subtract;

const btnBack = document.querySelector(".btnBack");

const hideBtn = document.getElementById("hideIfNotTg");

btnBack.addEventListener("click", () => {
  window.location.href = "../";
});
let tg = window.Telegram.WebApp;

try {
  tg.initDataUnsafe.user.id;
  // document.getElementById("test").innerHTML = "через телеграм";
} catch (_) {
  document.querySelector(".navbar").style.display = "none";
  const hideMes = document.getElementById("support");
  if (hideMes) {
    hideMes.style.display = "none";
  }
  const btn = document.querySelector(".btnBack");
  btn.style.display = "none";
  const innerElement = document.createElement("h1");
  innerElement.innerHTML = "Для дальнейшей работы вернитесь в Telegram";
  innerElement.classList.add("link");
  if (hideBtn != null) {
    hideBtn.appendChild(innerElement);
    hideBtn.style.display = "block";
  }
  // document.getElementById("test").innerHTML = "через сайт";
}


function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    transaction_id: params.get('id'),
    operation: params.get('operation'),
    reference: params.get('reference'),
    code: params.get('code'),
  };
}

const dataSuccess = getQueryParams();
dataSuccess.status = "FAILURE";
console.log(dataSuccess);

fetch("/paymentStatus", {

  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(dataSuccess),
})
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })