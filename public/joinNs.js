joinNs = (endpoint) => {
    if (nsSocket) {
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit', formSubmission);
    }
    console.log(endpoint);
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomsLoad', nsRooms => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        // console.log(roomList);
        roomList.innerHTML = "";
        nsRooms.forEach(room => {
            roomList.innerHTML += `<li class="room"> <span class="glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}"/>${room.roomTitle}</li>`;
        })
        let roomNodes = document.getElementsByClassName('room');
        // console.log(roomNodes);
        Array.from(roomNodes).forEach(elem => {
            elem.addEventListener('click', e => {
                // console.log("clicked on ", e.target.innerText);
                joinRoom(e.target.innerText);
            })
        })
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        console.log(topRoomName);
        joinRoom(topRoomName);
    })
    nsSocket.on('messageToClients', (msg) => {
        // console.log(msg)
        document.querySelector('#messages').innerHTML += buildHTML(msg);
    })
    document.querySelector('.message-form').addEventListener('submit', formSubmission);

}

function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', { text: newMessage })
    document.querySelector('#user-message').value = "";
}

function buildHTML(msg) {
    return `
     <li class="message-with-user">
        <div class="user-image">
            <img src=${msg.avatar} />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username}<span> ${new Date(msg.time).toLocaleTimeString()}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`
}