//CANVAS DEĞERLERİ
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); 
var W = canvas.width;
var H = canvas.height;

var MouseDown = false;
var mouseX = W/2,
	mouseY = H/2;
	
canvas.onmousemove = function(){
	mouseY = event.y - canvas.getBoundingClientRect().top;
	mouseX = event.x - canvas.getBoundingClientRect().left;
	// console.log("X:" + MouseX +"Y:" +MouseY);
}	
canvas.onmousedown = function(){
	selected_particle = findParticle(particles, mouseX, mouseY);
	if(selected_particle){
		selected_particle.isDragging = true;
		document.getElementById("selectedId").innerHTML = selected_particle.id;
		document.getElementById("massID").innerHTML = selected_particle.mass + " ";
		document.getElementById("sizeID").innerHTML = selected_particle.size + " ";

	} else{
		document.getElementById("selectedId").innerHTML = "not selected";
		document.getElementById("massID").innerHTML = 0;
		document.getElementById("sizeID").innerHTML = 0;
	}

	MouseDown = true;
	console.log(MouseDown);
}

canvas.onmouseup = function(){
	MouseDown = false;
}

// HTML INTERAKTİVİTESİ
document.getElementById("right-content").onmousemove = function(){
	document.getElementById("grav").innerHTML = document.getElementById("grav-slider").value;
	document.getElementById("air").innerHTML = document.getElementById("air-slider").value;
	document.getElementById("elasticity").innerHTML = document.getElementById("elasticity-slider").value;

	gravity = new Vector( Math.PI, parseFloat(document.getElementById("grav-slider").value) );
	elasticity = parseFloat( document.getElementById("elasticity-slider").value);
	mass_of_air = parseFloat( document.getElementById("air-slider").value);

	for(var i in particles)
		particles[i].drag = Math.pow( particles[i].mass/(particles[i].mass + mass_of_air/100), particles[i].size );

	document.getElementById("size").innerHTML = document.getElementById("size-slider").value;
	document.getElementById("mass").innerHTML = document.getElementById("mass-slider").value;
} 

function removeBall(){
	if(selected_particle){
		selected_particle.isDead = true;
	} else{
		selected_particle = pickRandomProperty(particles);
	}
}

var addState = false;
var nSize = 25;
var nMass = 1;

function addBall(){
	addState = !addState;
	nSize = parseFloat( document.getElementById("size-slider").value);
	nMass = parseFloat( document.getElementById("mass-slider").value);
}

function Reset(){
	for(var i in particles){
		particles[i].isDead = true;
	}
}

stopped = false;
function Stop(){
	stopped = !stopped;
}
