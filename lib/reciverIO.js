var reciverIO = function (workerPath,options) {
  //props
  this._workerName = null;
  var self=this;
  this._workerPath= "";
  this._worker= null;
  this._endFunction = null;
  this._emitData={};

  if (options!=null) {
    this._workerName = options.workerName;
  }

  this._init = function(workerPath){
    self._workerPath=  workerPath;
  }
  this._start = function(returnedFunction){
    self._worker=  new Worker(self._workerPath);
    self._worker.onmessage  =function(e){
      if (e.data.topic==ENDRESULT) {
        self._endFunction(self._workerName,e.data.data);
      }
      else if (self._emitData[e.data.topic]!=null) {
          self._emitData[e.data.topic](e.data.data);
        }


    };
    returnedFunction(self.socket);

    return{
      end:self._end
    }
  }
  this._emit = function(topic,data){
    if (self._worker==null) {
      // console.error("worker is not initiated");
    }
    else {
      var msg = Message(topic,data);
      self._worker.postMessage(msg);
    }
    return{
      on:this._on,
      emit:this._emit,

    }
  }

  this._on= function(topic,returnedFunction){
     if (self._emitData[topic]!=null) {
      // return;
     }
     else {
       self._emitData[topic]=returnedFunction;
     }

     return{
       on:this._on,
       emit:this._emit,

     }

  }
  this._getSocket = function(){
    if (self._worker!=null) {
      return self.socket;

    }
    return null
  }

  this._cancel= function(){
    self._worker.terminate();
  }
  this._init(workerPath);
  this.socket = {
    on:this._on,
    emit:this._emit,
  //  start:this._start


  }
  this._end = function(callbackFunction){
    self._endFunction =callbackFunction;

  }
  return{
    // on:this._on,
    // emit:this._emit,
     start:this._start,
     getSocket:this._getSocket,
     end:this._end,
     cancel:self._cancel,
  }

}
