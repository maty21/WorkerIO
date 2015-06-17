# WorkerIO
##a simple web workers with amessaging pub/sub api  


###Usage instructions:
###worker:
* create a worker on a separated  file
* import workerIO  lib to your worker  using ```importScripts()```  then


* init workerIO ```var yourWorkerName =  IO.Worker();```
* then call to start method you should recive your socket instance for communicating with the caller side '''

        ```yourWorkerName.start(function(socket){
                                 ....
                                })
        ```
* then within the```start```function you can recive messages by calling to ``on`` function 
        ```javascript 
          socket.on("messageName",callbackFunction(Data))
          ```            
      
* and sending messages using ```emit``` function
   ```javascript  socket.emit("messageName","Data") ```

 * here is a full worker sample

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
 
###caller:
*  init workerIO caller ```var yourCallerName =  IO.Reciver("testWorker.js");```
*  you can start processing the job on the worker by calling to ```start``` function
      ```javascript 
          yourCallerName.start(function(socket){
                                ...
                                })
      ```
* then within the```start```function you can recive messages by calling to ``on`` function 
        ```javascript 
          socket.on("messageName",callbackFunction(Data))
          ```            
      
* and sending messages using ```emit``` function
   ```javascript  socket.emit("messageName","Data") ```

 * here is a full caller sample

 
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
