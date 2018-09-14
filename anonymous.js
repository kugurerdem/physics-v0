function Vector(angle,len){
	return {angle : angle,
			len : len};
}

function AddVectors(vector1,vector2){
	x  = Math.sin(vector1.angle) * vector1.len + Math.sin(vector2.angle) * vector2.len;
	y  = Math.cos(vector1.angle) * vector1.len + Math.cos(vector2.angle) * vector2.len;
	
	length = Math.hypot(x, y);
	angle = 0.5 * Math.PI - Math.atan2(y, x);
	return { angle: angle, 
			 len: length};
}

function Collide(p1,p2){
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	
	var distance = Math.hypot(dx, dy);

	if(distance < p1.size + p2.size){
		var angle = Math.atan2(dy, dx) + 0.5 * Math.PI;
		var total_mass = p1.mass + p2.mass;
		
		var newVector1 = AddVectors(Vector(p1.angle, p1.speed*(p1.mass-p2.mass)/total_mass), Vector(angle, 2*p2.speed*p2.mass/total_mass));
		var newVector2 = AddVectors(Vector(p2.angle, p2.speed*(p2.mass-p1.mass)/total_mass), Vector(angle+Math.PI, 2*p1.speed*p1.mass/total_mass));

		p1.angle = newVector1.angle;
		p1.speed = newVector1.len;
		p2.angle = newVector2.angle;
		p2.speed = newVector2.len;
		
		p1.speed *= elasticity;
		p2.speed *= elasticity;
		
		var overlap = 0.5*(p1.size + p2.size - distance+1);
		p1.x += Math.sin(angle)*overlap;
		p1.y -= Math.cos(angle)*overlap;
		p2.x -= Math.sin(angle)*overlap;
		p2.y += Math.cos(angle)*overlap;
		// console.log("bam");
		console.log("oi");
	}
}

function findParticle(particles, x, y){
	for(var p in particles){
		if( Math.hypot(particles[p].x-x, particles[p].y-y) <= particles[p].size){
			return particles[p];
		}
	}
	return 0;
}

function drawCircle(x,y,size,color){
	ctx.fillStyle= color; 
	ctx.beginPath(); 
	ctx.arc(x, y, size, 0, 2*Math.PI);
	ctx.fill();
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = obj[prop];
    return result;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
