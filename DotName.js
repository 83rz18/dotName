function DotName(){
	var animation;
	var canvas;
	var context;	
	var bgCanvas;
	var bgContext;	
	var denseness;	
	var parts = [];
	var partStat = [];	
	var mouse = {x:-100,y:-100};
	var mouseOnScreen = false;	
	var itertot = 500;
	let colorArray = [
	//reds
		'#e08297',//photo
	   // '#FF6675',
	    '#B3505A',
	//yellows
		//'#fefa0b',//photo
	    //'#B3AF47',
	    '#FFFB80',
	//blues
		//'#b1bee9',//photo
	    //'#99DDFF'     
	];
	function addListenerMulti(element, eventNames, listener) {
		var events = eventNames.split(' ');
		for (var i=0, iLen=events.length; i<iLen; i++) {
			element.addEventListener(events[i], listener, false);
		}
	}
	addListenerMulti(window, 'touchstart touchmove', function(event){
		mouse.x = event.touches[0].clientX;
		mouse.y = event.touches[0].clientY;	
	});	
	addListenerMulti(window, 'resize', function(event){
	    console.log('resize');
	    start();
	});
	this.initialize = function(canvas_id){
		canvas = document.getElementById(canvas_id);		
		bgCanvas = document.createElement(canvas_id);
		canvas.addEventListener('mousemove', MouseMove, false);
		canvas.addEventListener('mouseout', MouseOut, false);			
		start();
	}
	var start = function(){
		stopped = false;
	    partStat = [];  
	    parts = [];
	    context = undefined;
	    bgContext = undefined;	    
	    clearInterval(animation);
		denseness = Math.ceil((window.innerWidth )/500)*2+1;
	    
		context = canvas.getContext('2d');
		bgContext = bgCanvas.getContext('2d');
		
	    canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;		
		
		bgCanvas.width = window.innerWidth;
		bgCanvas.height = window.innerHeight;
		
		drawRzLogo(canvas,bgContext);
		getCoords();		
        animation = setInterval( update, 3.5 );
	}
	var getCoords = function(){	    
		var imageData, pixel, height, width;		
		imageData = bgContext.getImageData(0, 0, canvas.width, canvas.height);	
    	for(height = 0; height < bgCanvas.height; height += denseness){
    		for(width = 0; width < bgCanvas.width; width += denseness){   
       			pixel = imageData.data[((width + (height * bgCanvas.width)) * 4) - 1];
          		if(pixel == 255) {
            			drawCircle(width, height, bgCanvas.width);
          		}
    		}
    	}
	}	
	var drawCircle = function(x, y, w){
		//spread destination
		var randx = (Math.random() * canvas.width);
		var randy = (Math.random() * canvas.height);
		//spread velocity
		var velx = (x - randx) / itertot;
		var vely = (y - randy) / itertot;			
		parts.push(
			{c: colorArray[Math.floor(Math.random() * colorArray.length)],
			 x: x, //start position
			 y: y,
			 r: false, //not released
			 v:{x:velx , y: vely, z:0},
			 z: denseness * 0.4,  
			 counted:false
			}
		)
		partStat.push(
			{c: colorArray[Math.floor(Math.random() * colorArray.length)],
			 x: x, //goal position
			 y: y,
			 z: denseness * 0.4
			}
		)
	}
	var cleArray = function(array){
		for (i = 0; i < array.length; i++){		
  			context.clearRect(array[i].x-array[i].z-1, array[i].y-array[i].z-1, array[i].z*2+2, array[i].z*2+2);
		}	
	}
	var update = function(){	
		console.log('Update')		
		var i, dx, dy, sqrDist, scale;	

		cleArray(parts);
		cleArray(partStat);		


		//draw static background dots
		for (i = 0; i < partStat.length; i++){			
			//Draw the circle
			context.globalCompositeOperation='destination-over';
			context.beginPath();
			context.arc(partStat[i].x, partStat[i].y, partStat[i].z ,0 , Math.PI*2, true);
			context.fillStyle = '#1a0f09';
			context.closePath();
	    	context.fill();	
			context.globalCompositeOperation='source-over';				
		}
		parts = parts.sort(function(obj1, obj2) {
			// Ascending: first z is the least
			return obj1.z - obj2.z;
		});
		//draw action dots
		for (i = 0; i < parts.length; i++){
			//release when distance to mouse is less than 20
			dx = parts[i].x - mouse.x;
	        dy = parts[i].y - mouse.y;
	        sqrDist =  Math.sqrt(dx*dx + dy*dy);
			if (sqrDist < 20 && parts[i].r === false){
				parts[i].r = true;
			} 			
			//If the dot has been released
			if (parts[i].r == true){
				//Fly into infinity!!
				parts[i].x += parts[i].v.x;
		        parts[i].y += parts[i].v.y;
				parts[i].v.x *= .9985;
		        parts[i].v.y *= .9985;
				//if they are out of screen...kill them
				if(0>parts[i].x+parts[i].z||parts[i].x-parts[i].z>bgCanvas.width||
					0>parts[i].y+parts[i].z||parts[i].y-parts[i].z>bgCanvas.height){
					parts.splice(i,1);
				}
			}
			context.fillStyle = parts[i].c;
			context.strokeStyle = parts[i].c;
			context.lineWidth = parts[i].z/100;
			context.beginPath();
			context.fillStyle = parts[i].c;
			context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
			context.closePath();
    		context.fill();	
    		context.stroke();
		}
		//check for completion 
		var moving = false;
		for (i = 0; i < parts.length; i++){
			if(parts[i].v.x + parts[i].v.y > 0.025){moving = true;}
		}
		if(!moving){clearInterval(animation);}
			
	}	
	var MouseMove = function(e) {
	    if (e.layerX || e.layerX == 0) {
	    	//Reset particle positions
	    	mouseOnScreen = true;	    	
	        mouse.x = e.layerX - canvas.offsetLeft;
	        mouse.y = e.layerY - canvas.offsetTop;
	    }
	}	
	var MouseOut = function(e) {
		mouseOnScreen = false;
		mouse.x = -100;
		mouse.y = -100;	
	}	
}