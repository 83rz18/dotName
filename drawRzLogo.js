var drawRzLogo = function(canvas, bgContext){
	var width = canvas.width;
	var height = canvas.height;
	var area = width*height;

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
}