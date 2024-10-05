const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }


  // Display the video in the biometric data section
  // const biometricDataDiv = document.getElementById('biometricData');
  // biometricDataDiv.classList.remove('d-none');
  // biometricDataDiv.prepend(video);
  // video.style.display = 'block'; // Show video for debugging (can be hidden)

  
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        
    if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

        // Simulated biometric data based on facial expression
        let heartRate = 70;  // Default heart rate
        let stressLevel = 0; // Default stress level

        if (maxExpression === 'angry' || maxExpression === 'fearful' || maxExpression === 'sad') {
            heartRate = 90; // Increased heart rate
            stressLevel = 80; // High stress level
        } else if (maxExpression === 'happy' || maxExpression === 'surprised') {
            heartRate = 75; // Moderate heart rate
            stressLevel = 30; // Low stress level
        } else {
            heartRate = 70; // Normal heart rate
            stressLevel = 50; // Moderate stress level
        }

        document.getElementById('heartRate').textContent = heartRate;
        document.getElementById('stressLevel').textContent = stressLevel;
        document.getElementById('biometricData').classList.remove('d-none');
        // Update chart with the biometric data
        const currentTime = new Date().toLocaleTimeString();
        biometricChart.data.labels.push(currentTime);
        biometricChart.data.datasets[0].data.push(heartRate);
        biometricChart.data.datasets[1].data.push(stressLevel);
        biometricChart.update();
    }
    else{
        let heartRate = 70;  // Default heart rate
        let stressLevel = 0; 
        document.getElementById('heartRate').textContent = heartRate;
        document.getElementById('stressLevel').textContent = stressLevel;
    }

  }, 100)
})




function completeChallenge(challengeId, message) {
  // Mark the challenge as completed
  const challenge = document.getElementById(challengeId);
  challenge.classList.add('completed');

  // Display the success message
  const progressMessage = document.getElementById('progress-message');
  progressMessage.innerText = message;

  // Add a small animation effect
  challenge.style.transform = 'scale(1.1)';
  setTimeout(() => {
      challenge.style.transform = 'scale(1)';
  }, 300);
}


