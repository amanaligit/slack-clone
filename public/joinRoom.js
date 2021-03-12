function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberofMembers) => {
        // we want to uplade the room member total
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberofMembers} Users<span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = roomName;
    })
    nsSocket.on('historyCatchUp', history => {
        // console.log(history);
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = "";
        for (let index = history.length - 1; index >= 0; index--) {
            const msg = history[index];
            messagesUl.innerHTML += buildHTML(msg);
        }
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    })
    nsSocket.on('updateMembers', numMembers => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} Users<span class="glyphicon glyphicon-user"></span>`
    })
    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', e => {
        console.log(e.target.value);
        let messages = Array.from(document.getElementsByClassName('message-with-user'));
        console.log(messages);
        messages.forEach(msg => {
            if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                msg.style.display = 'none';
            }
            else
                msg.style.display = 'block';
        })
    })
}