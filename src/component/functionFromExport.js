function validNumberFromGet(phoneNumber) {
  let result;
  let nums = phoneNumber.match(/\d+/g).join("");
  result = nums;
  return result;
}

const showAlert = (string) => {
  const openAlertMessege = document.querySelector(".alertPopUp");

  openAlertMessege.classList.add("moveClass");
  openAlertMessege.innerHTML = `
    <div class="alertContent">
      <p>${string}</p>
    </div>`;
  setTimeout(() => {
    openAlertMessege.classList.remove("moveClass");
    setTimeout(() => {
      openAlertMessege.innerHTML = "";
    }, 2000);
  }, 3000);
};

export { validNumberFromGet, showAlert };
