# WorkerIO
## a simple web workers with amessaging pub/sub api  


### Usage instructions:
### worker:
* create a worker on a separated  file
* import workerIO  lib to your worker  using ```importScripts()```  then


* init workerIO ```var yourWorkerName =  IO.Worker();```
*  call to start method you should recive your socket instance for communicating with the caller side



```javascript
yourWorkerName.start(function(socket){
                                 ....
                                })
```
*  within the ```start``` function you can recive messages by calling to ``on`` function
        ```javascript
          socket.on("messageName",callbackFunction(Data))
          ```

*  sending messages using ```emit``` function
   ```javascript  socket.emit("messageName","Data") ```

* full worker sample code

```javascript
\\\"testWorker.js" file
function Worker() {
  importScripts('../dist/WorkerIO.js');
  var testWorker = IO.Worker();
  testWorker.start(function(socket){
    socket.on("emitTest",function(data){
      console.log(data);

    })
    socket.emit("test","bla")
  })
  Worker();
```

### caller:
*  init workerIO caller ```var yourCallerName =  IO.Reciver("testWorker.js");```
*   start processing the job by calling to ```start``` function
  ```javascript
      yourCallerName.start(function(socket){
                            ...
                            })
  ```
*  within the ```start``` function you can recive messages by calling to ``on`` function
        ```javascript
          socket.on("messageName",callbackFunction(Data))
          ```

*  sending messages using ```emit``` function
   ```javascript  socket.emit("messageName","Data") ```

* full caller sample code


```javascript
 var io= IO.Reciver("testWorker.js");
  io.start(function(socket){
    socket.on("test",function(data){
      console.log("on: "+data);
      socket.emit("emitTest","bla");
    });
    socket.emit("emitTest","bla");
  });
```  
