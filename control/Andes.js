loadedInterfaceName = "ANDES Control";

interfaceOrientation = "portrait";
//interfaceOrientation = "landscape";

whRatio = 2 / 3;
infoText = "Test Local. This is a demo of the ANDES Control widget for wall screen. If an OSC destination is selected it will output to the following address pattern : <br><br> /cc xValue yValue<br> /zoom yValue<br> /pan xValue yValue<br> /gv<br> /ctrc<br><br>";


pages = [[

{
    "name":"Andes",
    "type":"Andes",
    "bounds": [.45, .45, .15, .15],
},




{
    "name": "globalView",
    "type": "ButtonCanvas",
    "x": 0,
    "y": .9,
    "width": 1/5,
    "height": .15 * whRatio,
    "mode": "contact",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "label": "Global View",
    "address": "/gv",
//    "ontouchstart": "oscManager.sendOSC('/gv','i',1);",
},
{
    "name": "centerCursor",
    "type": "ButtonCanvas",
    "x": 1/5,
    "y": .9,
    "width": 1/5,
    "height": .15*whRatio,
    "mode": "contact",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "label": "Center Cursor",
    "address": "/ctrc",
//    "ontouchstart": "oscManager.sendOSC('/ctrc','i',1);",
},

{
    "name": "refresh",
    "type": "ButtonCanvas",
    "x" : 2/5,
    "y" : .9,
    "width": 1/5,
    "height": .15 * whRatio,
    "isLocal": true,
    "mode": "contact",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "ontouchstart": "interfaceManager.refreshInterface()",
    "label": "Refresh",
},


{
    "name": "infoButton",
    "type": "ButtonCanvas",
    "x": 3/5,
    "y": .9,
    "width": 1/5,
    "height": .15 * whRatio,
    "mode": "contact",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "midiType": "noteon",
    "isLocal": true,
    "ontouchstart": "control.changePage(1);",
    "label": "Info",
},

{
    "name": "tabButton",
    "type": "ButtonCanvas",
    "x": 4/5,
    "y": .9,
    "width": 1/5,
    "height": .15 * whRatio,
    "mode": "toggle",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "isLocal": true,
    "ontouchstart": "if(this.value == this.max) { control.showToolbar(); } else { control.hideToolbar(); }",
    "label": "Menu",
},


],


[
{
    "name": "infoText",
    "type": "Label",
    "x": .1,
    "y": .1,
    "width": .8,
    "height": .7,
    "value": infoText,
    "verticalCenter": false,
    "align": "left",
},
{
    "name": "backButton",
    "type": "ButtonCanvas",
    "x": 4/5,
    "y": .9,
    "width": 1/5,
    "height": .15*whRatio,
    "mode": "contact",
    "color": "#333333",
    "stroke": "#aaaaaa",
    "isLocal": true,
    "ontouchstart": "control.changePage(0);",
    "label": "Back",
},

],

];


window.Andes = function( ctx, props ) {
	this.make( ctx, props );

	this.container = document.createElement('div');
	this.container.style.position = 'absolute';
	this.container.style.left = 0 + 'px';
	this.container.style.top = 0 + 'px';
	this.container.style.width = control.deviceWidth + 'px';
	this.container.style.height = control.deviceHeight + 'px';
	this.container.style.background = 'black';
//	this.container.style.border = '1px solid white';
	this.ctx.appendChild(this.container);

	this.slider = document.createElement('div');
	this.slider.style.position = 'absolute';
	this.slider.style.left = (control.deviceWidth - this.width - 4) + 'px';
	this.slider.style.top = 0 + 'px';
	this.slider.style.width = (this.width + 2) + 'px';
	this.slider.style.height = (control.deviceHeight * ( 1 - .15 * whRatio ) - 1) + 'px';
//	this.container.style.background = 'white';
	this.slider.style.border = '1px solid grey';
	this.ctx.appendChild(this.slider);

	this.canvas = document.createElement('canvas');
//	this.canvas.style.border = this.stroke + " 1px solid";

//    this.canvas.width = parseInt(this.width+2);// + 'px';
//    this.canvas.height = parseInt(this.width+2);// + 'px';
    
    this.canvas.width = this.width+2;// + 'px';
    this.canvas.height = this.width+2;// + 'px';


	this.ctx.appendChild(this.canvas);

//        this.canvas.height = parseInt(this.height);// + 'px';
    
    this.canvas.style.top = this.y + 'px';
    this.canvas.style.left = this.x + 'px';
    this.canvas.style.position = "absolute";

    this.canvasCtx = this.canvas.getContext('2d');

	this.drawc();
	
/*
    this.canvasCtx.beginPath();
	this.canvasCtx.fillStyle="lightgrey";
	this.canvasCtx.fillRect(0+1,5,this.width-2,this.width-10);
	this.canvasCtx.fillRect(5,0+1,this.width-10,this.width-2);

	this.canvasCtx.arc(5+1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(5+1, this.width-5-1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, this.width-5-1, 5, 0, 2 * Math.PI);	

	this.canvasCtx.fill();	
*/

	return this;
};

Andes.prototype = new Widget();

Andes.prototype.unload = function() {
	this.ctx.removeChild(this.slider);
	this.ctx.removeChild(this.canvas);
}
Andes.prototype.hide = function() {
	this.slider.style.display = 'none';
	$(this.canvas).hide();
};

Andes.prototype.drawc = function(){
//	this.slider.style.display = 'none';
	this.canvasCtx.clearRect(0, 0, this.width,this.height);
	this.canvasCtx.beginPath();
	this.canvasCtx.fillStyle="lightgrey";
	this.canvasCtx.arc(this.width*0.5+1, this.width*0.5+1, this.width*0.25-2, 0, 2*Math.PI);
/*
		this.canvasCtx.shadowColor = '#999';
		this.canvasCtx.shadowBlur = 20;
		this.canvasCtx.shadowOffsetX = 5;
		this.canvasCtx.shadowOffsetY = 5;
*/
	this.canvasCtx.fill();
//	this.canvasCtx.strokeStyle="grey";
//	this.canvasCtx.stroke();
	this.canvasCtx.closePath();
}

Andes.prototype.drawe = function(){
	this.canvasCtx.clearRect(0, 0, this.width,this.height);
	
    // ctx, x, y, w, h
    // ctx, cx, cy, w, h
    // ctx, cx - w/2.0, cy - h/2.0, w, h
    
    var x = 2;
    var y = this.width/4;
    var w = this.width-2;
    var h = this.width/2;
    
    
    var kappa = .5522848,
	    ox = (w / 2) * kappa, // control point offset horizontal
	    oy = (h / 2) * kappa, // control point offset vertical
	    xe = x + w,           // x-end
	    ye = y + h,           // y-end
	    xm = x + w / 2,       // x-middle
	    ym = y + h / 2;       // y-middle
    
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle="lightgrey";
    this.canvasCtx.moveTo(x, ym);
    this.canvasCtx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.canvasCtx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.canvasCtx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.canvasCtx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    this.canvasCtx.closePath();
    this.canvasCtx.fill();
	
	
}

Andes.prototype.drawr = function(){
	//	this.slider.style.display = 'block';
	this.canvasCtx.beginPath();
	this.canvasCtx.fillStyle="lightgrey";
	this.canvasCtx.fillRect(0+1,5,this.width-2,this.width-10);
	this.canvasCtx.fillRect(5,0+1,this.width-10,this.width-2);
	
	this.canvasCtx.arc(5+1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(5+1, this.width-5-1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, this.width-5-1, 5, 0, 2 * Math.PI);	
	
	this.canvasCtx.fill();	
		
	this.canvasCtx.fillStyle="grey";
	for(i=2;i<9;i++)
		this.canvasCtx.fillRect(this.width*0.1,this.width*0.1*i-1,this.width*0.8,this.width*0.025);
	//this.canvasCtx.strokeStyle="black";
	//this.canvasCtx.stroke();
/*
	this.canvasCtx.clearRect(0, 0, this.width,this.height);
	this.canvasCtx.beginPath();
	this.canvasCtx.rect(5,2,this.width,this.heigth);
	this.canvasCtx.fillStyle="red";
	this.canvasCtx.fill();
	this.canvasCtx.stroke();
	this.canvasCtx.closePath();
*/
}

Andes.prototype.show = function() {
	this.slider.style.display = 'block';
	$(this.canvas).show();
};

var status = '/cc';

Andes.prototype.event = function(event) {
	switch(event.type){
	case "touchmove":
		switch(event.changedTouches.length){
		case 3:
			var x = (event.changedTouches[0].pageX +
				event.changedTouches[1].pageX +
				event.changedTouches[2].pageX) / 3;
			var y = (event.changedTouches[0].pageY +
				event.changedTouches[1].pageY +
				event.changedTouches[2].pageY) / 3;
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
			this.canvas.style.left = (x - this.width*0.5) + 'px';
			this.canvas.style.top = (y - this.height*0.5) + 'px';
			this.drawe();
			oscManager.sendOSC('/pan', 'ff', x, y);
			break;
		case 1:
			var x = event.changedTouches[0].pageX;
			var y = event.changedTouches[0].pageY;
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
				
			if(x > control.deviceWidth - this.width && status == '/zoom' || status == '/zoom'){
			
				if ( y - this.height * 0.5 > 0 && y - this.height * 0.5
			     		<= (control.deviceHeight * (1-0.15*whRatio) - this.width -1 ) )
					this.canvas.style.top = (y - this.height*0.5) + 'px';
				else if( y - this.height * 0.5 <= 0 )
					this.canvas.style.top = 2 + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width -1 ) + 'px';

				this.canvas.style.left = (control.deviceWidth - this.width - 2 ) + 'px';
				this.drawr();
				oscManager.sendOSC('/zoom', 'f', y);
			}
			else if(x <= control.deviceWidth - this.width || status == '/cc'){

				if ( y - this.width *0.5 + this.width*.25 > 0 && y - this.width * 0.5 + 
						this.width*.25 <= (control.deviceHeight * (1-0.15*whRatio) -
						this.width*0.5 -1 ) )
					this.canvas.style.top = (y - this.width*0.5 ) + 'px';
				else if( y - this.height *.5 <= 0 )
					this.canvas.style.top = (1 - this.width*0.5 + this.width*.25 ) + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width*0.5 -this.width*.25 -1 ) + 'px';

				if ( x - this.width * 0.5 + this.width*.25 > 0 && x - this.width * 0.5 +
						this.width*.25 <= (control.deviceWidth - this.width*0.5 -1))
					this.canvas.style.left = (x - this.width*0.5) + 'px';
				else if( x - this.width*0.5 <= 0)
					this.canvas.style.left = (1 - this.width*0.5 + this.width*.25) + 'px';
				else
					this.canvas.style.left = (control.deviceWidth - this.width*0.5 - 
						this.width*.25 -1)
				this.drawc();
				oscManager.sendOSC('/cc', 'ff', x, y);
			}
			break;
		default:
			
		}
		break;
	case "touchstart":
		switch(event.changedTouches.length){
		case 3:
			var x = (event.changedTouches[0].pageX +
				event.changedTouches[1].pageX +
				event.changedTouches[2].pageX) / 3;
			var y = (event.changedTouches[0].pageY +
				event.changedTouches[1].pageY +
				event.changedTouches[2].pageY) / 3;
			
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
			this.slider.style.display = 'none';
			this.canvas.style.left = (x - this.width*0.5) + 'px';
			this.canvas.style.top = (y - this.height*0.5) + 'px';
			status = '/pan';
			this.drawe();
			oscManager.sendOSC('/press_pan', 'ff', x, y);
			break;
		case 1:
			var x = event.changedTouches[0].pageX;
			var y = event.changedTouches[0].pageY;
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
			
			if(x > control.deviceWidth - this.width){
				this.slider.style.display = 'block';
				if ( y - this.height * 0.5 > 0 && y - this.height * 0.5
			     		<= (control.deviceHeight * (1-0.15*whRatio) - this.width -1 ) )
					this.canvas.style.top = (y - this.height*0.5) + 'px';
				else if( y - this.height * 0.5 <= 0 )
					this.canvas.style.top = 2 + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width -1 ) + 'px';
				this.canvas.style.left = (control.deviceWidth - this.width - 2) + 'px';
				this.drawr();
				status = '/zoom';
				oscManager.sendOSC('/press_zoom', 'f', y);
			}
			else {
				this.slider.style.display = 'none';
				if ( y - this.width *0.5 + this.width*.25 > 0 && y - this.width * 0.5 + 
						this.width*.25 <= (control.deviceHeight * (1-0.15*whRatio) -
						this.width*0.5 -1 ) )
					this.canvas.style.top = (y - this.width*0.5 ) + 'px';
				else if( y - this.height *.5 <= 0 )
					this.canvas.style.top = (2 - this.width*0.5 + this.width*.25 ) + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width*0.5 -this.width*.25 -1 ) + 'px';

				if ( x - this.width * 0.5 + this.width*.25 > 0 && x - this.width * 0.5 +
						this.width*.25 <= (control.deviceWidth - this.width*0.5 -1))
					this.canvas.style.left = (x - this.width*0.5) + 'px';
				else if( x - this.width*0.5 <= 0)
					this.canvas.style.left = (1 - this.width*0.5 + this.width*.25) + 'px';
				else
					this.canvas.style.left = (control.deviceWidth - this.width*0.5 - 
						this.width*.25 -1)
				this.drawc();
				status = '/cc';
				oscManager.sendOSC('/press_cc', 'ff', x, y);
			}
			break;
		default:
			
		}
		break;
	case "touchend":
		switch(event.changedTouches.length){
		case 3:
			var x = (event.changedTouches[0].pageX +
				event.changedTouches[1].pageX +
				event.changedTouches[2].pageX) / 3;
			var y = (event.changedTouches[0].pageY +
				event.changedTouches[1].pageY +
				event.changedTouches[2].pageY) / 3;
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
				
			this.slider.style.display = 'block';
			this.canvas.style.left = (x - this.width*0.5) + 'px';
			this.canvas.style.top = (y - this.height*0.5) + 'px';
			this.drawe();
			oscManager.sendOSC('/rls_pan', 'ff', x, y);
			break;
		case 1:
			var x = event.changedTouches[0].pageX;
			var y = event.changedTouches[0].pageY;
			if(y > (control.deviceHeight * ( 1 - .15 * whRatio ) - 1))
				break;
			
			this.slider.style.display = 'block';
				
			
			if(x > control.deviceWidth - this.width){
				if ( y - this.height * 0.5 > 0 && y - this.height * 0.5
			     		<= (control.deviceHeight * (1-0.15*whRatio) - this.width -1 ) )
					this.canvas.style.top = (y - this.height*0.5) + 'px';
				else if( y - this.height * 0.5 <= 0 )
					this.canvas.style.top = 2 + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width -1 ) + 'px';
				this.canvas.style.left = (control.deviceWidth - this.width - 2) + 'px';
				this.drawr();
				oscManager.sendOSC('/rls_zoom', 'f', y);
			}
			else {
				if ( y - this.width *0.5 + this.width*.25 > 0 && y - this.width * 0.5 + 
						this.width*.25 <= (control.deviceHeight * (1-0.15*whRatio) -
						this.width*0.5 -1 ) )
					this.canvas.style.top = (y - this.width*0.5 ) + 'px';
				else if( y - this.height *.5 <= 0 )
					this.canvas.style.top = (2 - this.width*0.5 + this.width*.25 ) + 'px';
				else
					this.canvas.style.top = (control.deviceHeight * (1-0.15*whRatio) -
							 this.width*0.5 -this.width*.25 -1 ) + 'px';

				if ( x - this.width * 0.5 + this.width*.25 > 0 && x - this.width * 0.5 +
						this.width*.25 <= (control.deviceWidth - this.width*0.5 -1))
					this.canvas.style.left = (x - this.width*0.5) + 'px';
				else if( x - this.width*0.5 <= 0)
					this.canvas.style.left = (1 - this.width*0.5 + this.width*.25) + 'px';
				else
					this.canvas.style.left = (control.deviceWidth - this.width*0.5 - 
						this.width*.25 -1)
				this.drawc();
				oscManager.sendOSC('/rls_cc', 'ff', x, y);
			}
			break;
		default:
			
		}

		break;
	default:

	}
};

window.ButtonCanvas = function( ctx, props ) {
	this.make( ctx, props );
	
	this.ctx = ctx;
	
	this.canvas = document.createElement('canvas');

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.ctx.appendChild(this.canvas);
  
	this.canvas.style.top = this.y + 'px';
	this.canvas.style.left = this.x + 'px';
	this.canvas.style.position = "absolute";

	this.canvasCtx = this.canvas.getContext('2d');
	
	if (props.background == undefined)
		this.background = "grey";
	else
		this.background = props.background;
	
	
	if (props.mode == undefined) {
		this.mode = "contact";
	} else {
		this.mode = props.mode;
	}

	if (typeof props.label != "undefined") {
        this.text = props.label;
        this.labelSize = props.labelSize || 12;
        {
            this.label = {"name": this.name + "Label", "type": "Label", "bounds":[props.x, props.y, props.width, props.height], "color":this.strokeColor, "value":this.text, "size":props.labelSize || 12,};
                        
            var _w = control.makeWidget(this.label);
            control.widgets.push(_w);
            if(!control.isAddingConstants)
                eval("control.addWidget(" + _w.name + ", control.currentPage);"); // PROBLEM
            else
                eval("control.addConstantWidget(" + _w.name + ");"); // PROBLEM
            
            this.label = _w;
            //this.label.label.style.backgroundColor = "rgba(255,0,0,1)";
            //this.label.show();
            //this.label.draw();
            //this.label.label.style.zIndex = 100;
        }
    }
	
};

ButtonCanvas.prototype = new Widget();


ButtonCanvas.prototype.draw = function(color) {
	
	this.canvasCtx.fillStyle = this.background;
		
	this.canvasCtx.beginPath();
	if (color != undefined)
		this.canvasCtx.fillStyle = color;
		
	//	'#' + Math.round( Math.random() * 0xFFFFFF ).toString(16);
	
	this.canvasCtx.fillRect(0+1,5,this.width-2,this.height-10);
	this.canvasCtx.fillRect(5,0+1,this.width-10,this.height-2);

	this.canvasCtx.arc(5+1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, 5+1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(5+1, this.height-5-1, 5, 0, 2 * Math.PI);
	this.canvasCtx.arc(this.width-5-1, this.height-5-1, 5, 0, 2 * Math.PI);	

	this.canvasCtx.fill();

};


ButtonCanvas.prototype.show = function() {
    //this.container.style.display = "block";
	$(this.canvas).show();
};

ButtonCanvas.prototype.hide = function() {
	$(this.canvas).hide();
};

ButtonCanvas.prototype.unload = function() {
    //this.ctx.removeChild(this.container);
    this.ctx.removeChild(this.canvas);
};


ButtonCanvas.prototype.event = function(event) {
	
	var touch = event.changedTouches[0];
	var isHit = this.hitTest( touch.pageX, touch.pageY );
	 
	switch(event.type) {
	case "touchstart":
		if ( isHit ) {
			switch (this.mode){
			case "toggle":
				this.value = (this.value == this.min) ? this.max: this.min;
				break;
			case "contact":
			default:
				this.value = this.max;
				break;
			}
			
			switch(this.value){
			case (this.min):
				this.draw();
				break;
			case (this.max):
			default:
				this.draw("white");
				break;
			}

			
			eval(this.ontouchstart);
			this.output();

		}
		break;
	case "touchend":
		if ( isHit ){
			if (this.mode != "toggle")
				this.draw();
			
			eval(this.ontouchend);
			
			}
		break;
	default:
		break;
	

	}
};

ButtonCanvas.prototype.output = function() {
    if (!this.isLocal && this.address != undefined) {
        window.oscManager.sendOSC(this.address, 'i', this.value);            
    }
}

