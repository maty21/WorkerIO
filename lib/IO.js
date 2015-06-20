var IO = new function() {

    this.Reciver=function(path){
        return new reciverIO(path);
      };
    this.Worker= function(){
      return new workerIO();
    };
    this.Parallel= function(workerPath,options){
      return new WorkerGroup(workerPath,options);
    };
}
