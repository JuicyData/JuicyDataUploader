var app = require("electron").remote;
const { ipcRenderer } = require('electron')
let toggle = false;
ipcRenderer.on('action-lower-thirds-update', (event,arg) => {
    document.getElementById("header-name").innerHTML = arg.name;
    document.getElementById("header-title").innerHTML = arg.title;
    toggle = !toggle
    if(toggle) {
        document.getElementById("first").classList.add('animate-left');
        document.getElementById("second").classList.add('animate-top');
    } else {
        document.getElementById("first").classList.remove('animate-left');
        document.getElementById("second").classList.remove('animate-top');
    }

})