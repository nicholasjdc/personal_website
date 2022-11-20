/* Pitch set theory:
- Store pitches in array where size of array = # of "pitches"
- e.g. 0-11 western harmonic series, A-Gs, A @0 etc.
- You will need to implement functions for transpose, inverse, and retrograde of a pitch class sequence. 
Then, implement a function that takes an initial pitch class set, and randomly applies the aforementioned operations 
to generate a composition. The user should be able to change some aspect of the composition from the interface 
(e.g. the input pitch class sequence).
- Transpose:
- Inverse:
- Retrogade:
- pitch sequence -> pitch set -> pitch class set -> set class -> set class normal form
- [A3, B3, C4, G2] -> { A3, B3, C4, G2 } -> {9, 11, 0, 7} -> {0, 2, 3, 10} -> {0, 2, 4, 5}


You do not need to implement a normalization procedure. You can assume the input pitch set classes are already in normal form.
*/
iteration = 0
const noteFrequencyMap = {
    'A': 440.000000000000000,  //N - A
    'As': 466.163761518089916, //J - A#
    'B': 493.883301256124111,  //M - B
    'C': 261.625565300598634,  //Z - C
    'Cs': 277.182630976872096, //S - C#
    'D': 293.664767917407560,  //X - D
    'Ds': 311.126983722080910, //D - D#
    'E': 329.627556912869929,  //C - E
    'F': 349.228231433003884,  //V - F
    'Fs': 369.994422711634398, //G - F#
    'G': 391.995435981749294,  //B - G
    'Gs': 415.304697579945138, //H - G#
}

pitchSetOrientation = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B']
globalSetClass= []
//Movement functions
//Assume clockwise movement

//set Generation functions
//Start w/ pitchClass Set, start w/ genSetClass
//Temporarily ignore normalization procedure
function play(setClass, localIter){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   
    
    randomAdjustment = randomIntFromInterval(1,3)
    if(randomAdjustment == 1){
        pitchSetOrientation = ccTranspose(pitchSetOrientation)
        drawDihedral()
    }else if(randomAdjustment == 2){
        pitchSetOrientation = inverse(pitchSetOrientation)
        drawDihedral()

    }else{
        pitchSetOrientation = retrograde(pitchSetOrientation)
        drawDihedral()
    }

    osc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    osc.connect(gainNode).connect(audioCtx.destination);
    osc.start()
    gainNode.gain.value = 0;
    genNotes(setClass, localIter);
}
function genNotes(sequence, localIter){
    console.log("GENNOTES")
    currentLength = 0
    sequence.forEach(interval =>{
        newDuration = 0.2+Math.random()/2
        note = {
            id: makeid(9),
            pitch: noteFrequencyMap[pitchSetOrientation[interval]],
            endTime: currentLength+newDuration,
            startTime: currentLength,
        }
        currentLength += newDuration
        playNote(note)
        
    });
    console.log(currentLength)
    console.log("ITERATION: " + iteration)
    console.log("LOCALITERATION: " + localIter)
    if(iteration == localIter){
        setTimeout(() =>play(sequence, localIter), currentLength*1000)
    }
}
function playNote(note){
        offset = 1
        gainNode.gain.setTargetAtTime(0.8, note.startTime+offset, .01)
       osc.frequency.setTargetAtTime(note.pitch, note.startTime+offset, 0.001)
       gainNode.gain.setTargetAtTime(0, note.endTime+offset-0.05, .001)
      
}
function genPitchClassSet(pitchSet){
    pitchClassSet = []
    console.log("PITCHSET")
    console.log(pitchSet)
    pitchSet.forEach(el=>{
        pitchSetOrientation.forEach((p, id)=>{
            if(el[0]==p){
                console.log("FOUND")
                console.log(id)
                pitchClassSet.push(id)

            }
        })
    });
    return pitchClassSet
}
function genSetClass(pitchClassSet){
    //For right now pause here, assume given normal form
    setClass = []
    baseValue = pitchClassSet[0]
    pitchClassSet.forEach( v => {
        setValue = v - baseValue ;
        if(setValue < 0){
            setValue +=12 //length of pitchset Orientation, should be based off of length instead
        }else{
        }
        setClass.push(setValue)
    });
    document.getElementById("setClass").innerHTML = "Current Set Class {"+ setClass + "}"
    return setClass

}
function genSetClassNormalForm(setClass){
    setClassNormalForm = []
//Temporarily Ignore
    
}
//Transformation operations
/*
function ccTranspose(sequence, n){
    //rotation operation
    newSequence = []
    for(let i=0; i< sequence.length; i++){
        newSequence.push((sequence[i] +n) %12)
    }

    return newSequence

}
function inverse(sequence){
    //flip operation, along vertical axis
    newSequence = []
    for(let i=0; i< sequence.length; i++){
        newSequence.push((12 -sequence[i]) %12)
    }

    return newSequence

}
*/
function retrograde(sequence){
    console.log("GLOBAL SET CLASS: " + globalSetClass)
    newSequence = sequence
    lastEntry = globalSetClass[globalSetClass.length-1]

    rotNumber = sequence.length-lastEntry

    for (i=0; i<lastEntry;i++){
        newSeqeunce = ccTranspose(newSequence)
    }
    console.log(sequence)
    newSequence = inverse(newSequence)
    console.log(sequence)
    return newSequence
}

//Id function taken from stack overflow
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





//Transformations by movement of circle
//Counter clockwise transposition
function ccTranspose(sequence){
    //rotation operation
    newSequence = []
    for(let i=1; i< sequence.length; i++){
        newSequence.push(sequence[i%12])
    }
    newSequence.push(sequence[0])

    return newSequence

}
function inverse(sequence){
    //flip operation, along vertical axis
    newSequence = []
    for(let i=0; i< sequence.length; i++){
        newSequence.push(sequence[(12-i) %12])
    }

    return newSequence

}
/*
function retrogade(sequence){
    newSequence = []
    for(let i=0; i< sequence.length; i++){
        newSequence.push(sequence[(12-i) %12])
    }

    return newSequence
    invertSeq = inverse(sequence)

}
*/
const playButton = document.getElementById("play")
const transposeButton = document.getElementById("transpose")
const inverseButton = document.getElementById("inverse")
const retrogradeButton = document.getElementById("retrograde")

playButton.addEventListener('click', function(){
    ps = document.getElementById("pitchSequence").value
    pitchSequence = ps.split(' ')
    
    pitchClassSet = genPitchClassSet(pitchSequence)
    globalSetClass = genSetClass(pitchClassSet)
    iteration++
    play(globalSetClass, iteration)
}, false);

transposeButton.addEventListener('click', function() {
    pitchSetOrientation = ccTranspose(pitchSetOrientation)
    drawDihedral()
}, false);
inverseButton.addEventListener('click', function() {
    pitchSetOrientation = inverse(pitchSetOrientation)
    drawDihedral()
}, false);

retrogradeButton.addEventListener('click', function() {
    pitchSetOrientation = retrograde(pitchSetOrientation)
    drawDihedral()
}, false);

//STACK OVERFLOW SECTION
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
//VISUALS
drawDihedral()
function drawDihedral(){
    var canvas = document.getElementById("hexagon")
    var ctx = document.getElementById('hexagon').getContext('2d');
    
    ctx.clearRect(0, 0, hexagon.width, hexagon.height);


    var numberOfSides = pitchSetOrientation.length,
        size = 200,
        Xcenter = 300,
        Ycenter = 250;

    ctx.beginPath();
    ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    for (var i = 1; i <= numberOfSides;i += 1) {
    newXCenter = Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides)
    newYCenter = Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides)

    if(newXCenter>Xcenter){
        xTextCenter = newXCenter + 35 *Math.cos(i * 2 * Math.PI / numberOfSides)
        xTextAnnoCenter = newXCenter + 15 *Math.cos(i * 2 * Math.PI / numberOfSides)
    }else{
        xTextCenter = newXCenter + 60 *Math.cos(i * 2 * Math.PI / numberOfSides)
        xTextAnnoCenter = newXCenter + 30 *Math.cos(i * 2 * Math.PI / numberOfSides)
    }
   
    if(newXCenter>Xcenter){
        yTextCenter = newYCenter + 35 *Math.sin(i * 2 * Math.PI / numberOfSides)
        yTextAnnoCenter = newYCenter + 10 *Math.sin(i * 2 * Math.PI / numberOfSides)
    }else{
        yTextCenter = newYCenter + 30 *Math.sin(i * 2 * Math.PI / numberOfSides)
        yTextAnnoCenter = newYCenter + 15 *Math.sin(i * 2 * Math.PI / numberOfSides)
    }
   
    

        ctx.font = "20px Arial"
    numberAnno = i-9
    if (numberAnno <0){
        numberAnno+=12
    }
    ctx.fillText(pitchSetOrientation[numberAnno], xTextAnnoCenter, yTextAnnoCenter)
    ctx.fillText(numberAnno, xTextCenter, yTextCenter);

    ctx.lineTo (newXCenter, newYCenter);
    }

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();
}
