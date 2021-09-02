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

ipc.on('save', (event, message) => {
    let content = editor.getValue();
    if(openedFile == "")
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
        
    }catch(err)
    {
        console.log("Error! " + err);
    }

})

ipc.on('saved', (event, message) => {
    openedFile = message;
})
