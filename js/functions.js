//  |-------Object Collision-------|
	
	// --> Platform(s)
	function platformCollision(platform,player) 
	{
		while(platform.hitTestPoint(player.bottom()) && player.vy >= 0) 
		{
			player.y--;
			player.vy = 0;
			player.canJump = true;
		}

		while(platform.hitTestPoint(player.left()) && player.vx <=0)
		{
			player.x++;
			player.vx = 0;
		}

		while(platform.hitTestPoint(player.right()) && player.vx >=0)
		{
			player.x--;
			player.vx = 0;
		}
		while(platform.hitTestPoint(player.top()) && player.vy <=0)
		{
			player.y++;
			player.vy = 0;
		}
	}

	// --> Objects
	function isTouching(obj, player) 
	{
		// Returns true if any side of the player is touching something (item, door, etc)
		return[player.right(), player.left(), player.top(), player.bottom()].some(p => obj.hitTestPoint(p));
	}


	// ---> Canvas
	function canvasCollision(player) 
	{
		// Left
		if (player.x - player.width/2 < 0)
		{
			player.x = player.width/2;
			player.vx = 0;
		}

		// Right
		if (player.x + player.width/2 > canvas.width)
		{
			player.x = canvas.width - player.width/2;
			player.vx = 0;
		}

		// Top
		if (player.y - player.height/2 < 0)
		{
			player.y = player.height/2;
			player.vy = 0;
		}

		// Bottom
		if (player.y + player.height/2 > canvas.height)
		{
			player.y = canvas.height - player.height/2;
			player.vy = 0;
		}
	}

    function isClickingButton(btn, mouse) 
    {
        return mouse.x >= btn.x - btn.width/2  &&
                mouse.x <= btn.x + btn.width/2  &&
                mouse.y >= btn.y - btn.height/2 &&
                mouse.y <= btn.y + btn.height/2;
    }

    function drawButtons(buttons, mouse) 
    {
        buttons.forEach(function(btn) {
            var isHovered = isClickingButton(btn, mouse);
            context.fillStyle = isHovered ? "#333" : "#666";
            context.fillRect(btn.x - btn.width/2, btn.y - btn.height/2, btn.width, btn.height);
            context.fillStyle = "white";
            context.font = "20px Arial";
            context.textAlign = "center";
            context.fillText(btn.label, btn.x, btn.y + 7);
        });
    }

    function drawText(text, x, y, size, color, align) 
    {
        context.fillStyle = color || "black";
        context.font = (size || 20) + "px Arial";
        context.textAlign = align || "center";
        context.fillText(text, x, y);
    }