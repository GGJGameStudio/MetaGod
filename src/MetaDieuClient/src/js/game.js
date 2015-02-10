//var showDebugger = confirm('Do you want the debugger ?');
var showDebugger = true;

if(showDebugger)
{
    var gui = require('nw.gui');
    gui.Window.get().showDevTools();
}