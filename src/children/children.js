import 'air-datepicker/air-datepicker.css';
import "../index.css";
import "./children.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/fixConsoleLog.js";
import "../component/displayBalance.js";
import "../component/checkAuth.js";
import autosize from "/node_modules/autosize/src/autosize.js";

import AirDatepicker from 'air-datepicker';
import { showAlert } from '../component/functionFromExport.js';


import emoji1 from "../image/emoji-smile-1.svg";
import pencil from "../image/pencil-orange.svg";
import smileFace from "../image/smile_face.svg";
import imgWheel from "../image/wheel_preview.svg";
import closeBtn from '../image/close-filter.svg';

import bunny from "../image/emoji/bunny.svg";
import hamster from "../image/emoji/hamster.svg";
import bear from "../image/emoji/bear.svg";
import cat from "../image/emoji/cat.svg";
import dog from "../image/emoji/dog.svg";
import fox from "../image/emoji/fox.svg";
import frog from "../image/emoji/frog.svg";
import koala from "../image/emoji/koala.svg";
import lion from "../image/emoji/lion.svg";
import octopus from "../image/emoji/octopus.svg";
import pig from "../image/emoji/pig.svg";
import tiger from "../image/emoji/tiger.svg";

document.getElementById("emoji").src = emoji1;
// document.getElementById("change-name").src = pencil;
document.getElementById("smile").src = smileFace;
document.getElementById("wheel").src = imgWheel;
document.getElementById("closePopUp").src = closeBtn;

const WebApp = window.Telegram.WebApp;
WebApp.BackButton.hide();
const clientYcId = localStorage.getItem("_yc_id");
const avatar = document.getElementById("hamtest");

const emojiStore = {
    bunny: bunny,
    hamster: hamster,
    bear: bear,
    cat: cat,
    dog: dog,
    fox: fox,
    frog: frog,
    koala: koala,
    lion: lion,
    octopus: octopus,
    pig: pig,
    tiger: tiger
}

const emojiStoreElement = document.querySelector(".emoji-store-items");
const takeBody = document.getElementsByTagName("body")[0];

Object.entries(emojiStore).forEach(([key, emoji]) => {
    emojiStoreElement.innerHTML += `
        <div class="emoji-store-item" data-name="${key}">
            <img src="${emoji}" alt="emoji" name="${key}" />
        </div>
    `;
});

// const preferBlockContent = [
//     {
//         placeholder: "Важно знать Вашему педагогу",
//         id: "favour-area"
//     },
//     // {
//     //     placeholder: "Страхи",
//     //     id: "fear-area"
//     // },
//     // {
//     //     placeholder: "Как я называю ребёнка (прозвище)",
//     //     id: "nickname-area"
//     // },
//     // {
//     //     placeholder: "Что любит делать",
//     //     id: "like-area"
//     // },
//     // {
//     //     placeholder: "Любимый персонаж",
//     //     id: "idol"
//     // },
//     // {
//     //     placeholder: "Важно знать педагогу",
//     //     id: "import_info"
//     // }
// ]

fetch(`/childApi?request_api=get_child&client_id=${clientYcId}`)
    .then(response => response.json())
    .then((data) => {
        console.info("ребенок", data);
        if (data.length > 0) {
            parseDataChild(data);
        } else {
            document.getElementById("data-child-empty").classList.remove("classHide");
            document.querySelector(".main-title").classList.remove("hide");
        }

    })

let child_index;
function parseDataChild(data) {
    const mainHeight = document.querySelector('.main').getAttribute("data-height");
    const aboutChild = document.querySelector(".child-container-about");
    aboutChild.style.minHeight = `${Number(mainHeight) + 70}px`;
    if (data.length > 1) {
        const title = document.querySelector(".main-title");
        title.classList.remove("hide");
        displayManyChildren(data, () => {
            const AllChildItems = document.querySelectorAll(".child-container-item");

            AllChildItems.forEach((element, index) => {
                element.addEventListener("click", () => {
                    title.classList.add("hide");
                    displayPreferAboutChild(data[index]);
                    child_index = index;
                    aboutChild.classList.remove("classHide");
                    hideBlock();
                    WebApp.BackButton.show();
                    // window.addEventListener('beforeunload', function (event) {
                    //     if (checkChange()) {
                    //         event.preventDefault();
                    //         console.info("ok");
                    //         document.querySelector(".confirm-change").style.display = "flex";
                    //         // return;
                    //     }
                    // });
                })
            })
        });
    } else {
        displayPreferAboutChild(data[0]);
        hideBlock();
        aboutChild.classList.remove("classHide");
    }
}

const allEmoji = document.querySelectorAll(".emoji-store-item");
function checkPickedEmoji() {
    // const allEmoji = document.querySelectorAll(".emoji-store-item");
    allEmoji.forEach(element => {
        if (element.getAttribute("data-name") == avatar.name) {
            element.classList.add("picked-emoji");
        }

        element.addEventListener("click", () => {
            allEmoji.forEach(element => {
                element.classList.remove("picked-emoji");
            })
            element.classList.add("picked-emoji");
        })
    })
}

document.getElementById("apply-emoji").addEventListener("click", () => {
    allEmoji.forEach(element => {
        if (element.classList.contains("picked-emoji")) {
            avatar.name = element.getAttribute("data-name");
            avatar.src = emojiStore[element.getAttribute("data-name")];
            document.querySelectorAll(".small-emoji")[child_index].src = emojiStore[element.getAttribute("data-name")];
        }
    })
    // showAlert("Готово");
    allEmoji.forEach(element => {
        element.classList.remove("picked-emoji");
    })
    aboutContent.classList.remove("classHide");
    aboutEmoji.classList.add("classHide");
})

const aboutContent = document.querySelector(".child-container-about-content");
const aboutEmoji = document.querySelector(".child-container-about-emoji-store");
document.querySelector(".child-container-about-head-change-img").addEventListener("click", () => {
    checkPickedEmoji();
    aboutContent.classList.add("classHide");
    aboutEmoji.classList.remove("classHide");
})

// document.getElementById("change-name").addEventListener("click", () => {
//     const changeName = document.getElementById("child-name");
//     changeName.removeAttribute("disabled");
//     changeName.focus();
// })

// document.getElementById('child-name').addEventListener('input', (event) => {
//     event.target.style.width = event.target.value.length + 1 + 'ch';
// });

// document.getElementById('child-name').addEventListener('blur', (event) => {
//     event.target.setAttribute("disabled", "disabled");
// });

///-------------

const sendButton = document.getElementById("send-child-info");

sendButton.addEventListener("click", () => {
    sendButton.disabled = true;
    sendButton.style.cursor = "not-allowed";
    const birthDate = document.getElementById("date-input").value;
    // const favour = document.getElementById("favour-area").value;
    const nickname = document.getElementById("child-name").value;
    const childId = document.querySelector(".child-container-about").getAttribute("data-id");

    const newChild = {
        request: "post_child",
        client_id: clientYcId,
        child: {
            child_id: childId,
            birthdate: birthDate,
            favour: textAria.value,
            nickname: nickname,
            emoji: avatar.name,
        },
    }

    fetch("/childApi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newChild),
    })
        .then(response => response.json())
        .then(data => {
            // console.info(data);
            sendButton.disabled = false;
            sendButton.style.cursor = "pointer";
            if (data.status) {
                setNewDataOrigin(() => {
                    cancelChangeButton.click();
                    setTimeout(() => {
                        window.location.reload();
                    }, 100)
                });
            } else {
                showAlert("Возникла ошибка попробуйте позднее");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})

function setNewDataOrigin(callback) {
    const allInputs = document.querySelectorAll("input");
    const avatarImg = document.getElementById("hamtest");

    allInputs.forEach(element => {
        element.setAttribute("data-origin", element.value);
    })

    avatarImg.setAttribute("data-origin", avatarImg.name);
    textAria.getAttribute("data-origin", textAria.value);
    showAlert("Изменения сохранены!");
    if (callback) {
        callback();
    }
}


const calendarPicker = new AirDatepicker('#date-input', {
    isMobile: true,
    autoClose: true,
});


function checkChange() {
    const allInputs = document.querySelectorAll("input");
    const avatarImg = document.getElementById("hamtest");
    let result = false;
    allInputs.forEach(element => {
        if (element.value != element.getAttribute("data-origin")) {
            // console.info(true);
            result = true;
        }
    })
    if (avatarImg.name != avatarImg.getAttribute("data-origin")) {
        result = true;
    }
    if (textAria.value != textAria.getAttribute("data-origin")) {
        result = true;
    }

    return result;
}

const acceptChangeButton = document.getElementById("accept-change");
const cancelChangeButton = document.getElementById("cancel-change");

acceptChangeButton.addEventListener("click", () => {
    sendButton.click()
    // setTimeout(() => {
    //     window.location.reload();
    // }, 100);
});
cancelChangeButton.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    changeWindow.style.display = "none";
    returnToMainChildrenPage();
});

const changeWindow = document.querySelector(".confirm-change");

WebApp.BackButton.onClick(() => {
    if (checkChange()) {
        // console.info("ok");
        document.querySelector(".confirm-change").style.display = "flex";
        takeBody.classList.add("removeScrolling");
        return;
    }
    returnToMainChildrenPage();
})

function returnToMainChildrenPage() {
    const takeModalClass = document.querySelector(".child-container-about-content").classList;
    allEmoji.forEach(element => {
        element.classList.remove("picked-emoji");
    })

    if (takeModalClass.length > 1) {
        aboutContent.classList.remove("classHide");
        aboutEmoji.classList.add("classHide");
    } else {
        showBlock();
    }
}

const closeChangeWindow = document.getElementById("closePopUp");

closeChangeWindow.addEventListener("click", () => {
    takeBody.classList.remove("removeScrolling");
    changeWindow.style.display = "none";
});
changeWindow.addEventListener("click", (event) => {

    if (event.target.id === "change-popup") {
        takeBody.classList.remove("removeScrolling");
        changeWindow.style.display = "none";
    }

});

WebApp.onEvent('viewportChanged', () => {
    const test = document.querySelector(".container");
    const getMain = document.querySelector(".main");
    // console.log("data", getMain.getAttribute("data-height"));
    if (WebApp.viewportHeight < getMain.getAttribute("data-height")) {
        test.style.minHeight = WebApp.viewportHeight + window.innerHeight + 100 + "px";
    } else {
        test.style.minHeight = getMain.getAttribute("data-height") + "px";
    }
})

const textAria = document.getElementById("favour-area");
const inputCount = document.getElementById("input-count");
const checkLength = document.getElementById("check-length");
const sendBtn = document.getElementById("send-child-info");
const titleChildName = document.getElementById("child-name");
const dateInput = document.getElementById("date-input");
const needSave = false;

textAria.addEventListener("input", (event) => {
    //console.info(event.target.value);
    const length = event.target.value.length
    inputCount.innerText = length;
    if (length > 255) {
        checkLength.style.color = "red";
        sendBtn.classList.add('disabel');
        sendBtn.disabled = true;
    } else {
        checkLength.style.color = "#999895";
        sendBtn.classList.remove('disabel');
        sendBtn.disabled = false;
    }
})


// -------display function------------


function displayPreferBlock(data, callback) {
    const preferBlock = document.querySelector(".innerPrefer");
    data.forEach(element => {
        preferBlock.innerHTML += `
    <div>
        <div class="text-aria-container">
            <p class="placeholder">${element.placeholder}</p>
            <textarea class="text-aria" id="${element.id}" name="${element.id}"></textarea>
        </div>
        <div id="error-message">
        <p id="check-length"><span id="input-count">0</span> / 250</p>
    </div>
    </div>`;
        if (callback) {
            callback();
        }
    })

}


function displayManyChildren(dataChildren, callback) {
    const innerChildItem = document.querySelector(".child-container-items");
    dataChildren.forEach(element => {

        let name = "";
        if (element.title_name) {
            name = element.title_name;
        } else {
            name = element.insert;
        }

        let img = emojiStore["bunny"];

        if (element.emoji) {
            img = emojiStore[element.emoji];
        }

        innerChildItem.innerHTML += `
        <div class="child-container-item">
            <div class="child-container-item-bg">
                <img src="${img}" alt="emoji" class="small-emoji"/>
            </div>
            <h2>${name}</h2>
        </div>`;
    })
    if (callback) {
        callback();
    }
}

// displayPreferBlock(preferBlockContent, () => {
//autosize(document.getElementById("favour-area"));
// });

function displayPreferAboutChild(dataChild) {
    // const titleChildName = document.getElementById("child-name");
    // const dateInput = document.getElementById("date-input");
    // const avatar = document.getElementById("hamtest");
    console.log("инфо о дете",dataChild);
    let setName = dataChild.insert;
    if (dataChild.title_name) {
        setName = dataChild.title_name;
    }

    titleChildName.value = setName;
    titleChildName.setAttribute("data-origin", setName);
    if (dataChild.emoji) {
        avatar.src = emojiStore[dataChild.emoji];
        avatar.name = dataChild.emoji;
        avatar.setAttribute("data-origin", dataChild.emoji);
    } else {
        avatar.src = emojiStore.bunny;
    }

    if (dataChild.lesson_duration) {
        document.getElementById("picked-duration").innerText = `до ${dataChild.lesson_duration} минут`;
    }

    // name.style.width = name.value.length + 1 + 'ch';

    dateInput.value = dataChild.birthdate;
    dateInput.setAttribute("data-origin", dataChild.birthdate ? dataChild.birthdate : "");

    textAria.value = dataChild.favour;
    textAria.setAttribute("data-origin", dataChild.favour ? dataChild.favour : "");

    setTimeout(() => { autosize(textAria); }, 100)
    document.querySelector(".child-container-about").setAttribute("data-id", dataChild.child_id);
    const event = new Event('input', { bubbles: true });
    textAria.dispatchEvent(event);
}



function hideBlock() {
    const manyChild = document.querySelector(".child-container-items");
    const mainBlock = document.querySelector(".main");
    const headerBlock = document.querySelector(".header");
    headerBlock.style.display = "none";
    manyChild.classList.add("classHide");
    mainBlock.classList.remove("addBorderRadius");
}

function showBlock() {
    const manyChild = document.querySelector(".child-container-items");
    const mainBlock = document.querySelector(".main");
    const headerBlock = document.querySelector(".header");
    const aboutChild = document.querySelector(".child-container-about");

    aboutChild.classList.add("classHide");
    headerBlock.style.display = "flex";
    manyChild.classList.remove("classHide");
    mainBlock.classList.add("addBorderRadius");
    WebApp.BackButton.hide();
}


// -------display function------------