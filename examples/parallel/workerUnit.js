
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
      //clearInterval(inter);
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

  //Message("test","bla")

}

parallelTest();

// var i = 0;
//
// function timedCount() {
//     i = i + 1;
//     postMessage(i);
//     setTimeout("timedCount()",500);
// }
//
// timedCount();
