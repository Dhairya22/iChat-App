const socket = io('http://localhost:3000');

// Get DOM elements to respective JS variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.msger-chat');

// Audio that will play on receving message.
var audio = new Audio('ting.mp3');

//Function which will append event info to the container. 
const append = (message, position) => {
    const messageElement = document.createElement('div');
    // messageElement.innerText = message;
    messageElement.classList.add('msg');
    messageElement.classList.add(position);

    const msgBubble = document.createElement('div');
    messageElement.appendChild(msgBubble);
    msgBubble.classList.add('msg-bubble');

    // const msgImg = document.createElement('div');
    // messageElement.appendChild(msgImg);
    // msgImg.classList.add('msg-img');

    const msgInfo = document.createElement('div');
    messageElement.appendChild(msgInfo);
    msgInfo.classList.add('msg-info');

    const msgInfoName = document.createElement('div');
    messageElement.appendChild(msgInfoName);
    msgInfoName.classList.add('msg-info-name');

    const msgInfoTime = document.createElement('div');
    messageElement.appendChild(msgInfoTime);
    msgInfoTime.classList.add('msg-info-time');

    const msgText = document.createElement('div');
    msgBubble.appendChild(msgText);
    msgBubble.innerText = message;
    msgText.classList.add('msg-text');

    messageContainer.append(messageElement);
    if(position == 'msg-text'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know.
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// If new user joins, recieve his/her name from the server know.
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center-msg')
});

// If server sends a message, receive it.
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'msg-text')
});

// If a user leaves the chat, append the info to the container.
socket.on('left', name => {
    append(`${name} left the chat!`, 'center-msg')
});

// If the form gets submitted, send server the message.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right-msg');
    socket.emit('send', message);
    messageInput.value = '';
});