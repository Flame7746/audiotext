function playSound(context, buffer) {
	var source = context.createBufferSource(); // creates a sound source
	source.buffer = buffer;                    // tell the source which sound to play
	source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	source.start(0);                           // play the source now
}

function SuperButton(canvas, size) {
	this.canvas = canvas;
	this.size = size;

	this.pos = 0;		// time pos in recording
	this.audio = null;	// audio buffer

	this.demos = [];	// sample audio data for demo
	var demos = this.demos;

	try {
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.audioContext = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	var audioContext = this.audioContext;
	var request = new XMLHttpRequest();
	request.open("GET", "sounds/whistling3.ogg", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(buffer) { 
			demos[0] = buffer;
			playSound(audioContext, demos[0]);
		});
	}
	request.send();
}

SuperButton.prototype = {
	render: function() {
		var c = this.canvas.getContext('2d');
	}
}
