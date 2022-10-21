const playButton = document.getElementById('whale');
var currNumber = ""

async function loadBuffer(bufferURL) {

    const response = await fetch(bufferURL);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}
document.addEventListener("DOMContentLoaded", function(event) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    
    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(.125, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);
    const phoneFrequencyMap = {
        //0-9
        '48': [941, 1336],
        '49': [697, 1209],
        '50': [697,1336],
        '51': [697, 1477],
        '52': [770,1209],
        '53': [770, 1336],
        '54': [770, 1447],
        '55': [852, 1209],
        '56': [852, 1336],
        '57': [852, 1447],
        //A-D
        '65': [697, 1633],
        '66': [770, 1633],
        '67': [852, 1633],
        '68': [941, 1633],
        //for * and # press M and N respectively
        '77': [941, 1209],
        '78': [941, 1477]
    }
 
    noteCurrentlyPlaying = false;
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false)


    

    function keyDown(event) {
       
            const key = (event.detail || event.which).toString();
            if(!noteCurrentlyPlaying && key in phoneFrequencyMap){
                playNote(key);
             }
    }

    function keyUp(event){
        noteCurrentlyPlaying = false;
    }
    
   
    function playNote(key) {
        noteCurrentlyPlaying = true

        const osc1 = audioCtx.createOscillator();
        console.log(phoneFrequencyMap[key])
        osc1.frequency.setValueAtTime(phoneFrequencyMap[key][0], audioCtx.currentTime)

        const osc2 = audioCtx.createOscillator();
        osc2.frequency.setValueAtTime(phoneFrequencyMap[key][1], audioCtx.currentTime)

        const oscGainNode = audioCtx.createGain();
        oscGainNode.gain.setValueAtTime(6, audioCtx.currentTime); //Starting gain
        
            

        highPassFilter = audioCtx.createBiquadFilter();

        highPassFilter.type = "highpass";
        highPassFilter.frequency.setValueAtTime(750, audioCtx.currentTime);
        highPassFilter.gain.setValueAtTime(1, audioCtx.currentTime);

        bpFilter1 = audioCtx.createBiquadFilter() //bandlimiting wire
        bpFilter2 = audioCtx.createBiquadFilter() //small loudspeaker

        bpFilter1.type = "bandpass"    
        bpFilter1.frequency.value = 2000
        bpFilter1.Q.value  = 12

        bpFilter2.type = "bandpass"
        bpFilter2.frequency.value = 400
        bpFilter2.Q.value = 3

        osc1.connect(oscGainNode);
        osc2.connect(oscGainNode)
        oscGainNode.connect(bpFilter1)
        bpFilter1.connect(bpFilter2)
        bpFilter2.connect(highPassFilter)
        bpFilter1.connect(highPassFilter)
        highPassFilter.connect(globalGain);

        osc1.start();
        osc2.start();
        /*
        oscGainNode.gain.setValueAtTime(1, audioCtx.currentTime, 0.1)
        oscGainNode.gain.setValueAtTime(.7, audioCtx.currentTime, 0.05)
        */
        //oscGainNode.gain.exponentialRampToValueAtTime(.5, audioCtx.currentTime+.1)
        //oscGainNode.gain.exponentialRampToValueAtTime(.3, audioCtx.currentTime+.15)
       // oscGainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 2)


        
        osc1.stop(audioCtx.currentTime +0.2);
        osc2.stop(audioCtx.currentTime+0.2);
      }


   
})

async function phoneCall(){
    var bufferSize = 10 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
    }
    whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);

    dialOsc1 = audioCtx.createOscillator();
    dialOsc2 = audioCtx.createOscillator();
    dialOsc1.frequency.value = 440
    dialOsc2.frequency.value = 350

    dialGainNode = audioCtx.createGain();
    finalGainNode= audioCtx.createGain();
    finalGainNode.gain.value = 5;

    dialGainNode.gain.value = 1.5

    bpFilter1 = audioCtx.createBiquadFilter() //bandlimiting wire
    bpFilter2 = audioCtx.createBiquadFilter() //small loudspeaker

    bpFilter1.type = "bandpass"    
    bpFilter1.frequency.value = 2000
    bpFilter1.Q.value  = 12

    bpFilter2.type = "bandpass"
    bpFilter2.frequency.value = 400
    bpFilter2.Q.value = 3
    
    whLowShelfFilter = audioCtx.createBiquadFilter();
    whHighShelfFilter = audioCtx.createBiquadFilter();
    whPeaking = audioCtx.createBiquadFilter();

    whPeaking.frequency.value = 200
    whPeaking.gain.value = -1
    whPeaking.Q.value = 3

    whLowShelfFilter.type = "lowshelf"
    whLowShelfFilter.frequency.value = 3000

    whHighShelfFilter.type = "highshelf"
    whHighShelfFilter.frequency.value = 400

    whiteNoiseGain = audioCtx.createGain()
    whiteNoiseGain.gain.value = .25
    whiteNoise.connect(whiteNoiseGain)
    whiteNoiseGain.connect(whLowShelfFilter)
    whiteNoiseGain.connect(whHighShelfFilter)

    dialOsc1.start()
    dialOsc2.start()
    dialOsc1.connect(dialGainNode)
    dialOsc2.connect(dialGainNode)
    whLowShelfFilter.connect(whPeaking).connect(bpFilter2)
    whHighShelfFilter.connect(whPeaking.frequency)

    dialGainNode.connect(bpFilter1)
    bpFilter1.connect(bpFilter2)
    bpFilter2.connect(finalGainNode)
    bpFilter1.connect(finalGainNode)

    finalGainNode.connect(audioCtx.destination)
    dialOsc1.stop(audioCtx.currentTime+3)
    dialOsc2.stop(audioCtx.currentTime+3)
    whiteNoise.stop(audioCtx.currentTime +3)
    var audioBuffer = await loadBuffer('pizza shop.mp3')
    const source = audioCtx.createBufferSource();
    source.connect(audioCtx.destination)
    source.buffer = audioBuffer;
    source.start(audioCtx.currentTime + 3.1)

}


playButton.addEventListener('click', function () {
    phoneCall();

}, false);
/*
var intervalId = window.setInterval(function(){
    console.log(highPassFilter.frequency)
    // call your function here
  }, 10000); 
  */