// Page variables
var gl;
var context;
var video;
var canvas;

//Variables for width and height of the canvas, as well as the capture frame size.
var width,height,frameWidth,frameHeight;

// Used to specify a time in seconds. Holds time value of video while previewing.
var time;

//Determines if the video is playing or paused.
var play = true;

// Determins if the user is in the video or is previewing captures
var preview = false;

//Used in methods that automate the process
var cont = false;
var hollowTween = false;
var period = 0;
var clock = false;

//Stores capured frames as image data.
var storage = [];

// Holds position of preview.
var i = 0;

//Mouse positions.
var mX = 540;
var mY = 960;

var periodX,periodY;

window.onload = function init(){
	video = document.createElement("video");
	video.src = /*Video File Name Here*/;
	video.playbackRate = 0.1;
	canvas = document.getElementById("stage");
	
	document.getElementById("playVideo").onclick = function(){
	 play = true;
	 video.play();
	}
	document.getElementById("pauseVideo").onclick = function(){
	 play = false;
	 video.pause();
	}
	document.getElementById("jumpToTime").onclick = function(){
		time = parseInt(document.getElementById("time").value);
		if(isFinite(time)){
			video.currentTime = time;
		}
	}
	document.getElementById("preview").onclick = function(){
		if(!preview){
			preview = true;
			time = event.currentTime;
			video.pause();
		}
		else{
			preview = false;
			if(isFinite(time)){
				video.currentTime = time;
			}
			video.play();
		}
	}
	document.getElementById("tween").onclick = function(){
		period = document.getElementById("period").value;
		var posFX = document.getElementById("posFX").value;
		var posFY = document.getElementById("posFY").value;
		if(period > 0){
			periodX = (Math.floor(posFX-mX)/period);
			periodY = (Math.floor(posFY-mY)/period);
		}
		//period *= 2;
		video.play();
	}
	document.getElementById("cont").onclick = function(){
		if(cont){
			cont = false;
		}
		else{
			cont = true;
		}
	}
			
	
	
	width = canvas.width;
	height = canvas.height;
	frameWidth = width;
	frameHeight = height;
	document.getElementById("width").innerHTML = frameWidth;
	document.getElementById("height").innerHTML = frameHeight;
	context = canvas.getContext("2d");
	gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
	if (!gl){alert("WebGL isn't available");}
	video.play();
	render();
}

function render(){
	video.ontimeupdate = function(){
		video.pause();
		if(period > 0 && clock == 1){
			tween(periodX,periodY);
			video.play();
		}
	};
	if(preview == false){
		canvas.onmousedown =
			function(event) {
				mX = event.clientX;
				mY = event.clientY;
				capture(mX,mY);
			};
			
		context.drawImage(video,0,0,width,height);
		
		// Rectangle for displaying capture location
		context.beginPath();
		context.rect(mX-(frameWidth/2),mY-(frameHeight/2),frameWidth,frameHeight);
		context.lineWidth = "5";
		context.stroke();
		
		if(cont == true && clock == 1){
			capture(mX,mY);
		}
	}
	
	else{
		if(i == storage.length){
				this.i = 0;
		}
		context.putImageData(storage[i],0,0,0,0,width,height);
		++i;
	}
	
	if(clock){
		clock = false;
	}
	else{
		clock = true;
	}
	
	requestAnimFrame( render );
}

function capture(x,y){
	document.getElementById("mouseX").innerHTML = mX;
	document.getElementById("mouseY").innerHTML = mY;
	document.getElementById("posFX").innerHTML = mX;
	document.getElementById("posFY").innerHTML = mY;
	//Centers the mouse click in the capture frame
	var imageData = context.getImageData(mX-(frameWidth/2),mY-(frameHeight/2),frameWidth,frameHeight);
	//Double push to account for playback in 60fps while video was shot in 30fps.
	storage.push(imageData);
	storage.push(imageData);
	video.play();
}

window.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
	switch (key) {
    case 'Q':
		adjustFrame(true);
	break;
    case 'W':
		adjustFrame(false);
	break;
    }
	
};

function tween(periodX,periodY){
	mX -= periodX;
	mY -= periodY;
	var imageData = context.getImageData(mX-(frameWidth/2),mY-(frameHeight/2),frameWidth,frameHeight);
	storage.push(imageData);
	storage.push(imageData);
	document.getElementById("mouseX").innerHTML = mX;
	document.getElementById("mouseY").innerHTML = mY;
	--period;
}

function adjustFrame(scale){
	if(scale){
		frameWidth += 9;
		frameHeight += 16;
		document.getElementById("width").innerHTML = frameWidth;
		document.getElementById("height").innerHTML = frameHeight;
	}
	else{
		frameWidth -= 9;
		frameHeight -=16;
		document.getElementById("width").innerHTML = frameWidth;
		document.getElementById("height").innerHTML = frameHeight;
	}
}