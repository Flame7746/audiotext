function fakeAudio(canvas) {
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "#444";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.strokeStyle = "#AAA";
	ctx.lineWidth = 1;

	var mid = canvas.height/2;

	for(var x = 0; x < canvas.width; x++) {
		var sample = Math.random()*canvas.height;

		ctx.beginPath();
		ctx.moveTo(x, mid - sample/2);
		ctx.lineTo(x, mid + sample/2);
		ctx.stroke();
	}
}
