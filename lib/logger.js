
var Logger = exports.Logger = function(){
  
  this.date = new Date();

  // log a given content to the console
  this.log = function(content){
    content = this.attachTime(content);
    this.print(content);
  }

  this.err = function(content, err){
    if(err){
      content = content + ' error description: ' + err;
    }
    content = this.attachTime(content);
    this.printErr(content);
  }

  this.attachTime = function(content){
    let hour = this.date.getHours();
    let min = this.date.getMinutes();
    return '[' + hour + ':' + min +'] ' + content;
  }

  // just print a given content
  this.print = function(content){
    console.log(content);
  }

  this.printErr = function(content){
    console.error(content);
  }


}