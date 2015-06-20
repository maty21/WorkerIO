var workerIO = function () {


  //props
  var self=this;


  this._emitData={};
  // this._init = function(workerPath){
  //   self._workerPath=  workerPath;
  // }
onmessage  =function(e){
      if (self._emitData[e.data.topic]!=null) {
        self._emitData[e.data.topic](e.data.data);
      }
    }
  this._emit = function(topic,data){
    // if (self._worker==null) {
    //   // console.error("worker is not initiated");
    // }

      var msg = Message(topic,data);
      postMessage(msg);
      return {
        on:self._on,
        emit:self._emit,
        returnResult:self._returnResult
      //  start:this._start

      }

  }
  this._on= function(topic,returnedFunction){
     if (self._emitData[topic]!=null) {
       //return;
     }
     else {
       self._emitData[topic]=returnedFunction;
     }
     return {
       on:self._on,
       emit:self._emit,
       returnResult:self._returnResult
     //  start:this._start

     }

  }
  this._start= function(returnedFunction){

    returnedFunction(self.socket);

    // return{
    //   returnResult:self._returnResult
    // }
  }
  this._returnResult = function(data){
    var msg = Message(ENDRESULT,data);
    postMessage(msg);
  }
  this.socket = {
    on:this._on,
    emit:this._emit,
    returnResult:self._returnResult
  //  start:this._start

  }
  // this._init(workerPath);
  return{
    // on:this._on,
    // emit:this._emit,
    start:this._start,
    returnResult:this._returnResult

  }
}
