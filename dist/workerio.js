var IO=new function(){this.Reciver=function(t){return new reciverIO(t)},this.Worker=function(){return new workerIO}},Message=function(t,i){return{topic:t,data:i}},reciverIO=function(t){var i=this;return this._workerPath="",this._worker=null,this._emitData={},this._init=function(t){i._workerPath=t},this._start=function(t){i._worker=new Worker(i._workerPath),i._worker.onmessage=function(t){null!=i._emitData[t.data.topic]&&i._emitData[t.data.topic](t.data.data)},t(i.socket)},this._emit=function(t,e){if(null==i._worker);else{var a=Message(t,e);i._worker.postMessage(a)}},this._on=function(t,e){null==i._emitData[t]&&(i._emitData[t]=e)},this._init(t),this.socket={on:this._on,emit:this._emit,start:this._start},{start:this._start}},workerIO=function(){var t=this;return this._emitData={},onmessage=function(i){null!=t._emitData[i.data.topic]&&t._emitData[i.data.topic](i.data.data)},this._emit=function(t,i){var e=Message(t,i);postMessage(e)},this._on=function(i,e){null==t._emitData[i]&&(t._emitData[i]=e)},this._start=function(i){i(t.socket)},this.socket={on:this._on,emit:this._emit},{start:this._start}};