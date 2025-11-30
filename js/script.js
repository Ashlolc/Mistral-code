document.getElementById('apiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const htmlKey = document.getElementById('htmlKey').value;
    const chatEndpoint = document.getElementById('chatEndpoint').value;
    const completionEndpoint = document.getElementById('completionEndpoint').value;

    // Store the data in session storage
    sessionStorage.setItem('htmlKey', htmlKey);
    sessionStorage.setItem('chatEndpoint', chatEndpoint);
    sessionStorage.setItem('completionEndpoint', completionEndpoint);

    alert('Data saved in session storage!');
});