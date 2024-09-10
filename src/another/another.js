import "./another.css";
import "../index.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/displayBalance.js";
import "../component/checkAuth.js";
import {
  showAlert,
  validNumberFromGet,
} from "../component/functionFromExport.js";

import autosize from "/node_modules/autosize/src/autosize.js";

import chevronRight from "../image/chevron-right.svg";
import creditCard from "../image/credit-card-2-back.svg";
import insta from "../image/instagram.svg";
import youtube from "../image/youtube.svg";
import vk from "../image/vk.svg";
import telegram from "../image/telegram.svg";
import copy from "../image/copy.svg";
import closeCross from "../image/Union.svg";
import threeDots from "../image/three-dots-1.svg";
import chatDots from "../image/chat-dots-1.svg"
import closeCrossRed from "../image/Subtract.svg";
import gift from "../image/gift.svg";

// import { send } from "process";

document.getElementById("threeDotsIcon").src = threeDots;
document.getElementById("chevronRight").src = chevronRight;
document.getElementById("creditCard").src = creditCard;
document.getElementById("insta").src = insta;
document.getElementById("youtube").src = youtube;
document.getElementById("vk").src = vk;
document.getElementById("telegram").src = telegram;
//document.getElementById("copy").src = copy;
document.getElementById("chatDots").src = chatDots;
document.getElementById("closeErrorBackButton").src = closeCross;
document.getElementById("gift").src = gift;

let WebApp = window.Telegram.WebApp;
WebApp.BackButton.hide();

const showPopUpPromoButton = document.querySelector(".fieldPromo");
const popUpPromo = document.getElementById("referrerPromo");

const closePromoButton = document.getElementById("closePromoButton");
closePromoButton.src = closeCross;

let storageClientPhone = localStorage.getItem("phoneNumber");

let clientYcId = "";

let sendClient;

const toSearch = location.search;

fetch(`/search${toSearch}`)
  .then((responce) => responce.json())
  .then((data) => {
    if (data.responce) {
      showFourthMain.click();
      history.pushState({}, '', location.pathname);
    }
  })

const countInvite = document.getElementById("countInvite");
const payFriend = document.getElementById("payFriend");
const bonusAmount = document.getElementById("bonusAmount");

if (storageClientPhone !== null && storageClientPhone !== "n/a") {
  storageClientPhone = validNumberFromGet(storageClientPhone);

  setTimeout(() => {
    fetch("/client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientPhone: storageClientPhone }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendClient = data;
        countInvite.innerText = data[0].ref_invited;
        payFriend.innerText = data[0].ref_completed;
        bonusAmount.innerText = data[0].ref_bonuses;
        clientYcId = data[0].client_yc_id;
        copyPromo.innerText = data[0].referrer;
      });
  }, 200);
}

showPopUpPromoButton.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=another&object=open_bonus_input&client_id=${clientYcId}`;
  fetch(getUrl);
  popUpPromo.style.display = "flex";
});

popUpPromo.addEventListener("click", (e) => {
  if (e.target.id === "referrerPromo") {
    popUpPromo.style.display = "none";
  }
});

closePromoButton.addEventListener("click", () => {
  popUpPromo.style.display = "none";
});

const innerPromoBanners = document.querySelector(".innerPromo");

fetch("/banners")
  .then((res) => res.json())
  .then((data) => {
    displayBanners(data);
  });

const displayBanners = (data) => {
  let innerP = "";
  data.forEach(({ name, src, about, button }, index) => {
    if (about === null) {
      innerP = "";
    } else {
      innerP = `<p class="tooltip">${about}</p>`;
    }

    let innerButton = "";
    if (button !== undefined) {
      innerButton = `<a href=${button.url} target=${button.target}><button class="smallBtn">${button.name}</button></a>`;
    }

    innerPromoBanners.innerHTML += `
    <div class="slide" style="background-image: url('${src}');">
    <h2 class="h3Ower">${name}</h2>
    ${innerP}
    <!-- ${innerButton} -->
  </div>`;
  });
};

const openPromoMore = document.getElementById("pickPromo");
const firstFieldMain = document.getElementById("firstMain");
const secondFieldMain = document.getElementById("secondMain");

openPromoMore.addEventListener("click", () => {
  WebApp.BackButton.show();
  firstFieldMain.classList.add("classHide");
  secondFieldMain.classList.remove("classHide");
});

WebApp.BackButton.onClick(() => {
  firstFieldMain.classList.remove("classHide");
  secondFieldMain.classList.add("classHide");
  fourthMain.classList.add("classHide");
  errMessForm.innerText = "";
  formForm.style.border = "none";
  WebApp.BackButton.hide();
});

const openRefProgram = document.getElementById("pickRefProgram");
const thirdFieldMain = document.getElementById("thirdMain");

openRefProgram.addEventListener("click", () => {
  if (storageClientPhone == null || storageClientPhone == "n/a") {
    window.location.href = "/auth";
  } else {
    WebApp.BackButton.show();
    firstFieldMain.classList.add("classHide");
    thirdFieldMain.classList.remove("classHide");
  }
});

WebApp.BackButton.onClick(() => {
  firstFieldMain.classList.remove("classHide");
  thirdFieldMain.classList.add("classHide");
  WebApp.BackButton.hide();
});

const fieldCopyPromo = document.querySelector(".fieldCopyPromo");
const copyPromo = document.getElementById("selfPromo");
const copyPromoText = document.getElementById("selfPromoText");

let isInIframe;

try {
  isInIframe = window.self !== window.top;
} catch (e) {
  isInIframe = true;
}

if (!isInIframe) {
  console.info(isInIframe);
  const innerLabel = document.createElement("img");
  innerLabel.id = "copy";
  innerLabel.alt = "copy";
  innerLabel.src = copy;

  fieldCopyPromo.appendChild(innerLabel);
  fieldCopyPromo.style.cursor = "pointer";

  fieldCopyPromo.addEventListener("click", function () {
    navigator.clipboard
      .writeText(copyPromoText.innerText.replace(/\n/g, '') + ' ' + '\n\n' + copyPromo.innerText + '\n\n' + 'Присоединяйся!')
      .then(function () {
        showAlert("Скопировано");
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  });
}





const shareButton = document.getElementById("share");



let shareData = {
  title: "MDN",
  text: "Learn web development on MDN!",
};

if (!navigator.canShare) {
  shareButton.classList.add("classHide");
  fieldCopyPromo.style.marginBottom = "32px";
  console.log("navigator.canShare() not supported.");
} else if (navigator.canShare(shareData)) {
  console.log("navigator.canShare() supported. We can use navigator.share() to send the data.");
} else {
  shareButton.classList.add("classHide");
  fieldCopyPromo.style.marginBottom = "32px";
  console.log("Specified data cannot be shared.");
}

shareButton.addEventListener("click", async () => {

  let textToCopy = copyPromo.innerText;

  const shareData = {
    // title: "CMB",
    text: `Задача организации, в особенности же начало повседневной работы по формированию позиции позволяет выполнять важные задания по разработке существенных финансовых и административных условий. \n\n${textToCopy}\n\n Присоединяйтесь!`,
    // url: textToCopy,
  };

  try {
    await navigator.share(shareData);
    console.info("shared successfully");
  } catch (err) {
    console.info(err);
  }
});

const activPromo = document.getElementById("activationPromoBtn");
const fieldPromo = document.querySelector(".MyInput");

const errMessage = document.getElementById("errMessBonus");

fieldPromo.addEventListener("focus", () => {
  errMessage.innerText = "";
  fieldPromo.style.border = "none";
});

const displayPreloader = document.querySelector(".preloader");
const getReferrerPromo = document.getElementById("referrerPromo");
const getMainClass = document.querySelector(".main");

activPromo.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=schedule&object=activate_promo&promocode=${fieldPromo.value}&client_id=${clientYcId}`;
  fetch(getUrl);

  if (fieldPromo.value.length < 1) {
    errMessage.innerText = "Обязательное поле";
    fieldPromo.style.border = "1px solid red";
    return;
  }

  displayPreloader.style.display = "flex";
  getReferrerPromo.style.filter = "blur(5px)";
  getMainClass.style.filter = "blur(5px)";

  fetch("/promo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ promo: fieldPromo.value, client: clientYcId }),
  })
    .then((response) => response.json())
    .then((data) => {

      displayPreloader.style.display = "none";
      getReferrerPromo.style.filter = "";
      getMainClass.style.filter = "";
      if (data.status === 404) {
        errMessage.innerText = "Неверный код";
        fieldPromo.style.border = "1px solid red";
        // showAlert("Неверный код");
      }
      if (data.status === 409) {
        errMessage.innerText = "Промокод уже активирован";
        fieldPromo.style.border = "1px solid red";
        // showAlert("Неверный код");
      }
      if (data.status === 200) {
        fieldPromo.value = "";
        popUpPromo.style.display = "none";
        showAlert("Промокод активирован");
      }
    });
});


const fourthMain = document.getElementById("fourthMain");
const showFourthMain = document.getElementById("anyFeadback");

const sendFeadBack = document.getElementById("sendFeadBack");
const formForm = document.getElementById("message");
const errMessForm = document.getElementById("errMessForm");

showFourthMain.addEventListener("click", () => {
  const getUrl = `/itemsMetrika?location=main-feedback&object=open_main_feedback&source=another&client_id=${clientYcId}`
  fetch(getUrl);
  WebApp.BackButton.show();
  firstFieldMain.classList.add("classHide");
  fourthMain.classList.remove("classHide");
  formForm.value = "";
});

sendFeadBack.addEventListener("click", (e) => {

  const getUrl = `/itemsMetrika?location=main-feedback&object=send_main_feedback&source=another&client_id=${clientYcId}`
  fetch(getUrl);

  e.preventDefault();
  if (formForm.value.length < 1) {
    errMessForm.innerText = "Введите сообщение";
    formForm.style.border = "1px solid red";
    return;
  }

  errMessForm.innerText = "";
  formForm.style.border = "none";

  const formFeadback = document.getElementById("anyFeadbackForm");

  const newFrom = new FormData(formFeadback);
  const sendObject = {}
  newFrom.forEach((value, key) => {
    sendObject[key] = value;
  })

  fetch("/upload", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      type: "feedback_message",
      messege: sendObject,
      base64: "None",
      client: sendClient,
    })
  })
    .then((response) => response.text())
    .then((data) => {

      if (data === "success") {
        showAlert("Спасибо за отзыв!");
        document.getElementById("anyFeadbackForm").reset();
      }
    })
    .catch((error) => console.log(error));
})

autosize(document.getElementById("message"));
autosize(document.getElementById("textArea"));

const removeImg = () => {
  const removeAllImege = document.querySelectorAll(".removeImageDiv");
  if (removeAllImege != null) {
    for (let i = 0; i < removeAllImege.length; i++) {
      removeAllImege[i].remove();
    }
  }
}


const sendError = document.getElementById("sendError");
const showReferrerErrorBack = document.getElementById("referrerErrorBack");
const sendErrorBackBtn = document.getElementById("sendErrorBackBtn");
const textArea = document.getElementById("textArea");
const fileInput = document.getElementById("file");
const closeErrorBackButton = document.getElementById("closeErrorBackButton");
const showErr = document.getElementById("err");


sendError.addEventListener("click", () => {
  showReferrerErrorBack.style.display = "flex";

});


showReferrerErrorBack.addEventListener("click", (e) => {
  if (e.target.id == "referrerErrorBack") {
    showReferrerErrorBack.style.display = "none";
    textArea.value = "";
    fileInput.value = "";
    showErr.innerText = "";
    textArea.style.border = "none";
    removeImg();
  }
})

closeErrorBackButton.addEventListener("click", () => {
  showReferrerErrorBack.style.display = "none";
  textArea.value = "";
  fileInput.value = "";
  showErr.innerText = "";
  textArea.style.border = "none";

  removeImg();
})

const removeImageButton = () => {
  const removeImageDiv = document.querySelectorAll(".removeImageDiv");
  let removeImageButton = document.querySelectorAll(".removeImage");



  for (let i = 0; i < removeImageButton.length; i++) {

    removeImageButton[i].addEventListener("click", () => {
      removeImageDiv[i].remove();
    })

  }

}


let sendFiles = [];

function previewFiles() {

  const preview = document.querySelector(".input-file-list");
  const files = document.querySelector("input[type=file]").files;

  function readAndPreview(file) {
    // Проверяем, что `file.name` соответствует необходимым расширениям
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {

        const div = document.createElement("div");
        // const img = document.createElement("img");
        div.classList.add("removeImageDiv");
        // img.src = closeCrossRed;
        // img.style.height = "20px";
        // img.classList.add("removeImage");
        // div.appendChild(img);
        div.style.backgroundImage = `url(${reader.result})`;
        div.innerHTML = `<img src=${closeCrossRed} class="removeImage"/>`;
        div.id = file.name;
        // const image = new Image();
        // image.width = 170;
        // image.title = file.name;
        // image.src = reader.result;
        // // image.id = "needRemove";
        // image.classList.add("removeIt");
        // // div.appendChild(image);
        preview.appendChild(div);

      });

      reader.readAsDataURL(file);
    }
  }

  if (files) {
    Array.prototype.forEach.call(files, readAndPreview);

    setTimeout(() => {
      removeImageButton();
    }, 200)
  }

}

const picker = document.getElementById("file");
picker.addEventListener("change", previewFiles);

sendErrorBackBtn.addEventListener("click", (e) => {
  e.preventDefault();


  if (textArea.value.length <= 0) {
    showErr.innerText = "Обязательное поле";
    textArea.style.border = "1px solid red";
    return;
  }

  displayPreloader.style.display = "flex";
  showReferrerErrorBack.style.filter = "blur(5px)";
  getMainClass.style.filter = "blur(5px)";

  const allImg = document.querySelectorAll(".removeImageDiv");

  for (let i = 0; i < allImg.length; i++) {
    sendFiles[i] = { base: allImg[i].style.backgroundImage.split(",")[1], name: allImg[i].id }
  }

  // imgBase64.forEach((name, index) => {
  //   sendFiles[index] = { base: name, name: sssss[index].name };
  // });

  fetch("/upload", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      type: "error_message",
      messege: textArea.value,
      base64: sendFiles,
      client: sendClient,
    })
  })
    .then((response) => response.text())
    .then((data) => {


      displayPreloader.style.display = "none";
      showReferrerErrorBack.style.filter = "none";
      getMainClass.style.filter = "none";

      if (data === "success") {
        showAlert("Спасибо!");
        // document.getElementById("anyFeadbackForm").reset();
        showReferrerErrorBack.style.display = "none";
        textArea.value = "";
        fileInput.value = "";
        removeImg();
        // imgBase64 = [];
        showErr.innerText = "";
        textArea.style.border = "none";
      } else {
        showAlert("Ошибка, попробуйте позднее");
      }


    })
    .catch((error) => console.log(error));
})


const allLabel = document.querySelectorAll(".clickLabel");

for (let i = 0; i < allLabel.length; i++) {
  allLabel[i].addEventListener("click", () => {
    const getUrl = `/itemsMetrika?location=main-feedback&object=select_point&source=another&client_id=${clientYcId}`
    fetch(getUrl);
  })
}