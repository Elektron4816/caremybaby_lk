import "../index.css";
import "./profile.css";

import { showAlert, validNumberFromGet } from "../component/functionFromExport.js";
import "../component/fixConsoleLog.js";

import uploadImg from "../image/icon.svg";
import closeBtn from "../image/Union.svg"

document.getElementById("closeBtn").src = closeBtn;
document.getElementById("uploadImg").src = uploadImg;

const logOutButton = document.getElementById("logOut");

const displayName = document.getElementById("clientNameProfile");
const circleName = document.getElementById("profileImg");
const displayId = document.getElementById("clienIdProfile");
const lessonsMinutes = document.getElementById("lessonsMinutes");
const clientVisit = document.getElementById("clientVisit");
const amountAvarage = document.getElementById("amountAvarage");
const bonusesGet = document.getElementById("bonusesGet");

let clientPhone = localStorage.getItem("phoneNumber");

const WebApp = window.Telegram.WebApp;
WebApp.BackButton.show();

let chatId = WebApp.initDataUnsafe.user.id; // id чата tg клиента
// let chatId = "456072370";
let flagBackButton = true;
let flagAvatar = true;
let clientYcId = "";

clientPhone = validNumberFromGet(clientPhone);

const firstMain = document.getElementById("firstMain");
const picker = document.getElementById("file");

// WebApp.BackButton.hide();

WebApp.BackButton.onClick((e) => {
  if (flagBackButton) {
    history.back();
    WebApp.BackButton.hide();
  } else {
    picker.value = '';
    fileName = "";
    document.getElementById('avatar').remove();
    document.querySelector(".cropper-container").remove();
    avatarWindow.classList.add("classHide");
    firstMain.classList.remove("classHide");
    flagBackButton = true;
  }

});


const innerAvatar = document.querySelector(".circelProfile");




function getAvatar(clientYcId, callback) {
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
        // document.getElementById("avatar").src = `data:image/png;base64,${data[0].avatar}`;
        innerAvatar.style.backgroundImage = `url(${data.url})`;
        localStorage.setItem("avatar", `url(${data.url})`);
        flagAvatar = false;
      }
      if (callback) {
        callback(data);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}



fetch("/client", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    chatId: chatId,
    clientPhone: clientPhone,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    clientYcId = data[0].client_yc_id;
    // console.info(localStorage.getItem("avatar"));
    // if (localStorage.getItem("avatar") === null) {
    getAvatar(clientYcId, () => {
      displayClienName(data);
      innerAvatar.style.backgroundImage = localStorage.getItem("avatar");
    })

    // } else {
    //   innerAvatar.style.backgroundImage = localStorage.getItem("avatar");
    //   flagAvatar = false;
    //   displayClienName(data);
    // }

  })
  .catch((err) => {
    console.log(err);
  });

const displayClienName = (amount) => {
  amount.forEach(
    (
      {
        client_name,
        client_group_id_wout_letter,
        amount_average,
        bonuses_get,
        lessons_minutes,
        client_visit_count,
      },
      index,
    ) => {
      if (index === 0) {
        if (client_name !== undefined) {
          const match = client_name.match(/[А-Яа-яa-zA-Z,ё,Ё]+$/g);

          displayName.innerText = match[0];
          if (flagAvatar) {
            circleName.innerText = match[0].slice(0, 1);
          }
          displayId.innerText = client_group_id_wout_letter;
          lessonsMinutes.innerText = `${lessons_minutes} мин`;
          clientVisit.innerText = `${client_visit_count}`;
          amountAvarage.innerText = `${amount_average} мин`;
          bonusesGet.innerText = bonuses_get;
        }
      }
    },
  );
};

// import avatar from "../image/avatar/IMG_0705.jpeg"

const avatarWindow = document.getElementById("uploadAvatar");

const displayPreloader = document.querySelector(".preloader");

const showPreviewAvatar = document.getElementById("showPreview");
const closePreviewAvatar = document.getElementById("closeBtn");
const closePreviewAvatarButton = document.getElementById("acceptAvatar");

const saveAvatar = document.getElementById("saveAvatar");

let fileName = "";
let getCropper;

function previewFiles() {
  const files = document.querySelector("input[type=file]").files;
  fileName = files[0].name;
  const innerImg = document.querySelector(".resizerDemo");

  function readAndPreview(file) {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.id = "avatar";
        innerImg.appendChild(img);
        console.log(img);
        // document.getElementById("avatar").src = reader.result;
        getCropper = cropperFunction();
      });

      reader.readAsDataURL(file);
    }
  }

  if (files) {
    Array.prototype.forEach.call(files, readAndPreview);

  }

}

function cropperFunction() {
  const image = document.getElementById('avatar');
  const cropper = new Cropper(image, {
    aspectRatio: 1,
    viewMode: 1,
    zoomOnWheel: false,
    ready() {
      this.cropper.setDragMode("none");
    }
  });
  setTimeout(() => {
    avatarWindow.style.filter = "none";
    displayPreloader.style.display = "none";
  })
  return cropper;
}

picker.addEventListener("change", () => {
  previewFiles();
  avatarWindow.style.filter = "blur(5px)";
  displayPreloader.style.display = "flex";
  avatarWindow.classList.remove("classHide");
  firstMain.classList.add("classHide");
  flagBackButton = false;
});

saveAvatar.addEventListener("click", () => {
  avatarWindow.style.filter = "blur(5px)";
  displayPreloader.style.display = "flex";
  const array = [];
  let croppedCanvas = getCropper.getCroppedCanvas();
  let roundedCanvas = getRoundedCanvas(croppedCanvas);
  let base64Img = roundedCanvas.toDataURL().split(",")[1];
  array.push({ base: base64Img, title: fileName });
  fetch("/uploadAvatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientPhone: clientPhone,
      clientYcId: clientYcId,
      avatar: array,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // showAlert("Успешно.");
        setTimeout(() => {
          location.reload();
        }, 1700);
      } else {
        showAlert("Возникла ошибка, попробуйте позднее.");
      }
    })
    .catch((err) => {
      console.log(err);
    });

});

document.getElementById("previewAvatar").addEventListener("click", () => {
  showPreviewAvatar.style.display = "flex";
  let croppedCanvas = getCropper.getCroppedCanvas();
  let roundedCanvas = getRoundedCanvas(croppedCanvas);
  // console.log(roundedCanvas.toDataURL());
  document.getElementById("previewImg").style.backgroundImage = `url(${roundedCanvas.toDataURL()})`;
});


closePreviewAvatar.addEventListener("click", () => {
  showPreviewAvatar.style.display = "none";
})

closePreviewAvatarButton.addEventListener("click", () => {
  showPreviewAvatar.style.display = "none";
})

showPreviewAvatar.addEventListener("click", (e) => {
  if (e.target.id === "showPreview") {
    showPreviewAvatar.style.display = "none";
  }
})


function getRoundedCanvas(sourceCanvas) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var width = sourceCanvas.width;
  var height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
  context.fill();
  return canvas;
}




//Выход из ЛК
logOutButton.addEventListener("click", () => {
  localStorage.setItem("clientGroupId", "n/a");
  localStorage.setItem("phoneNumber", "n/a");
  localStorage.removeItem("avatar");
  window.location.href = "/";
});
