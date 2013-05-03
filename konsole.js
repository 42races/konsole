function load(script){
  var baseurl = document.URL;
  baseurl = baseurl.slice(0, baseurl.lastIndexOf('/'));
  $.getScript([baseurl, "/" , script,".js"].join(''), 
    function(){
      console.log("Loading module " + script + " Success");
    });
}

load("shell_commands");

var Konsole = {
  commands: {
    "ls": undefined, 
    "cd": 0,
    "pwd": 0, 
    "clear": 0, 
    "date": undefined,
    "help": undefined,
    "history": 0 
  },

  ENV: {
    "prompt": "guest@konsole $ "
  },
  
  initialize: function(){
      console.log("loading console");
      this.input  = $("#command-line");
      this.output = $("output ul");
      this.history = [],
      this.input.change(function(){
          self = Konsole.input;
          var command = self.val(); 
          console.log("command entered is " + command);
          try{
              Konsole.addToHistory(command);
              var output = Konsole.executeCommand(command);
          }
          catch(e){
              var output = "Exception " + e;
              console.log("Caught: Exception");
              console.log(e);
            }
          Konsole.display(output, command);
      });
  },

  addToHistory: function(command){
    this.history.push(command);
  },

  getHistory: function(){
    return(this.history);
  },
  
  executeCommand: function(command){
    var status = Konsole.commands[command];
    if (status === 0){
      // shell command
      return(Shell[command]());
    }else if (status === undefined){
      console.log("Module for " + command +" not loaded.");
      throw("Module missing")
    }else {
      return("Loading and executing module");
    }
  },
  
  display: function(output, command){
    var li   = document.createElement("li");
    var command_div = ['<div class="command">', Konsole.ENV.prompt, command, "</div>"].join('');
    var output_div  = ['<div class="output">', output, "</div>"].join('');
    li.innerHTML = command_div + output_div;
    this.output.append(li);
    this.input.val("");
  }
};

$(document).ready(function(){
  Konsole.initialize();
});
