// Simülasyon değişkenleri
var FPS = 60;
var particleIndex = 0; 
var particles = {};


// Genel fizik değişkenleri
gravity = new Vector(Math.PI, 0.02);
var drag = 0.999;
elasticity = 0.75;
mass_of_air = 0.2;

// Parçacık classımız
function Particle(x,y,size, mass=1){
	this.x = x;
	this.y = y;
	this.size = size;
	this.mass = mass;
	this.color = "rgba(0, 0, 0," + this.mass/this.size + ")";
	
	this.drag = Math.pow( this.mass/(this.mass + mass_of_air/100), this.size );
	this.isDragging = false;
	
	this.speed = 0;
	this.angle = 0;
	
	this.display = function(){

		this.color =  "rgba(0, 0,"+ Math.round(255 - 255* this.mass/35) +","+ (this.mass/this.size + 0.1 )+")";
		
		if(this == selected_particle){
			if(this.isDragging){
				this.color = "rgba(255, 255,0," + (this.mass/this.size + 0.1 )+ ")";
			}
			drawCircle(this.x,this.y,this.size,this.color);
			drawCircle(this.x,this.y,3,"red");
		} else{
			drawCircle(this.x,this.y,this.size,this.color);
		}
	}
	
	this.move = function(){		
			var newVec = AddVectors(Vector(this.angle, this.speed), gravity);
			this.angle = newVec.angle;
			this.speed = newVec.len * this.drag;

			// this.speed *= this.drag;

			this.x += Math.sin(this.angle) * this.speed;
			this.y -= Math.cos(this.angle) * this.speed;
	}
	
	this.bounce = function(){
		if( this.x + this.size > W){
			this.x = W - this.size;
			this.angle = -this.angle;
			this.speed *= elasticity;
		}
		else if ( this.x < this.size){
			this.x = this.size;
			this.angle = -this.angle;
			this.speed *= elasticity;
		}
		if(this.y + this.size > H){
			this.y = H - this.size;
			this.angle = Math.PI - this.angle;
			this.speed *= elasticity;
		} 
		else if( this.y < this.size) {
			this.y = this.size;
			this.angle = Math.PI - this.angle;		
			this.speed *= elasticity;
		}
	}
	
	this.id = particleIndex;
	particleIndex++;
}

particles[particleIndex] = new Particle(110,150,35,10);
particles[particleIndex] = new Particle(250,150,15,10);
particles[particleIndex] = new Particle(450,150,25,5);

selected_particle = false;

function loop(){
	
	ctx.clearRect(0,0,W,H);

	if(selected_particle){
		if(selected_particle.isDragging){
			dx = mouseX - selected_particle.x;
			dy = mouseY - selected_particle.y;
			selected_particle.angle = Math.atan2(dy, dx) + 0.5*Math.PI;
			selected_particle.speed = Math.hypot(dx, dy) * 0.5;

			selected_particle.x = mouseX;
			selected_particle.y = mouseY;
			if(!MouseDown){
				selected_particle.isDragging = false;
			}
		}
	}
	
	let total_momentum = 0;
	for(var i in particles){
		if(particles[i] != selected_particle.isDragging){
			particles[i].color = "black";
			if(!stopped){
				particles[i].move();
			} else{
				ctx.fillStyle = "black";
				ctx.font="15px Georgia";
				ctx.fillText("STOPPED!",410,25);
			}
			particles[i].bounce();
		}
		for(var j in particles){
			if(j != i)  
				Collide(particles[i], particles[j]);
		}
		particles[i].display();

		if(particles[i].isDead){
			delete particles[i];
			selected_particle = pickRandomProperty(particles);
		}
		total_momentum += (particles[i].mass * particles[i].speed);
		console.log(total_momentum);

	}

	if(addState){
		drawCircle(mouseX,mouseY,nSize,"blue");

		if(MouseDown){
			selected_particle = particles[particleIndex] = new Particle(mouseX,mouseY,nSize, nMass);
			addState = false;
		}
	}

	setTimeout(function(){ loop(); }, 1000/FPS);
}
loop();
