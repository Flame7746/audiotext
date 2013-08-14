function SuperButton(canvas, size) {
	this.canvas = canvas;
	this.size = size;	// seconds of recording time

	this.time = 0;		// time pos in recording
	this.timer = null;	// recorder interval
	this.audio = null;	// audio buffer

	this.demo = 0;
	this.demos = [];	// sample audio data for demo

	try {
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.audioContext = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	var audioContext = this.audioContext;

	// load the sample sounds
	var owner = this;
	$.each(['whistling3.ogg'], function(i, name) {
		console.log("requesting " + name);
		var request = new XMLHttpRequest();
		request.open("GET", "sounds/" + name, true);
		request.responseType = "arraybuffer";
		request.onload = function() {
			audioContext.decodeAudioData(request.response, function(buffer) { 
				owner.audio = buffer;
				console.log("loaded demo #"+i+". length is "+(buffer.getChannelData(0).length/buffer.sampleRate)+" seconds.");
			});
		}
	   request.send();
	});
}

SuperButton.prototype = {
	render: function() {
		var c = this.canvas.getContext('2d');

		var width = 2;
		var cx = this.canvas.width/2;
		var cy = this.canvas.height/2;
		var r = this.canvas.width/2-width/2;

		// draw circle
		c.fillStyle = "#F00";
		c.beginPath();
		c.arc(cx, cy, r, 0, 2 * Math.PI, false);
		// draw outline
		c.fillStyle = 'red';
		c.fill();
		c.lineWidth = width;
		c.strokeStyle = '#660000';
		c.stroke();

		// draw waveform
		if(this.audio != null) {
			// gather samples and info
			function analyze(audio, bins) {
				var samples = audio.getChannelData(0);
				var rate = audio.sampleRate;
				var length = samples.length / rate;	// seconds of audio
				var binSize = Math.floor(samples.length / bins);

				var avgs = [];
				var max = 0;
				var min = 0;
				for(var b = 0; b < bins; b++) { 
					// average samples
					var total = 0;
					for(var t = 0; t < binSize; t++)
						total += samples[b * binSize + t];
					var avg = total / binSize;
					avgs[b] = avg;
					
					if(avg > max) {
						max = avg;
					} else if(avg < min) {
						min = avg;
					}
				}

				return {
					audio: audio,
					samples: samples,
					rate: rate,
					length: length,
					binSize: binSize,
					averages: avgs,
					max: max,
					min: min
				}
			}

			var maxdegrees = 360 * this.audio.getChannelData(0).length / this.size;
			var portion = this.time/this.size;
			var degrees = Math.floor(portion*maxdegrees);
			if(degrees > 360) degrees = 360;
			var data = analyze(this.audio, degrees);

			c.strokeStyle = 'blue';
			var bias = -data.min;
			var absmax = data.max + bias;
			for(var i = 0; i < data.averages.length * portion; i++) {
				var l = r * (data.averages[i] + bias) / absmax;
				var a = 2 * Math.PI * i / 360;

				c.beginPath();
				c.moveTo(cx, cy);
				c.lineTo(cx + l * Math.cos(a), cy + l * Math.sin(a));
				c.stroke();
			}
		}
	},

	play: function() {
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);       // connect the source to the context's destination (the speakers)
		source.start(0);
	},

	record: function() {
		var rate = 10;	// hz
		var btn = this;
		
		if(btn.timer == null) {
			btn.timer = setInterval(function() {
				btn.time += 1/rate;
				btn.render();
				if(btn.time > btn.size) btn.stop();
			}, 1000/rate);
		}
	},
	
	stop: function() {
		if(this.timer != null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	},

	trash: function() {
		this.stop();
		this.time = 0;
		this.render();
	}
}
