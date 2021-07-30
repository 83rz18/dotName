function Banner(){
	// Opera 8.0+
	var animation;


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


	var canvas;
	var context;
	
	var bgCanvas;
	var bgContext;
	
	var denseness;// = Math.ceil((window.innerWidth )/500)*2+1;
	
	//Each particle/icon
	var parts = [];
	var partStat = [];
	
	var mouse = {x:-100,y:-100};
	var mouseOnScreen = false;
	
	var itercount = 0;
	var itertot = 500;

	
	this.initialize = function(canvas_id){
		canvas = document.getElementById(canvas_id);
		

		
		bgCanvas = document.createElement(canvas_id);
	

		canvas.addEventListener('mousemove', MouseMove, false);
		canvas.addEventListener('mouseout', MouseOut, false);
			
		start();
	}
	var start = function(){
	    partStat = [];  
	    parts = [];
	    context = undefined;
	    bgContext = undefined;
	    
	    clearInterval(animation);
	    
		context = canvas.getContext('2d');
		bgContext = bgCanvas.getContext('2d');
		
	    canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		
		bgCanvas.width = window.innerWidth;
		bgCanvas.height = window.innerHeight;

		var width = canvas.width;
		var height = canvas.height;
		var area = width*height;
		denseness = Math.ceil((window.innerWidth )/500)*2+1;

	//top left
	bgContext.moveTo(
		width*.5-width*.25/2,
		height*.5-width*.25/2
		);
	//bottome left
	bgContext.lineTo(
		width*.5-width*.25/2,
		height*.5+width*.25/2
		);
	//r bottom 
	bgContext.lineTo(	
		width*.5-width*.25/2+width*.05,
		height*.5+width*.25/2
		);
	//r bottom up 
	bgContext.lineTo(	
		width*.5-width*.25/2+width*.05,
		height*.5
		);
	bgContext.bezierCurveTo(
		//cp1
		width*.5-width*.25/2+width*.05,
		height*.5-width*.25/2+width*.05,
		//cp2
		width*.5-width*.25/2+width*.08,
		height*.5-width*.25/2+width*.05,
		//end
		width*.5,
		height*.5-width*.25/2+width*.05
		);
	//z top inside
	bgContext.lineTo(
		width*.5+width*.25/2-Math.sqrt(Math.pow(width*.05,2)*2),
		height*.5-width*.25/2+width*.05
		);
	//z bottom out high
	bgContext.lineTo(
		width*.45,
		height*.5+width*.25/2-width*.05
		);
	//z bottom out low
	bgContext.lineTo(
		width*.45,
		height*.5+width*.25/2
		);

	//bottom right
	bgContext.lineTo(
		width*.5+width*.25/2,
		height*.5+width*.25/2
		);
	//bottom right high
	bgContext.lineTo(
		width*.5+width*.25/2,
		height*.5+width*.25/2-width*.05	
		);
	bgContext.lineTo(
		width*.45+Math.sqrt(Math.pow(width*.05,2)*2),
		height*.5+width*.25/2-width*.05
		);
	//top right low
	bgContext.lineTo(
		width*.5+width*.25/2,
		height*.5-width*.25/2+width*.05
		);
	//top right
	bgContext.lineTo(
		width*.5+width*.25/2,
		height*.5-width*.25/2
		);
	bgContext.lineTo(
		width*.45,
		height*.5-width*.25/2
		);
	bgContext.bezierCurveTo(
		//cp1
		width*.5-width*.25/2+width*.05,
		height*.5-width*.25/2,
		//cp2
		width*.5-width*.25/2+width*.05,
		height*.5-width*.25/2+width*.03,
		//end
		width*.5-width*.25/2+width*.05,
		height*.5-width*.25/2+width*.03
		);
	bgContext.lineTo(
		width*.5-width*.25/2+width*.05,
		height*.5-width*.25/2
		);

	bgContext.fillStyle = 'rgba(0,0,0,1)';
	bgContext.fill();
	bgContext.strokeStyle = 'black'; 
	bgContext.stroke();


	getCoords();


	}
	
	var getCoords = function(){
	    
		var imageData, pixel, height, width;
		
		imageData = bgContext.getImageData(0, 0, canvas.width, canvas.height);
		
		// quickly iterate over all pixels - leaving density gaps
	    	for(height = 0; height < bgCanvas.height; height += denseness){
            		for(width = 0; width < bgCanvas.width; width += denseness){   
               			pixel = imageData.data[((width + (height * bgCanvas.width)) * 4) - 1];
                  		//Pixel is black from being drawn on. 
                  		if(pixel == 255) {
                    			drawCircle(width, height, bgCanvas.width);
                  		}
            		}
        	}

            animation = setInterval( update, 3.5 );

	}
	let colorArray= [
        '#B3AF47',
        '#99DDFF',
        '#FFFB80',
        '#FF6675',
        '#B3505A'      
	];
	
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
			 z: denseness * 0.4,  // Math.ceil(bgCanvas.width/500),
			 rank:0,
			 counted:false
			}
		)
		partStat.push(
			{c: colorArray[Math.floor(Math.random() * colorArray.length)],
			 x: x, //goal position
			 y: y,
			 z: denseness * 0.4// Math.ceil(bgCanvas.width/500)
			}
		)
	}
	window.relCount = 0;
	var update = function(){
		var i, dx, dy, sqrDist, scale;
		itercount++;
		
		console.log('Update')
		
		//clear();
		for (i = 0; i < parts.length; i++){
		
  		context.clearRect(parts[i].x-parts[i].z-1, parts[i].y-parts[i].z-1, parts[i].z*2+2, parts[i].z*2+2);
		}		
		for (i = 0; i < partStat.length; i++){
		
  		context.clearRect(partStat[i].x-partStat[i].z-1, partStat[i].y-partStat[i].z-1, partStat[i].z*2+2, partStat[i].z*2+2);
		}

		//draw static background dots
		for (i = 0; i < partStat.length; i++){
			
			//Draw the circle
			context.globalCompositeOperation='destination-over';
			context.fillStyle = '#ad9F9F';
			context.beginPath();
			context.arc(partStat[i].x, partStat[i].y, partStat[i].z ,0 , Math.PI*2, true);
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
			if (parts[i].r == true&&parts[i].rank==0){
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
			if(parts[i].rank==1){



		        if(bgCanvas.width>bgCanvas.height){
			        parts[i].y = bgCanvas.height*.5;
			        parts[i].y += parts[i].v.y;
		            	parts[i].x += parts[i].v.x;
				parts[i].z += parts[i].v.z;
			        parts[i].v.y = (bgCanvas.height*.5 - parts[i].y)*.01;
		            	parts[i].v.x = ((0 - parts[i].z) - parts[i].x + bgCanvas.width*.25)*.1;
		        	parts[i].v.z = (bgCanvas.height*3 - parts[i].z)*.01;

		        	// Create gradient
					var grd = context.createLinearGradient(0,0,0,bgCanvas.height);
					grd.addColorStop(0,'#594F4F');

					grd.addColorStop(0.399,'#594F4F');
					grd.addColorStop(0.4,parts[i].c);

					grd.addColorStop(0.599,parts[i].c);
					grd.addColorStop(0.6,'#594F4F');

					grd.addColorStop(1,'#594F4F');

					// Fill with gradient
					context.fillStyle=grd
					context.strokeStyle = parts[i].c;
					context.lineWidth = parts[i].z/100;

					context.beginPath();
					context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
					context.closePath();
		    		context.fill();	
		    		context.stroke();
		        } else {
			        parts[i].x = bgCanvas.width*.5;

			        parts[i].y += parts[i].v.y;
			        parts[i].v.y = ((0 - parts[i].z) - parts[i].y + bgCanvas.height*.25)*.1;
		            parts[i].x += parts[i].v.x;
		            parts[i].v.x = (bgCanvas.width*.5 - parts[i].x)*.01;
				    parts[i].z += parts[i].v.z;
		        	parts[i].v.z = (bgCanvas.width*3 - parts[i].z)*.01; 	

		        	// Create gradient
					var grd = context.createLinearGradient(0,0,bgCanvas.width,0);
					grd.addColorStop(0,'#594F4F');

					grd.addColorStop(0.399,'#594F4F');
					grd.addColorStop(0.4,parts[i].c);

					grd.addColorStop(0.599,parts[i].c);
					grd.addColorStop(0.6,'#594F4F');

					grd.addColorStop(1,'#594F4F');

					// Fill with gradient
					context.fillStyle=grd
					context.strokeStyle = parts[i].c;
					context.lineWidth = parts[i].z/100;

					context.beginPath();
					context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
					context.closePath();
		    		context.fill();	
		    		context.stroke();		
		    	}
			} else if(parts[i].rank==2){
				if(bgCanvas.width>bgCanvas.height){
			        parts[i].y = bgCanvas.height*.5;
			        parts[i].y += parts[i].v.y;
			        parts[i].v.y = (bgCanvas.height*.5 - parts[i].y)*.01;
		            parts[i].x += parts[i].v.x;
		            parts[i].v.x = ((bgCanvas.width + parts[i].z) - parts[i].x - bgCanvas.width*.25)*.1;
				    parts[i].z += parts[i].v.z;
		        	parts[i].v.z = (bgCanvas.height*3 - parts[i].z)*.01;

		        	// Create gradient
					var grd = context.createLinearGradient(0,0,0,bgCanvas.height);
					grd.addColorStop(0,'#594F4F');

					grd.addColorStop(0.399,'#594F4F');
					grd.addColorStop(0.4,parts[i].c);

					grd.addColorStop(0.599,parts[i].c);
					grd.addColorStop(0.6,'#594F4F');

					grd.addColorStop(1,'#594F4F');

					// Fill with gradient
					context.fillStyle=grd
					context.strokeStyle = parts[i].c;
					context.lineWidth = parts[i].z/100;

					context.beginPath();
					context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
					context.closePath();
		    		context.fill();	
		    		context.stroke();
		        } else {
			        parts[i].x = bgCanvas.width*.5;
			        parts[i].y += parts[i].v.y;
			        parts[i].v.y = ((bgCanvas.height + parts[i].z) - parts[i].y - bgCanvas.height*.25)*.1;
		            parts[i].x += parts[i].v.x;
		            parts[i].v.x = (bgCanvas.width*.5 - parts[i].x)*.01;
				    parts[i].z += parts[i].v.z;
		        	parts[i].v.z = (bgCanvas.width*3 - parts[i].z)*.01; 	

		        	// Create gradient
					var grd = context.createLinearGradient(0,0,bgCanvas.width,0);
					grd.addColorStop(0,'#594F4F');

					grd.addColorStop(0.399,'#594F4F');
					grd.addColorStop(0.4,parts[i].c);

					grd.addColorStop(0.599,parts[i].c);
					grd.addColorStop(0.6,'#594F4F');

					grd.addColorStop(1,'#594F4F');

					// Fill with gradient
					context.fillStyle=grd
					context.strokeStyle = parts[i].c;
					context.lineWidth = parts[i].z/100;

					context.beginPath();
					context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
					context.closePath();
		    		context.fill();	
		    		context.stroke();		
		    	}
			}else{
			context.beginPath();
			context.arc(parts[i].x, parts[i].y, parts[i].z ,0 , Math.PI*2, true);
			context.closePath();
	    	context.fill();	
	    	}
				
		}	
		//count released
		for (i = 0; i < parts.length; i++){
			if(parts[i].r==true&&parts[i].counted==false){
				window.relCount += 1;
				parts[i].counted = true;
				/*if count is one and rank of released is zero rank of released equals one 
				if(window.relCount==1&&parts[i].rank==0){
					parts[i].rank=1
				}
				if(window.relCount==2&&parts[i].rank==0){
					parts[i].rank=2
				}
				*/
			}
		}




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

