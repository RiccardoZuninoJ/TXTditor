const ipc = require('electron').ipcRenderer;
const fs = require('fs');

let openedFile = "";

document.getElementById('textarea').addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
  });

//CTRL+S
//To-do

ipc.on('save', (event, message) => {
    let content = editor.getValue();
    if(openedFile === "")
    {
        ipc.send('save-file', content);
    }else
    {
        const values = [openedFile, content]
        ipc.send('save-notas', values);
    }
})

ipc.on('save-as', (event, message) => {
    let content = editor.getValue();
    ipc.send('save-file', content);
    
})


ipc.on('open', (event, message) => {
    console.log("Reading file");

    try{
        let data = fs.readFileSync(message[0], 'utf-8');
        editor.setValue(data);
        openedFile = message[0];
        document.title = "Txtditor | " + message[0];
        changeMode();
    }catch(err)
    {
        console.log("Error! " + err);
    }


})

ipc.on('saved', (event, message) => {
    openedFile = message;
    document.title = "Txtditor | " + openedFile;
    changeMode();
})

ipc.on('new-file', (event, message) => {
    openedFile = "";
    editor.setValue("");
    document.title = "Txtditor";
});

function changeMode()
{
    extension = openedFile.split('.').pop();

    switch(extension){
        case 'js':{
            
            editor.setOption("mode", "javascript");
            console.log("Javascript mode enabled");
            break;
        }
        case 'c':{
            editor.setOption("mode", "clike");
            console.log("Clike mode enabled");
            break;
        }
        case 'py':{
            editor.setOption("mode", "python");
            console.log("Python mode enabled");
            break;
        }
        case 'html':{
            editor.setOption("mode", "htmlmixed");

            console.log("HTMLmixed mode enabled");
            break;
        }
    }
}