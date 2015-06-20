# WorkerIO
___________________________________
##Messaging pub/sub api for web workers includes Parallel libary   

### New: **Parallel functionality**  - with an ability to send job and split it to sub workers More details below
### The new parallel libary including those features:
- [x] **pub/sub -** send and get messages from the job during proccessing
- [x] **waitAny -** get a notification on the caller side when a sub worker finish its job with the result of the job.
- [x] **WaitAll -** get a notification on the caller side when a the whole job is finshed includes the result of the job
- [x] **broadcasting -** broadcasting message to the whole wrokers 
- [x] **cancelAll -** close the workers 
- [ ] **limiting worker numbers**- (in the next few days) an ability to limit the number of workers that will handle the job

More details below under the user instructions section
    

### Usage instructions:
### worker:
* create a worker on a separated  file
* import workerIO  lib to your worker  using ```importScripts()```  then

* init workerIO ```var yourWorkerName =  IO.Worker();```
*  call to start method you should recive your socket instance for communicating with the caller side

```javascript
    yourWorkerName.start(function(socket){  
                            \\body   ....    });
 ```
*  within the ```start``` function you can recive messages by calling to ``on`` function

```javascript
    socket.on("messageName",callbackFunction(Data))
```

*  sending messages using ```emit``` function  ```socket.emit("messageName","Data")```
* full worker sample code

```javascript
\\"testWorker.js" file
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
                            ...      })
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
### parallel:
* init parallel job is done using  ```var parallel= IO.Parallel("workerUnit.js");```
* in order to start a new job you should use  

```javascript 
parallel.foreach([array of jobs...],function(socket,data){
      //communicating with a specific worker
      socket.emit("runParallel",data);
      socket.on("status",function(data){
        console.log("status: "+data);
      })
```

