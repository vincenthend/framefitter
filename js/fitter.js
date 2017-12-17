
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var photo = new Image();
    var frame = new Image();
	
	var mouseDrag = false;
	
	var xpos = 0;
	var ypos = 0;
	var prevx = 0;
	var prevy = 0;	
	var photowidth;
	var photoheight;
	
	var rotation = 0;
	
    function renderFrame() {
        frame.src = 'img.png';
        frame.onload = function () {
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        };
    };
	
	function clearFrame(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}

    function uploadPic() {
        var photoFile = $("#photoInput")[0].files[0];

        var fileReader = new FileReader();
        fileReader.readAsDataURL(photoFile);

        fileReader.onload = function (e) {
            photo.src = e.target.result;
            photo.onload = function(){
				xpos = 0;
				ypos = 0;
				rotation = 0;
				$("#slider").slider("value",100);
				
				if(photo.width < photo.height){
					photowidth = canvas.width;
					photoheight = photowidth/photo.width * photo.height;
				}
				else {				
					photoheight = canvas.height;
					photowidth = photoheight/photo.height * photo.width;
				}
				
                drawImage();
                renderFrame();
            };
        };
    };
	
	function resizeImage(){
		clearFrame();
		
		if(photo.width < photo.height){
			photowidth = $("#slider").slider("value")/100 * canvas.width;
			photoheight = photowidth/photo.width * photo.height;
		}
		else {
			photoheight = $("#slider").slider("value")/100 * canvas.height;
			photowidth = photoheight/photo.height * photo.width;
		}
		
		drawImage();
		renderFrame();
	};
	
	function moveImage(){
		clearFrame();
		drawImage();
		renderFrame();
	};
	
	function rotateImage(){
		clearFrame();
		drawImage();
		renderFrame();
	}
	
	function drawImage(){
		ctx.rotate(rotation * Math.PI / 2);
		var x,y;
		
		if(rotation%4 == 1){
			x = ypos;
			y = -xpos-photoheight;
		}
		else if (rotation%4 == 2){
			x = -xpos-photowidth;
			y = -ypos-photoheight;
		}
		else if (rotation%4 == 3){
			x = -ypos-photoheight;
			y = xpos;
		}
		else if(rotation%4 == 0){
			x = xpos;
			y = ypos;
		}
		ctx.drawImage(photo, x, y, photowidth, photoheight);
		ctx.rotate(-rotation * Math.PI / 2);
	}
	
	function saveImage(){
		var dataURL = canvas.toDataURL("image/png");
		window.open(dataURL);
	}
	
    $(document).ready(function(){
        renderFrame();
    });
	
	$("#canvas").bind('mousedown touchstart', function(){
		prevx = 0;
		prevy = 0;
		mouseDrag = true;
	});
	
	$(window).bind('touchend mouseup', function(){	
		prevx = 0;
		prevy = 0;
		mouseDrag = false;
	});

	$("#canvas").bind('mousemove', function(){
		if(mouseDrag){
			if( prevx>0 || prevy>0)
			{
				xpos += event.pageX - prevx;
				ypos += event.pageY - prevy;
				moveImage();
			}
			prevx = event.pageX;
			prevy = event.pageY;
		}
	});
	
	$("#canvas").bind('touchmove', function(){
		if(mouseDrag){
			if( prevx>0 || prevy>0)
			{
				xpos += event.changedTouches[0].pageX - prevx;
				ypos += event.changedTouches[0].pageY - prevy;
				moveImage();
			}
			prevx = event.changedTouches[0].pageX;
			prevy = event.changedTouches[0].pageY;
		}
	});
	
	$("#slider").slider({
		value: 100,
		min: 1,
		max: 500,
		step: 1,
		slide : function(){
			resizeImage();
		}
	});
	