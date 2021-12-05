var graph=require("../dist/WaveGraph")
var path = require('path');
var fs = require('fs')

var waveFile = "./test/006_03_1.wav"

var index = graph.createDraw(waveFile)
graph.setThreadNumber(index, 8)


/*
graph.setMillisPerColumn(index, 2)

var xMap = [0,1000]
var yMap = [0,86,173,259,346]

let arr = [];
for (var i = 0; i < 256; i++) arr.push(i);
let rgb = { r: arr, g: arr, b: arr };


var columnIndex  = 0
var columnCount = 3300
var height = 358
var width = 3300
var Ystart = 8


var params = {
    waveId: index,       
    height: height,
    columnIndex: columnIndex,
    columnCount: columnCount,
    width: width,
    Ystart: Ystart,
    //buf: buf,
    xMap: xMap,
    yMap: yMap,
    rgb: rgb,
    cb: function(buf){
      console.log('buf:', buf)
      console.log('22222222222222222222222')


      fs.writeFile('bigwave.wav', buf, "binary", function(err) {
        if (err) {
          console.log('写入失败')
        } else {
          console.log('写入成功了')
      }

    });
    }
  
  }



  //大波形图
  //console.log("--------------------------------------------")
  //graph.getGraphCanvasData(params)
  //console.log('111111111111111111111111')
  
*/

//小波形图

var info = graph.getPCMInfo(index)
graph.setMillisPerColumn(index, 1000)
graph.setThreadNumber(index, 8)
var totalColumn = graph.getTotalColumn(index)
console.log('totalColumn----1111:',totalColumn)
var height = 28


graph.drawWaveFormAsync(index, totalColumn, height, info.BitsPerSample, (buf)=>{
    console.log('buf', buf)

    fs.writeFile('smallWave.wav', buf, "binary", function(err) {
      if (err) {
        console.log('写入失败')
      } else {
        console.log('写入成功了')
      }
    });

})