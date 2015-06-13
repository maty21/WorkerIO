var reciverIO = function (workerPath) {
  //props
  var self=this;
  this._workerPath= "";
  this._worker= null;
  this._emitData={};
  this._init = function(workerPath){
    self._workerPath=  workerPath;
  }
  this._start = function(returnedFunction){
    self._worker=  new Worker(self._workerPath);
    self._worker.onmessage  =function(e){
      if (self._emitData[e.data.topic]!=null) {
        self._emitData[e.data.topic](e.data.data);
      }
    };
    returnedFunction(self.socket);
  }
  this._emit = function(topic,data){
    if (self._worker==null) {
      // console.error("worker is not initiated");
    }
    else {
      var msg = Message(topic,data);
      self._worker.postMessage(msg);
    }
  }

  this._on= function(topic,returnedFunction){
     if (self._emitData[topic]!=null) {
       return;
     }
     else {
       self._emitData[topic]=returnedFunction;
     }

  }
  this._init(workerPath);
  this.socket = {
    on:this._on,
    emit:this._emit,
    start:this._start

  }
  return{
    // on:this._on,
    // emit:this._emit,
     start:this._start

  }

}
