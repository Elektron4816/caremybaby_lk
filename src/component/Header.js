import chevron from "../image/chevron-right.svg";

document.getElementById("header").innerHTML = `
<div class="header2">
<div class="circle">
  <p class="circleName"></p>
</div>
<div class="nameHeader">
  <span id="displayName"></span>
  <img src="" id="chevron"/>
</div>
</div>
<div class="balanceHeader">
<div style="display: flex; align-items: center">
  <p id="headerRub">0</p>
  <p>₽</p>
</div>
<div style="display: flex; align-items: center">
  <p id="headerEuro">0</p>
  <p>€</p>
</div>
</div>`;

document.getElementById("chevron").src = chevron;
