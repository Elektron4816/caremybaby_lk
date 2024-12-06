import '../index.css';
import "./yc_frame.css";

import autosize from "/node_modules/autosize/src/autosize.js";
import {
    showAlert,
} from "../component/functionFromExport.js";

const responce = {
    type: 'iframe_ready',
    payload: {
        success: true
    }
}
console.log("hello");

window.parent.postMessage(responce, "*");


function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        salon_id: params.get('salon_id'),
        user_id: params.get('user_id'),
        entity_id: params.get('entity_id'),
        entity_type: params.get('entity_type'),
    };
}


const textAria = document.getElementById("report-message");
const inputCount = document.getElementById("input-count");
const checkLength = document.getElementById("check-length");
const sendBtn = document.getElementById("send-report");

autosize(textAria);

const param = getQueryParams();
console.info(param);

textAria.addEventListener("input", (event) => {
    //console.info(event.target.value);
    const length = event.target.value.length
    inputCount.innerText = length;
    if (length > 3500) {
        checkLength.style.color = "red";
        sendBtn.classList.add('disabel');
    } else {
        checkLength.style.color = "#999895";
        sendBtn.classList.remove('disabel');
    }
})

fetch(`/getReport?entity_id=${param.entity_id}`)
    .then(responce => responce.json())
    .then((data) => {
        console.log(data);
        if (data.data) {
            textAria.value = data.data.report_text;
            const event = new Event('input', { bubbles: true });
            textAria.dispatchEvent(event);
        }
    })

sendBtn.addEventListener("click", () => {
    param.report_text = textAria.value;
    fetch("/postReport", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success) {
                showAlert("Сохранено");
            }
        })
})