document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //Audio control
    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.1, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);
    //Form valus
    
   setADSR();
    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);
    const setValues = document.querySelector('button');


    
    activeOscillators = {}
    activeGains = {}


    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
          playNote(key);
        }
    }
    
    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            activeGains[key].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGains[key].gain.setTargetAtTime(0, audioCtx.currentTime, releaseLength) //decay
            activeOscillators[key].stop(audioCtx.currentTime + 1);
            delete activeOscillators[key];
            delete activeGains[key];
        } 
    }
    function playNote(key) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
        osc.type = osc_type //choose your favorite waveform

        const oscGainNode = audioCtx.createGain();
        oscGainNode.gain.setValueAtTime(0, audioCtx.currentTime); //Starting gain
        osc.connect(oscGainNode).connect(globalGain);        

        osc.start();
        oscGainNode.gain.setValueAtTime(maxGain, audioCtx.currentTime, attackLength); //Attack
        oscGainNode.gain.exponentialRampToValueAtTime(sustainGain, audioCtx.currentTime + decayLength); //Decay
        activeOscillators[key] = osc;
        activeGains[key] = oscGainNode;
      }


      //VISUAL EVENT LISTENERS
      setValues.addEventListener('click', function () {

        setADSR();
    }, false);
      var mg = document.getElementById("maximum_gain");
      var sg = document.getElementById("sustain_gain")    
      var al = document.getElementById("attack_length")
      var dl = document.getElementById("decay_length")
      var rl = document.getElementById("release_length")
  
      var mgSlider = document.getElementById("maxGain");
      var sgSlider = document.getElementById("sustainGain")
      var alSlider = document.getElementById("attackLength")
      var dlSlider = document.getElementById("decayLength")
      var rlSlider = document.getElementById("releaseLength")
 
      mgSlider.addEventListener("input", function () {
    
      mg.innerHTML= "Maximum Gain (Attack Peak): " +  mgSlider.value
  }, false);
  
  sgSlider.addEventListener("input", function () {
    
    sg.innerHTML= "Sustain Gain: " + sgSlider.value
}, false);
    
    alSlider.addEventListener("input", function () {
    
    al.innerHTML= "Attack Length: " + alSlider.value
}, false);
    
    dlSlider.addEventListener("input", function () {
    
    dl.innerHTML= "Decay Length: " + dlSlider.value
}, false);

    rlSlider.addEventListener("input", function () {
    
    rl.innerHTML= "Release Length: " + rlSlider.value
}, false);
})


function setADSR(){
    //No keyboard code here, plenty of hardcoded spaghetti for the visuals
    maxGain = parseFloat(document.getElementById('maxGain').value);
    sustainGain = parseFloat(document.getElementById('sustainGain').value);
    attackLength = parseFloat(document.getElementById('attackLength').value);
    decayLength = parseFloat(document.getElementById('decayLength').value);
    releaseLength = parseFloat(document.getElementById('releaseLength').value);
    osc_type = document.getElementById('osc_type').value;
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width,c.height);
    currY = c.height
    currX = 0;
    //Attack
    ctx.font = "20px Arial";
    ctx.fillText("Attack", currX, c.height/2);
    ctx.beginPath();
    ctx.moveTo(currX, currY);

    currX += attackLength*c.width
    currY -= maxGain*c.height
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "red";
    ctx.stroke();
    //linedraw
    ctx.beginPath();
    ctx.moveTo(currX, c.height);
    ctx.lineTo(currX, 0);
    ctx.stroke();

    //Decay
    ctx.font = "20px Arial";
    ctx.fillText("Decay", currX, c.height/2);
    ctx.beginPath();
    ctx.moveTo(currX, currY);  
    currY += ((maxGain-sustainGain) *c.height)
    currX += decayLength * c.width
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currX, c.height);
    ctx.lineTo(currX, 0);
    ctx.stroke();
    
    //Sustain
    ctx.font = "20px Arial";
    ctx.fillText("Sustain", currX, c.height/2);
    ctx.beginPath();
    ctx.moveTo(currX, currY);
    currX += c.width/4
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currX, c.height);
    ctx.lineTo(currX, 0);
    ctx.stroke();

    //Release
    ctx.font = "20px Arial";
    ctx.fillText("Release", currX, c.height/2);
    ctx.beginPath();
    ctx.moveTo(currX, currY);
    currX +=releaseLength *c.width
    currY = c.height
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "purple";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currX, c.height);
    ctx.lineTo(currX, 0);
    ctx.stroke();

    
}



