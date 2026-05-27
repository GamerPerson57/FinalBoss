//  |-------Object Collision-------|
	
	// --> Platform(s)
	function platformCollision(platform, player) 
	{
		var pLeft   = platform.x - platform.width/2;
		var pRight  = platform.x + platform.width/2;
		var pTop    = platform.y - platform.height/2;
		var pBottom = platform.y + platform.height/2;

		var plLeft   = player.x - player.width/2;
		var plRight  = player.x + player.width/2;
		var plTop    = player.y - player.height/2;
		var plBottom = player.y + player.height/2;

		// No overlap at all, skip
		if (plRight <= pLeft || plLeft >= pRight || plBottom <= pTop || plTop >= pBottom) return;

		// Calculate overlap on each axis
		var overlapLeft   = plRight - pLeft;
		var overlapRight  = pRight  - plLeft;
		var overlapTop    = plBottom - pTop;
		var overlapBottom = pBottom - plTop;

		var minX = Math.min(overlapLeft, overlapRight);
		var minY = Math.min(overlapTop,  overlapBottom);

		// Resolve on the smallest overlap axis
		if (minY < minX) 
		{
			if (overlapTop < overlapBottom) 
			{
				// Player hit top of platform
				player.y = pTop - player.height/2;
				player.vy = 0;
				if (gravity > 0) player.canJump = true;
			} 
			else 
			{
				// Player hit bottom of platform
				player.y = pBottom + player.height/2;
				player.vy = 0;
				if (gravity < 0) player.canJump = true;
			}
		} 
		else 
		{
			if (overlapLeft < overlapRight) 
			{
				player.x = pLeft - player.width/2;
				player.vx = 0;
			} 
			else 
			{
				player.x = pRight + player.width/2;
				player.vx = 0;
			}
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

		// Top - only block in normal gravity
		if (gravity > 0 && player.y - player.height/2 < 0)
		{
			player.y = player.height/2;
			player.vy = 0;
		}

		// Bottom - only block in flipped gravity
		if (gravity < 0 && player.y + player.height/2 > canvas.height)
		{
			player.y = canvas.height - player.height/2;
			player.vy = 0;
		}
	}

	function checkDeathZones(player)
	{
		// Canvas top and bottom
		var hitTop    = player.y - player.height/2 <= 0;
		var hitBottom = player.y + player.height/2 >= canvas.height;

		// Platform10 (black platform)
		var hitPlatform10 = player.hitTestObject(platform10);

		if (hitTop || hitBottom || hitPlatform10)
		{
			isDead = true;
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

	function resetGame()
	{
		// Reset player
		player.x  = 100;
		player.y  = canvas.height - platform0.height - player.height/2;
		player.vx = 0;
		player.vy = 0;
		player.canJump = false;

		// Reset gravity
		gravity   = 1;
		isGravity = true;
		gravityCooldown = false;

		// Reset dash
		dashCooldown    = false;
		player.isDashing = false;

		// Reset boost
		jumpBoost    = false;
		boostCooldown = false;
		isBoosting   = false;
		chargeTimer  = chargeTimerMax;

		// Reset interactables
		isHoldingKey  = false;
		isTouchingDoor = false;
		isTouchingItem = false;
		messageTimer  = 0;
		interactMessage = "";

		// Reset key and door
		key0.x  = 950;  key0.y  = 300;
		door0.x = canvas.width - 50;
		door0.y = canvas.height - 125;

		// Reset death
		isDead = false;
	}

    function drawText(text, x, y, size, color, align) 
    {
        context.fillStyle = color || "black";
        context.font = (size || 20) + "px Arial";
        context.textAlign = align || "center";
        context.fillText(text, x, y);
    }