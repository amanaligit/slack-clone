const username = prompt("What is your username?");
const socket = io('http://localhost:9000', {
    query: {
        username: username
    }
}); // the / namespace/endpoint
let nsSocket = "";

socket.on('nsList', (nsData) => {
    console.log("The List of namespaces has arrived");
    console.log(nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`
    })
    Array.from(document.getElementsByClassName('namespace')).forEach(elem => {
        elem.onclick = () => {
            const nsEndpoint = elem.getAttribute('ns');
            console.log(`I should go to ${nsEndpoint} now`);
            joinNs(nsEndpoint);
        }
    })
    joinNs('/wiki');
})





