import "./teacher.css";
import "../index.css";

import "../component/Navbar.js";
import "../component/Header.js";

import "../component/displayBalance.js";
import "../component/checkAuth.js";
import "./multiselect/snapselect.min.css";
import "./multiselect/snapselect.min.js";

let WebApp = window.Telegram.WebApp;
// const seeMoreAboutTeacher = document.querySelector(".moreAboutTeacher");

const frame = document.getElementById("isFrame");
const teacherDiv = document.getElementById("showFrame");
const firstMain = document.getElementById("firstMain");
const header = document.getElementById("header");
const insertTeacher = document.querySelector(".insertTeacher");
const navbar = document.getElementById("navbar");
const innerOption = document.getElementById("innerOption");

let allSelectItem = 0;

document.getElementById("showFrame").style.height = `${window.innerHeight}px`;
frame.style.height = `${window.innerHeight}px`;

fetch("/getTeacher") // получаю список педагогов.
    .then((response) => response.json())
    .then((data) => {
        console.info(data);
        displayTeacher(data);  // вызываем функцию отображения информации о педагогах.
        showMoreAboutTeacher(data);
        searchTeacher(data);

    })
    .catch(function (error) {
        console.log("Error:", error);
    });

fetch("/getListNomenclature")
    .then((response) => response.json())
    .then((data) => {
        displayOption(data);
    })
    .catch((error) => {
        console.log("Error:", error);
    })


function displayOption(dataList, callback) {
    // innerOption.innerHTML = `<option value=1>Выберите предмет</option>`
    dataList.forEach(value => {
        innerOption.innerHTML += `<option value='${value}'>${value}</option>`
    })
    SnapSelect('.demo', {
        liveSearch: true,
        placeholder: 'Выберите предмет',
    });
    // document.querySelector(".snap-select-selected").addEventListener("change", () => {
    //     console.info("good");
    // })

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('Дочерний элемент добавлен или удален');
                multiplySearch();
            }
        });
    });

    const config = { childList: true };

    observer.observe(document.querySelector('.snap-select-tags'), config);

    if (callback) {
        callback()
    }
}

function displayTeacher(data) {

    data.forEach((value, index) => {
        const match = value.teacher_name.match(/[А-Я,Ё][а-я,ё]+\s[А-Я,Ё][а-я,ё]+/);
        insertTeacher.innerHTML += `<p class="teacherList" index='${index}' data-list='${value.directions.join(', ')}'name="${value.site_page}">${match}</p>`
    })
}



function showMoreAboutTeacher(arrayTeacher) {

    const allTeacher = document.querySelectorAll(".teacherList");

    for (let i = 0; i < allTeacher.length; i++) {

        allTeacher[i].addEventListener("click", () => {
            const teacherUrl = arrayTeacher[i].site_page; // будет братся из data

            fetch(`/getFrame?url=${teacherUrl}`)
                .then((response) => response.text())
                .then((data) => {
                    frame.contentWindow.document.open();
                    frame.contentWindow.document.write(data);
                    frame.contentWindow.document.close();
                    firstMain.classList.add("classHide");
                    header.style.display = "none";
                    // navbar.style.display = "none";
                    teacherDiv.classList.remove("classHide");
                    teacherDiv.classList.toggle("addBorderRadius");

                    WebApp.BackButton.show();
                })
                .catch(function (error) {
                    console.log("Error:", error);
                });
        })
    }
}

function searchTeacher(data) {
    let arrAtribute = [];
    const allTeacher = document.querySelectorAll(".teacherList");
    for (let i = 0; i < allTeacher.length; i++) {
        arrAtribute.push(allTeacher[i].getAttribute("data-list"));

    }

    //    console.info(arrAtribute);
    innerOption.addEventListener("change", () => {
        console.info("ok");
        // console.log(innerOption.value);
        for (let i = 0; i < arrAtribute.length; i++) {
            if (arrAtribute[i].includes(innerOption.value)) {
                allTeacher[i].style.display = "block";
            } else {
                allTeacher[i].style.display = "none";
            }
            if (innerOption.value == 1) {
                allTeacher[i].style.display = "block";
            }
        }
    })
}

function lisnterClick() {

}

function multiplySearch() {
    let arrAtribute = [];
    const allTeacher = document.querySelectorAll(".teacherList");
    for (let i = 0; i < allTeacher.length; i++) {
        arrAtribute.push(allTeacher[i].getAttribute("data-list"));
    }

    const allSearchAtribute = document.querySelectorAll(".snap-select-name");
    let indexArr = [];
    for (let i = 0; i < arrAtribute.length; i++) {

        for (let j = 0; j < allSearchAtribute.length; j++) {
            if (arrAtribute[i].includes(allSearchAtribute[j].innerText)) {
                indexArr.push(i);
                allTeacher[i].style.display = "block";
            } else if (!indexArr.includes(i)){
                allTeacher[i].style.display = "none";
            }
        }
        if (allSearchAtribute.length == 0) {
            allTeacher[i].style.display = "block";
        }

    }
}


WebApp.BackButton.onClick(() => {
    firstMain.classList.remove("classHide");
    teacherDiv.classList.add("classHide");
    header.style.display = "flex";
    // navbar.style.display = "flex";
    WebApp.BackButton.hide();
})



let students = ['Student1', 'Student2', 'Student3', 'Student4', 'Student5'];
let mathStudents = ['Student1', 'Student3', 'Student5'];

let notMathStudents = students.filter(student => !mathStudents.includes(student));

console.log(notMathStudents); 