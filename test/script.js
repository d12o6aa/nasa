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
