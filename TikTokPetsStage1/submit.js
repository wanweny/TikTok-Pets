
const videoNameElement = document.getElementById("videoName");

let yourVideo = sessionStorage.getItem("storedData");
let msg = videoNameElement.textContent;

msg = msg.replace("yourVideo", "'" + yourVideo + "'");
videoNameElement.textContent = msg;

let continueButton = document.getElementById("continue");
continueButton.onclick = () => { 
  window.location = "/tiktokpets.html";
}