
var audioCtx;
var osc;
var highPassFilter;
const playButton = document.getElementById('babble');

function initAudio() {
    //BROWN NOISE
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    var bufferSize = 10 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;
    
        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;


    //FILTER
    //INPUT: LPF(BROWN NOISE 400)
    //CUTOFF: LPF(BROWN NOISE 14) * 400 + 500
    //Q: 0.0
    //Multiplyed by 3
    //Add 0.1
    highPassFilter = audioCtx.createBiquadFilter();
    lowPassFilterInput = audioCtx.createBiquadFilter();
    lowPassFilterLimit = audioCtx.createBiquadFilter();

    lowPassFilterInput.type = "lowpass";
    lowPassFilterInput.frequency.setValueAtTime(400, audioCtx.currentTime);
    lowPassFilterInput.gain.setValueAtTime(1, audioCtx.currentTime);

    lowPassFilterLimit.type = "lowpass";
    lowPassFilterLimit.frequency.setValueAtTime(14, audioCtx.currentTime);
    lowPassFilterLimit.gain.setValueAtTime(1, audioCtx.currentTime);

    highPassFilter.type = "highpass";
    highPassFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
    highPassFilter.gain.setValueAtTime(1, audioCtx.currentTime);
    highPassFilter.Q.setValueAtTime(12, audioCtx.currentTime);

    constOsc = audioCtx.createConstantSource();
    constOsc.offset = 500;

    modIndex = audioCtx.createGain();
    modIndex.gain.value = 2500;
   
    tempOsc = audioCtx.createOscillator();
    
    brownNoise.connect(lowPassFilterLimit).connect(modIndex)
    modIndex.connect(highPassFilter.frequency)
    
    constOsc.connect(highPassFilter.frequency)
    constOsc.start()
    brownNoise.start(0);

    finalGain = audioCtx.createGain();
    finalGain.gain.value = 3;
    brownNoise.connect(lowPassFilterInput).connect(highPassFilter).connect(finalGain).connect(audioCtx.destination)



   
}
playButton.addEventListener('click', function () {

    if (!audioCtx) {
        initAudio();
        return;
    }
    else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    else if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }

}, false);
var intervalId = window.setInterval(function(){
    console.log(highPassFilter.frequency)
    // call your function here
  }, 10000); 



