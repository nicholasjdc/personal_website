
var audioCtx;


activeTimeOuts = {}
deleteTimeOuts = {}
iterCounter =0;

var qi = document.getElementById("qi")    
var ci = document.getElementById("ci")  
var error = document.getElementById("error")    



async function loadBuffer(bufferURL) {
  try{
    const response = await fetch(bufferURL);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }catch{
    console.log("Error")

    return null;
  }
}
const playButton = document.querySelector('button');

playButton.addEventListener('click', async function () {

    if(!audioCtx){
        initAudio()
    }else{
        if(codeCheck()){
            iterCounter+=1
            qi.innerHTML = "Queued Iteration: " + iterCounter
        }else{

        }
    }
  
});
function codeCheck(){ 
    var code = document.getElementById('code').value;
    lineCount = 0
    let notes = code.split("\n");

    for (note of notes){
        lineCount+=1
        noteData = note.split("@");
        if (note == ""){
            continue
        }
        if(noteData.length != 3){
            console.log("IMPROPER NUMBER OF ENTRIES")
            error.innerHTML = "Error: IMPROPER NUMBER OF ENTRIES ON LINE " + lineCount
            return false
        }else if(!noteData[0] || !loadBuffer("samples/" +noteData[0]+".wav")){
            console.log("INVALID SAMPLE ENTRY")
            error.innerHTML = "Error: INVALID SAMPLE ENTRY ON LINE " + lineCount

            return false

        }else if(typeof eval(noteData[1]) != "number"){
            console.log("PLEASE ENTER NUMBER FOR GAIN")
            error.innerHTML = "Error: PLEASE ENTER NUMBER FOR GAIN ON LINE " + lineCount

            return false

        }else if(typeof eval(noteData[1]) != "number"){
            console.log("PLEASE ENTER NUMBER FOR SLEEP")
            error.innerHTML = "Error: PLEASE ENTER NUMBER FOR SLEEP ON LINE " + lineCount

            return false

        }
    }
    return true
    

}

async function initAudio(){
    audioCtx = new AudioContext() 
    if(codeCheck()){
        iterCounter+=1
        qi.innerHTML = "Queued Iteration: " + iterCounter
        reevaluate()
    }else{
    }
     
}

async function playProgram(){  
    ci.innerHTML = "Current Iteration: " + iterCounter
    numTimeOuts = Object.keys(activeTimeOuts).length
    console.log("Starting new Iteration: " + iterCounter)
    liveCodeState.forEach(noteData => {
        id = setTimeout(function(){playSample(noteData)}, noteData["sleep"]*1000)
        activeTimeOuts[noteData["url"]] = id;
    });
   
}
async function playSample(data){

    console.log(data["url"])
    var audioBuffer = await loadBuffer(data["url"]);
    const source = audioCtx.createBufferSource();
    const sourceGain = audioCtx.createGain()
    sourceGain.gain.value = data["gain"]
    
    source.connect(sourceGain).connect(audioCtx.destination);
    source.buffer = audioBuffer;

    source.start(audioCtx.currentTime);
    sleepValue = data["sleep"]
    id = setTimeout(function(){playSample(data)}, sleepValue*1000)
    
    if(iterCounter != data["iter"]){
        deleteTimeOuts[data["url"]] = id
        delete activeTimeOuts[data["url"]]
        if(Object.keys(activeTimeOuts).length <1 ){
            reevaluate()
        }
    }else{
        activeTimeOuts[data["url"]] = id;
    }
    
}

function parseCode(code) {
    let notes = code.split("\n");
    lnc =0 
    for(note of notes){
        lnc+=1
        if(note == ""){
            notes.pop(lnc)
        }
    }
    notes = notes.map(note => {
        
        noteData = note.split("@");

        return   {"url" : "samples/" +noteData[0] + ".wav", 
                "gain" : eval(noteData[1]),
                "sleep": eval(noteData[2]),
                "iter": iterCounter
                };
    });
    return notes;
}

function genAudio(data) {
        liveCodeState = data;
}

function reevaluate() {
    var code = document.getElementById('code').value;
    var data = parseCode(code);
    genAudio(data);
    deleteOldTimeOuts()
    playProgram();
}

function deleteOldTimeOuts() {
    for([key, value] of Object.entries(deleteTimeOuts)){
        clearTimeout(value)
    }
    deleteTimeOuts= {}
}
/*
//God I wish this worked
async function loadAllSamples(){
    samples = {}
    clapBuffer =loadBuffer('clap.wav')
    eHum = loadBuffer('vending_machine.mp3')

    samples['clap'] = clapBuffer
    samples['eHum'] = eHum
}
*/