//tiktokpets.js

let continueButton = document.getElementById("continue");

async function sendPostRequest(url, data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

//send post request to server side when continue button on main page is clicked
continueButton.onclick = () => { 
  let userName = document.getElementById("username").value;
  let tturl= document.getElementById("tiktokURL").value;
  let videoName = document.getElementById("nickname").value;
  
  console.log("sending", videoName);
  // sendPostData takes a relative url and the data to send 
  // as inputs and returns a Promise object
  sendPostRequest('/videodata', userName + tturl + videoName)
    .then(function(data) {
      sessionStorage.setItem("storedData", videoName);
      window.location = "/submit.html";})
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
  
}