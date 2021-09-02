let closeBtn = document.getElementById('closeWindow');
const ipc = require('electron').ipcRenderer;

closeBtn.addEventListener('click', (event) => {
    window.close();
}) 

let newFile = document.getElementById('newfile');

newFile.addEventListener('click', (event) => {
    ipc.send('load-page', 'editor.html');
})

let openFile = document.getElementById('openfile');

openFile.addEventListener('click', (event) =>{
    ipc.send('open-file', 'open');
})