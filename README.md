# WorkerIO
___________________________________
## Messaging pub/sub api for web workers includes Parallel libary   

[![NPM](https://nodei.co/npm/worker.io.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/worker.io/)

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
* then you can register to the following events
    * on waitAny callback you will get the workerName and the result of the worker  
    * on waitAll callback you will get the results from all the workers  

```javascript 
parallel.waitAny(function(workerName,data){
    //getting message when each  worker finish its job
    console.log("WaitAny: data was procced on: "+workerName+" with result "+data);
  }).waitAll(function(data){
    //getting message when all the job finsh their job
    console.log("WaitAll: data was procced with result "+data);
  })
 ```
 * sending brodacast meesage to all of the workers is done using ```parallel.broadcast.emit("messageTopic",data)```
 * you can also cancel to job during proccessing by using cancelAll ```parallel.cancelAll();```
 
## full parallel example

### caller:

```javascript
  //imitJob
  var parallel= IO.Parallel("workerUnit.js");
  //Setting  Job and creating wrokers
  parallel.foreach([1,2,3,4,5,6,7,8],function(socket,data){
      //communicating with a specific worker
      socket.emit("runParallel",data);
      socket.on("status",function(data){
        console.log("status: "+data);
      })
  }).waitAny(function(workerName,data){
    //getting message when each  worker finish its job
    console.log("WaitAny: data was procced on: "+workerName+" with result "+data);
  }).waitAll(function(data){
    //getting message when all the job finsh their job
    console.log("WaitAll: data was procced with result "+data);
  });
  setTimeout(function(){
    //brodcasting message to the workers
    parallel.broadcast.emit("broadcasting",":)")
  }, 6000);

  function stopJob() {
    //removing all the jobs
    parallel.cancelAll();
  }
```
### worker:

```javascript
function parallelTest() {
  importScripts('../../dist/WorkerIO.js');
  var inter= null ;
  var testWorker = IO.Worker();
  testWorker.start(function(socket){
    socket.on("runParallel",function(data){
      console.log("runParallel: "+data);
      calc_data(data);
    }).on("broadcasting",function(data){
      console.log("broadcasting: "+data);
      });

    setInterval(function () {
      socket.emit("status","!!!Not finished yet")
    },5000);
    function calc_data(data) {
      inter =  setInterval(function(){
           var calcData = data*5
           socket.returnResult(calcData);
        }, data*1000);

    }
  })
}
parallelTest();
```
