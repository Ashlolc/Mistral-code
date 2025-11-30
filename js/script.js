document.getElementById('apiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    const chatEndpoint = document.getElementById('chatEndpoint').value;
    const completionEndpoint = document.getElementById('completionEndpoint').value;

    // Store the data in session storage
    sessionStorage.setItem('apiKey', apiKey);
    sessionStorage.setItem('chatEndpoint', chatEndpoint);
    sessionStorage.setItem('completionEndpoint', completionEndpoint);

    // Fade out the form
    document.getElementById('apiForm').classList.add('fadeOut');

    // Show the chat button after the form fades out
    setTimeout(function() {
        document.getElementById('apiForm').style.display = 'none';
        document.getElementById('chatButton').classList.remove('hidden');
    }, 500);
});

// Handle clicking the chat button
document.getElementById('chatButton').addEventListener('click', function() {
    // Fade out the chat button
    document.getElementById('chatButton').classList.add('fadeOut');

    // Show the chat container after the button fades out
    setTimeout(function() {
        document.getElementById('chatButton').style.display = 'none';
        document.getElementById('chatContainer').classList.remove('hidden');
    }, 500);
});

// Handle sending messages in the chat interface
document.getElementById('sendButton').addEventListener('click', function() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById('userInput').value = '';

        // Simulate a response from Codestral
        setTimeout(function() {
            chatMessages.innerHTML += `<p><strong>Codestral:</strong> This is a simulated response to: "${userInput}"</p>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
});

// Handle running code in the code environment
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('sendButton').click();
    }
});