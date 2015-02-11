//var showDebugger = confirm('Do you want the debugger ?');
var showDebugger = false;

if(showDebugger)
{
    var gui = require('nw.gui');
    gui.Window.get().showDevTools();
}