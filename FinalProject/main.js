var audioCtx
var activeWalker = {}
var activeSounds = {}
var walkerPosition = {'x':0,'y':0,'z':0} //store 'x', 'y', and 'z' velocity of the walker
var globalSampleNumber = 0


const displayWidth = 20
//TO-DO:
//VISUALISATION: Make sure that each img tied to unique img id, delete img if not match 

//CHANGE WALKER BUTTON:
//No longer stops walk, just updates with current values
//start walk on startup

//WALKER FUNCTIONS
async function generateWalker(walkerData){
    globalSampleNumber++

    console.log("WALKER DATA: " + walkerData)
    let pace = walkerData['pace'] 
    let sample = walkerData['sample']
    let stepSize = walkerData['stepSize']
    let xyrot = parseFloat(walkerData['xyangle'])
    let yzrot = parseFloat(walkerData['yzangle'])

    xAngle = stepSize * Math.cos(xyrot * Math.PI /180)
    yAngle = stepSize * Math.sin(xyrot * Math.PI /180) * Math.cos(yzrot * Math.PI /180)
    zAngle = stepSize * Math.sin(yzrot * Math.PI /180)

    console.log('xyrot: ' + xyrot + 'cos(xyrot): ' +Math.cos(xyrot))
    var audioBuffer = await loadSample(sample);
    
    var walkGain = audioCtx.createGain()
    walkGain.gain.setValueAtTime(walkerData['gain'], audioCtx.currentTime)
    walkGain.connect(audioCtx.destination)

    activeWalker = {'audioBuffer': audioBuffer, 
    'sleep': pace, 'gainNode': walkGain, 'stepSize': stepSize, 
    'xAngle': xAngle, 'yAngle':yAngle, 'zAngle': zAngle}
    console.log('xangle: ' + xAngle)
    playWalker()
    updateWalkerPosition()

}

async function updateWalkerPosition(){ //pace, footstep_type(tbd), angle(tbd)
    //Add universal walker rate that this can be reset by 
    console.log("updatePosition")
    let pace = activeWalker['sleep']

    walkerPosition['x'] += activeWalker['xAngle']
    walkerPosition['y'] += activeWalker['yAngle']
    walkerPosition['z'] += activeWalker['zAngle']

    updateWalkerWriting()
    checkRelativeDistance()
    setTimeout(function(){updateWalkerPosition()}, pace*1000)
    
}


async function playWalker(){
    console.log("PLAY")

    const source = audioCtx.createBufferSource();
    let walkGain = activeWalker['gainNode']
    source.buffer = activeWalker['audioBuffer']
    source.connect(walkGain)
    source.start(audioCtx.currentTime);
    sleepValue = activeWalker['sleep']
    setTimeout(function(){playWalker()}, sleepValue*1000)

}
async function updateWalker(walkerData){
    globalSampleNumber++

    console.log("WALKER DATA: " + walkerData)
    let pace = walkerData['pace'] 
    let sample = walkerData['sample']
    let stepSize = walkerData['stepSize']
    let xyrot = parseFloat(walkerData['xyangle'])
    let yzrot = parseFloat(walkerData['yzangle'])

    xAngle = stepSize * Math.cos(xyrot * Math.PI /180)
    yAngle = stepSize * Math.sin(xyrot * Math.PI /180) * Math.cos(yzrot * Math.PI /180)
    zAngle = stepSize * Math.sin(yzrot * Math.PI /180)

    console.log('xyrot: ' + xyrot + 'cos(xyrot): ' +Math.cos(xyrot))
    var audioBuffer = await loadSample(sample);
    
    var walkGain = audioCtx.createGain()
    walkGain.gain.setValueAtTime(walkerData['gain'], audioCtx.currentTime)
    walkGain.connect(audioCtx.destination)

    activeWalker = {'audioBuffer': audioBuffer, 
    'sleep': pace, 'gainNode': walkGain, 'stepSize': stepSize, 
    'xAngle': xAngle, 'yAngle':yAngle, 'zAngle': zAngle}
    console.log('xangle: ' + xAngle)

}
//SOUND FUNCTIONS

async function generateSound(soundData){ //instantiate sound, reading from the add input field
    
    //replace all 'sounddata' instances with fields from html
    //add data to active sounds
    //pass panner data to play sound -- play sound will recursively call the sound
    //play sound j alters spanner position
    globalSampleNumber++

    let sample = soundData['sample']
    let x = parseFloat(soundData['x'])
    let y = parseFloat(soundData['y'])
    let z = parseFloat(soundData['z'])

    const panner = new PannerNode(audioCtx);
    panner.panningModel = 'HRTF';
    panner.positionX.value = parseFloat(soundData['x']) - walkerPosition['x']
    panner.positionY.value = parseFloat(soundData['y']) - walkerPosition['y']
    panner.positionZ.value = parseFloat(soundData['z']) - walkerPosition['z']

    var audioBuffer = await loadSample(sample);
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = soundData['gain']
    panner.connect(gainNode).connect(audioCtx.destination);

    soundID = soundData['sample'] + globalSampleNumber//needs to be made unique
    activeSounds[soundID] = {'panner': panner, 'audioBuffer': audioBuffer, 
    'sleep': soundData['sleep'], 'gainNode': gainNode, 'sampleName': sample, 'x':x, 'y':y,'z':z}

    addSoundVisual(soundID)
    playSound(soundID)


}

async function playSound(soundID){ // x,y, z, sample, rest
    if(activeSounds[soundID]){
        let soundData = activeSounds[soundID]
        let activePanner = soundData['panner']
        activePanner.positionX.value = parseFloat(soundData['x']) - walkerPosition['x']
        activePanner.positionY.value = parseFloat(soundData['y']) - walkerPosition['y']
        activePanner.positionZ.value = parseFloat(soundData['z']) - walkerPosition['z']

        const source = audioCtx.createBufferSource();
        source.buffer = soundData['audioBuffer']
        source.connect(activePanner)
        source.start(audioCtx.currentTime);
        let sleepValue = soundData['sleep']
        setTimeout(function(){playSound(soundID)}, sleepValue*1000)
    }

    //Recursive function, called every rest
    
    
}


function initAudio(){
    audioCtx = new AudioContext()
}
async function loadBuffer(bufferURL) {
    try{
      const response = await fetch(bufferURL);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      return audioBuffer;
    }catch{
      console.log("Error in loading Buffer")
  
      return null;
    }
}
async function loadSample(bufferURL){
    sampleRoute = 'samples/' + bufferURL + ".wav"
    sample = await loadBuffer(sampleRoute)
    return sample
}


const walkspeed = document.getElementById("walkspeed")
const walksize = document.getElementById("walksize")
const walktype = document.getElementById("walktype")
const xywalkangle = document.getElementById("xywalkangle")
const yzwalkangle = document.getElementById("yzwalkangle")

const walkgain = document.getElementById('walkgain')
const addObject = document.getElementById("addobject")
const start = document.getElementById("start")

const objectspeed = document.getElementById("objectspeed")
const objecttype = document.getElementById('objecttype')
const objectgain = document.getElementById('objectgain')
const objectx = document.getElementById('objectx')
const objecty = document.getElementById('objecty')
const objectz = document.getElementById('objectz')
const addobject = document.getElementById('addobject')

const walkerposP = document.getElementById('walkerposition')



start.addEventListener('click', function(){
    if(!audioCtx){
        initAudio()
        generateWalker(getWalkerElements())
    }else{
        if(Object.keys(activeSounds).length > 0){
            activeSounds = {}
        }else{
            updateWalker(getWalkerElements())
        }
    }
}, false)

addobject.addEventListener('click', function(){
    if(!audioCtx){
        console.log("ERROR: ATTEMPTED TO GENERATE OBJECT w/out WALKER")
    }else{
        generateSound(getSoundElements())
    }
})
function getWalkerElements(){
    ws = walkspeed.value
    wt = walktype.value
    waxy = xywalkangle.value
    wayz = yzwalkangle.value
    wg = walkgain.value
    wsi = walksize.value

    return {'pace': ws, 'sample': wt, 'xyangle': waxy, 'yzangle': wayz, 'gain': wg, 'stepSize': wsi}
}

function getSoundElements(){
    os = objectspeed.value
    ot = objecttype.value
    og = objectgain.value
    x = objectx.value
    y = objecty.value
    z = objectz.value

    return {'x':x,'y':y,'z':z,'sample':ot,'sleep':os, 'gain': og}

}

function addSoundVisual(soundID){
    soundData = activeSounds[soundID]

    const demoDiv = document.getElementById("object-list");
    const objectDiv = document.createElement("div")
    const btn = document.createElement("BUTTON");
    const newline = document.createElement("p")
    objectDiv.id = soundID;
    const node = document.createTextNode(soundData['sampleName'] + "(" + soundData['x'] + "," + soundData['y'] + "," + soundData["z"] +")");//set text w/ button information
    
    newline.appendChild(node)
    btn.innerHTML = "Delete Entry";

    
    btn.onclick = function(){
        const visual = document.getElementById(soundID)
        delete activeSounds[soundID]
        visual.remove()
    };
    objectDiv.appendChild(newline);
    objectDiv.appendChild(btn);
    demoDiv.appendChild(objectDiv);

}

function updateWalkerWriting(){
    xPos = Math.round(walkerPosition['x'] *100)/100
    yPos = Math.round(walkerPosition['y'] *100)/100
    zPos = Math.round(walkerPosition['z'] *100)/100

    walkerposP.innerHTML = "X: " +xPos + " Y: " + yPos + " Z: " + zPos
}

const xCanvas = document.getElementById('xCanvas')
const yCanvas = document.getElementById('yCanvas')
const zCanvas = document.getElementById('zCanvas')

const xCtx = xCanvas.getContext('2d')
const yCtx = yCanvas.getContext('2d')
const zCtx = zCanvas.getContext('2d')
const felixImg = document.getElementById('felix')
const cricketImg = document.getElementById('cricket')
const dogImg = document.getElementById('dog')
const birdImg = document.getElementById('bird')

function drawOnCanvas(canvas, ctx, image, scale, xOffset, yOffset){
    //rewrite to be a generalize drawing w/ point
    var imgWidth = image.naturalWidth;
    var screenWidth  = canvas.width;
    
    var imgHeight = image.naturalHeight;
    var screenHeight = canvas.height;

    imgHeight = imgHeight*scale;
    imgWidth = imgWidth*scale;          

    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, screenWidth*xOffset, screenHeight*yOffset, imgWidth, imgHeight);

}
window.onload = function(){

drawOnCanvas(xCanvas,xCtx, felixImg, 0.05, 1/2, 1/3)

drawOnCanvas(yCanvas,yCtx, felixImg, 0.05, 1/2, 1/3)
drawOnCanvas(zCanvas,zCtx, felixImg, 0.05, 1/2, 1/3)

}
var siMap ={'bird_chirp':birdImg,'cricket': 
        cricketImg, 'dog_bark': dogImg}
function checkRelativeDistance(){
    xwPos = walkerPosition['x']
    ywPos = walkerPosition['y']
    zwPos = walkerPosition['z']

    for (const [key, value] of Object.entries(activeSounds)) {
        xDiff = value['x'] - xwPos
        yDiff = value['y'] - ywPos
        zDiff = value['z'] - zwPos
        console.log('sample: ' + value['sampleName'])
        if(Math.abs(xDiff) < displayWidth){
            drawOnCanvas(xCanvas, xCtx, siMap[value['sampleName']], 0.1, 1/2 +(xDiff/displayWidth)/2,1/3)
        }
        if(Math.abs(yDiff) <displayWidth){
            drawOnCanvas(yCanvas, yCtx, siMap[value['sampleName']], 0.1, 1/2 +(yDiff/displayWidth)/2,1/3)
        }
        if(Math.abs(zDiff) <displayWidth){
            drawOnCanvas(zCanvas, zCtx, siMap[value['sampleName']], 0.1, 1/2 +(zDiff/displayWidth)/2,1/3)

        }
      }    
}