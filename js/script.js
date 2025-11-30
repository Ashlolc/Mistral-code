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
document.getElementById('sendButton').addEventListener('click', async function() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById('userInput').value = '';

        // Get the API key and endpoint from session storage
        const apiKey = sessionStorage.getItem('apiKey');
        const chatEndpoint = sessionStorage.getItem('chatEndpoint');

        try {
            const response = await fetch(chatEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'codestral-latest',
                    messages: [{ role: 'user', content: userInput }],
                }),
                credentials: 'include' // Include credentials for CORS requests
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from Codestral API:', data); // Debugging line

            // Check the structure of the response
            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                const codestralResponse = data.choices[0].message.content;
                chatMessages.innerHTML += `<p><strong>Codestral:</strong> ${codestralResponse}</p>`;
            } else {
                chatMessages.innerHTML += `<p><strong>Codestral:</strong> Unexpected response format. Check the console for details.</p>`;
                console.error('Unexpected response format:', data);
            }

            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Error fetching data from Codestral API:', error);
            chatMessages.innerHTML += `<p><strong>Codestral:</strong> Error fetching response. Please try again.</p>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// Handle running code in the code environment
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('sendButton').click();
    }
});