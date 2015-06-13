
// function a() {
//   onmessage = function(e){
//
//     console.log(e);
//   }
//   //Message("test","bla")
// postMessage({
//   topic:"test",
//   data:"bla",
// })
// }
//
// a();


function a() {
  importScripts('../dist/WorkerIO.js');
  var testWorker = IO.Worker();
  testWorker.start(function(socket){
    socket.on("emitTest",function(data){
      console.log(data);

    })
    socket.emit("test","bla")
  })

  //Message("test","bla")

}

a();

// var i = 0;
//
// function timedCount() {
//     i = i + 1;
//     postMessage(i);
//     setTimeout("timedCount()",500);
// }
//
// timedCount();
