var ENDRESULT = "endResult";

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

var Message = function(_topic,_data)  {

  return{
    topic:_topic,
    data:_data,
  }


}

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

var WorkerGroup = function(workerPath,options){
this._workerGroupName =null;
this._workersAmount = 0;
this._currentlyWorking = 0;
this._workerPath = workerPath;
this._callBackOnEnd= null;
this._callBackOnwaitAll= null;
this._workerQueue={};
this._resultQueue=[];
var self =this;
if (options!=null) {
  this._workerGroupName =options.workerGroupName;
}
// for (var i = 0; i < workersAmount; i++) {
//
// }


this._foreach=function(data,callbackFunction){

    for (var i = 0; i < data.length; i++) {
      self._workerQueue[i]= new reciverIO(self._workerPath,{workerName:i});
      var innerData= data[i];
      var innercallbackFunction = callbackFunction;
      self._workerQueue[i].start(function(socket){
        innercallbackFunction(socket,innerData);

      }).end(self._reciveResultOnEnd);
      self._workersAmount++;
    }

    self._currentlyWorking =self._workersAmount;

    return{
      waitAny:self._waitAny,
      waitAll:self._waitAll
    }

}
this._reciveResultOnEnd = function(workerName,data){
  self._currentlyWorking--;
  self._resultQueue.push({
    workerName:workerName,
    data:data
  })
  if (self._currentlyWorking==0) {
    self._callBackOnwaitAll(self._resultQueue);
  }
  self._callBackOnEnd(workerName,data);
  self._workerQueue[workerName].cancel();
  delete self._workerQueue[workerName];

}

this._waitAny = function(callbackFunction){
  self._callBackOnEnd=callbackFunction;
  return{
        waitAll:self._waitAll
  }
}

this._waitAll = function(callbackFunction){
  self._callBackOnwaitAll=callbackFunction;
  return{
    waitAny:self._waitAny
    }
}

this._cancelAll = function () {
  for (var workerName in self._workerQueue) {
    self._workerQueue[workerName].cancel();
  }
  self._workerQueue = {};
}


this._broadacastEmit = function(messageName,data){

  for (var workerName in self._workerQueue) {
    var socket = self._workerQueue[workerName].getSocket();
    socket.emit(messageName,data);
  }

}
this._broadacast = {
          emit:self._broadacastEmit
    }


return{
  foreach:this._foreach,
  broadcast:this._broadacast,
  cancelAll:this._cancelAll
 }

}

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
