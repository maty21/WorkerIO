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
