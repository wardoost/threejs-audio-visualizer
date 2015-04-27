var context;
var source, sourceJs;
var analyser;
var url = 'assets/shipibo-icaro.mp3';
var array = new Array();
var boost = 0;

try {
	if(typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
		context = new webkitAudioContext();
	}
	else {
		context = new AudioContext();
	}
}
catch(e) {
	console.log('Web Audio API is not supported in this browser');
}
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

request.onload = function() {
	context.decodeAudioData(
		request.response,
		function(buffer) {
			if(!buffer) {
				console.log('Error decoding file data');
				return;
			}

			sourceJs = context.createScriptProcessor(2048, 1, 1);
			sourceJs.buffer = buffer;
			sourceJs.connect(context.destination);
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.6;
			analyser.fftSize = 512;

			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;

			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(context.destination);

			sourceJs.onaudioprocess = function(e) {
				array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				boost = 0;
				for (var i = 0; i < array.length; i += array.length / cubes.length) {
		            boost += array[i];
		        }
		        boost = boost / array.length;
			};

			play();
		},
		function(error) {
			console.log('Decoding error:' + error);
		}
	);
};

request.onerror = function() {
	console.log('buffer: XHR error');
};

request.send();

function displayTime(time) {
	if(time < 60) {
		return '0:' + (time < 10 ? '0' + time : time);
	}
	else {
		var minutes = Math.floor(time / 60);
		time -= minutes * 60;
		return minutes + ':' + (time < 10 ? '0' + time : time);
	}
}

function play() {
	source.start(0);
}