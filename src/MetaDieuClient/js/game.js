//var showDebugger = confirm('Do you want the debugger ?');
var showDebugger = true;

if(showDebugger)
{
    var gui = require('nw.gui');
    gui.Window.get().showDevTools();
}


var js = document.createElement("script");
js.type = "text/javascript";
js.src = './js/client.js';  
document.body.appendChild(js);