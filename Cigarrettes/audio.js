
x = 0;
y = 0.1;
z = 0;  



var audioCtx = new AudioContext();

movement = false
sampleList = ['1', '2', '3', '4', '5', '6','7','8', '9','10']
panners = new Map()
spMap = new Map()
startingPositions = [[0.1,0.1], [20,20],[-20,20],[20,-20],[270,330], [300,300], [330, 330], [-300, -300],[-330,-300],[-270,-300]]
const globalGain = audioCtx.createGain(); //this will control the volume of all notes
globalGain.gain.setValueAtTime(0.1, audioCtx.currentTime)
globalGain.connect(audioCtx.destination);

async function loadBuffer(bufferURL) {
  //better to have a try/catch block here, but for simplicity...
  const response = await fetch(bufferURL);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
window.addEventListener('keydown', keyDown, false);
  function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if(key == '87'){
      y++;
    }else if(key == '83'){
      y--;
    }else if(key == '65'){
      x--;
    }else if(key == '68'){
      x++;
    }
    console.log('x: ' +x)
    console.log('y: ' +y)
}
const playButton = document.getElementById("right-bottom");
const gaulCig = document.getElementById("middle-left")
const singleCig = document.getElementById("left-middle")
gaulCig.addEventListener('click', async function () {
  x=310;
  y=310;
  moveCore()
  movement= true
});
singleCig.addEventListener('click', async function () {
  x=-310;
  y=-310;
  moveCore()
  movement= true

});
playButton.addEventListener('click', async function () {
  x=-0.1;
  y=-0.1;
  moveCore()
  movement= true

});
async function moveCore(){
  if (movement == true){
    return;
  }
  const move = () => {
    const later = audioCtx.currentTime + 0.016; 
    for(const [sample, panner] of Object.entries(panners)){
      panner.positionX.value =spMap[sample][0] -x;
      panner.positionY.value  = spMap[sample][1]-y;
    }
    requestAnimationFrame(move);
  };


  for(let i=0; i<sampleList.length; i++){
    const source = audioCtx.createBufferSource();

    panners[sampleList[i]] = new PannerNode(audioCtx)
    panners[sampleList[i]].panningModel='HRTF'
    panners[sampleList[i]] .positionX.value = startingPositions[i][0]
    panners[sampleList[i]] .positionY.value = startingPositions[i][1]
    spMap[sampleList[i]] = startingPositions[i]
    samplePath = './samples/' + sampleList[i] + '.mp3'
    var audioBuffer = await loadBuffer(samplePath);
    source.connect(panners[sampleList[i]]).connect(audioCtx.destination);
    source.buffer = audioBuffer;
    source.start();
    setTimeout(function(){
      source.stop()
      source.start()
  }, 100000);

  }
  
  move();
 
}