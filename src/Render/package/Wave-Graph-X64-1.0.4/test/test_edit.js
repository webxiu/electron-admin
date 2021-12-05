var graph=require("../dist/WaveGraph")
//var waveFile="5s1.wav"
//var saveWaveFile0="5s1_0.wav"
//var saveWaveFile="5s1_1.wav"


var waveFile="./test/006_03_1.wav"
var saveWaveFile0="./test/006_03_1_0.wav"
var saveWaveFile="./test/006_03_1_1.wav"


var testStable=1
var testType="insert"
var index=graph.createDraw(waveFile,{bandwidth:300,gain:20,range:40,minFreq:0,maxFreq:8000,preEmphasisCoef:0.65,winFunc:3})

if(index < 0)
{
	console.log("Create Draw Fail")
	process.exit()
}

graph.setMillisPerColumn(index,0)
var waveInfo=graph.getPCMInfo(index)

function printInfo(tag)
{
	console.log(tag)
	console.log(waveInfo)
	console.log("Millis per column:"+graph.getMillisPerColumn(index))
	console.log("Total column:"+graph.getTotalColumn(index))
	console.log("PCM Duration:"+graph.getPCMDuration(index))
	console.log("edit history depth:",graph.getEditHistoryDepth(index))
}

printInfo("============= Before edit ========")

bufferData=null
testLen=10
postion1=1000
postion2=1000
if(testType=="insert" || testStable == 1 || testType == "clear")
{
	if(testStable == 1)
	{
		bufferData=Buffer.alloc(256,'t')
	}
	else
	{
		bufferData=new Buffer("TestBuffer")
	}
	testLen= -1
}


function stable_test(count)
{
	if(count > 10000000)
	{
		console.log("WaveEdit Test Done!!!!")
		process.exit()
	}

	if(count%1000 == 0)
	{
		console.log("current count,:",count," type:",testType)
	}
	
	if(count%2==0)
	{
		count2=count/2
		if(count2%3==0)
		{
			testType="clear"
		}
		else if(count2%3==1)
		{
			testType="delete"
		}
		else
		{
			testType="insert"
		}
		
		graph.editWave(index,{type:testType,positon:postion1,size:testLen,data:bufferData},function(ok){
			console.log('ok:',ok)
			if(!ok)
			{
				console.log("-----------------------")
				console.log("WaveEdit Test Fail!!!!")
				process.exit()
			}

			stable_test(count+1)
		})
	}
	else
	{
		graph.undoEdit(index,function(result){
			if(result==null || !result["ok"])
			{
				console.log("WaveEdit Test Fail!!!!")
				process.exit()
			}
			stable_test(count+1)
		})
	}
	
	
}


if(testStable==0)
{
	graph.editWave(index,{type:testType,positon:postion1,size:testLen,data:bufferData},function(ok){
		console.log("Edit 0 Result:",ok);
		printInfo("============= After edit 0 ========")
		
		graph.saveEdit(index,saveWaveFile0,function(ok)
		{
			console.log("Save Result 0:",ok);
			graph.editWave(index,{type:testType,positon:postion2,size:testLen,data:bufferData},function(ok){
				console.log("Edit 1 Result:",ok);
				printInfo("============= After edit 1 ========")
			
				
				graph.undoEdit(index,function(result){
					console.log(result)
					graph.undoEdit(index,function(result){
						console.log(result)
						graph.saveEdit(index,saveWaveFile,function(ok)
						{
							console.log("Save Result:",ok);
							process.exit()
						})
					})
				})
				
			})
		})
	})
}
else
{
	stable_test(0);
}

