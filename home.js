// Request permissions for microphone
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    console.log("Permission granted");
  })
  .catch(function (err) {
    console.log("Permission denied");
  });
