//Declare my variables
var canvas;
var context;
var timer;
var interval;
var gameOver = false;
var clearObj = false;
var mouse = { x: 0, y: 0 }; 


	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");	


//  |-------Game States-------|

	var currentState = 2;
	var states = [];

//  |-------Start Menu-------|
	var menuButtons = [
		{ label: "Start",    x: canvas.width/2, y: canvas.height/2,        width: 160, height: 40 },
		{ label: "Controls", x: canvas.width/2, y: canvas.height/2 + 60,   width: 160, height: 40 }
	];

	var controlsButtons = [
		{ label: "Back to Menu", x: canvas.width/2, y: canvas.height/2 + 300, width: 220, height: 50 }
	];

	var gameOverButtons = [
		{ label: "Retry",    x: canvas.width/2, y: canvas.height/2,        width: 160, height: 40 },
		{ label: "Return to Menu", x: canvas.width/2, y: canvas.height/2 + 60,   width: 160, height: 40 }
	];

	canvas.addEventListener("click", function(e) {
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;

		if (currentState == 0) {
			menuButtons.forEach(function(btn) {
			if (isClickingButton(btn, mouse)) {
				if (btn.label == "Start")    currentState = 2;
				if (btn.label == "Controls") currentState = 1;
			}
			});
		}

		else if (currentState == 1) {
			controlsButtons.forEach(function(btn) {
			if (isClickingButton(btn, mouse)) {
				if (btn.label == "Back to Menu") currentState = 0;
			}
			});
		}

		else if (currentState == 3) {
			gameOverButtons.forEach(function(btn) {
			if (isClickingButton(btn, mouse)) {
				if (btn.label == "Return to Menu") currentState = 0;
				if (btn.label == "Retry") 
				{ 
					resetGame(); 
					currentState = 2; 
				}
			}
			});
		}
	});

	canvas.addEventListener("mousemove", function(e) {
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
	});

//  |-------Game Objects-------|


	// Platform(s)
	var platform0 = new GameObject();
		platform0.height = 50;
		platform0.width = 150;
		platform0.x = 75;
		platform0.y = 775;
		platform0.color = "#5c00b3";
	
	var platform1 = new GameObject();
		platform1.height = 50;
		platform1.width = 150;
		platform1.x = 600;
		platform1.y = 50;
		platform1.color = "#5c00b3";

	var platform2 = new GameObject();
		platform2.width = 100;
		platform2.height = 50;
		platform2.x = 200;
		platform2.y = 650;
		platform2.color = "#5c00b3";

	
	var platform3 = new GameObject();
		platform3.width = 150;
		platform3.height = 50;
		platform3.x = 75;
		platform3.y = 400;
		platform3.color = "#5c00b3";

	var platform4 = new GameObject();
		platform4.width = 300;
		platform4.height = 50;
		platform4.x = 950;
		platform4.y = 350;
		platform4.color = "#5c00b3";

	var platform5 = new GameObject();
		platform5.width = 400;
		platform5.height = 50;
		platform5.x = 475;
		platform5.y = 775;
		platform5.color = "#5c00b3";

	var platform6 = new GameObject();
		platform6.width = 200;
		platform6.height = 50;
		platform6.x = 900;
		platform6.y = 775;
		platform6.color = "#5c00b3";

	var platform7 = new GameObject();
		platform7.width = 150;
		platform7.height = 50;
		platform7.x = 50;
		platform7.y = 50;
		platform7.color = "#5c00b3";

	var platform8 = new GameObject();
		platform8.width = 150;
		platform8.height = 50;
		platform8.x = 350;
		platform8.y = 50;
		platform8.color = "#5c00b3";

	var platform9 = new GameObject();
		platform9.width = 150;
		platform9.height = 50;
		platform9.x = 850;
		platform9.y = 50;
		platform9.color = "#5c00b3";

	var platform10 = new GameObject();
		platform10.width = 500;
		platform10.height = 50;
		platform10.x = 550;
		platform10.y = 350;
		platform10.color = "#000000";

	

	// Player(s)
	var player = new GameObject();
		player.width = 50;
		player.height = 50;
		player.x = 100;
		player.y = canvas.height - platform0.height - player.height/2;
		player.color = "red";
	
	
	// Door(s)
	var door0 = new GameObject();
		door0.width = 100;
		door0.height = 150;
		door0.x = canvas.width - 50;
		door0.y = canvas.height - 125;
		door0.color = "#535032";

	// Key(s)
	var key0 = new GameObject();
		key0.width = 50;
		key0.height = 50;
		key0.x = 950;
		key0.y = 300;
		key0.color = "#b8a800";


//  |-------Other Variables-------|
	
	// Friction
	var fX = .85;
	var fY = .97;
	
	// Gravity
	var gravity = 1;
	var isGravity = true;
	
	// Cooldowns
	var gravityCooldown = false;
	var dashCooldown = false;

	// Keys Pressed
	var gPressed = false;
	var fPressed = false;
	var xPressed = false;

	// Iteractables
	var isTouchingDoor = false;
	var isTouchingItem = false;
	var isTouchingSign = false;
	var isTouchingNPC = false;

	// Holding Items
	var isHoldingKey = false;

	// Message 
	var interactMessage = "";
	var messageTimer = 0;

	// Jump Boost
	var jumpBoost = false;
	var boostCooldown = false;
	var isBoosting = false;
	var chargeTimer = 1;   
	var chargeTimerMax = 1;
	var chargePower = 6;   

	// Death
	var isDead = false;

	interval = 1000/60;
	timer = setInterval(animate, interval);

function animate()
{
	context.clearRect(0,0,canvas.width, canvas.height);	
	states[currentState]();

}

//  |-------Game State Functions-------|

	// start menu
	states[0] = function() 
	{
		// Title
		context.fillStyle = "black";
		context.font = "40px Arial";
		context.textAlign = "center";
		context.fillText("My Game", canvas.width/2, canvas.height/2 - 80);

		drawButtons(menuButtons, mouse);
	}

	states[1] = function() 
	{
		drawText("CONTROLS", canvas.width/2, canvas.height/2 - 300, 40);
		drawText("Use A and D to move",                                  canvas.width/2, canvas.height/2 - 200);
		drawText("Press W to jump",                                      canvas.width/2, canvas.height/2 - 125);
		drawText("Press F to dash (there is a cooldown)",                canvas.width/2, canvas.height/2 - 50);
		drawText("Press G to shift your gravity (there is a cooldown)",  canvas.width/2, canvas.height/2 + 25);
		drawText("Press and Hold Z to activate a jump boost",            canvas.width/2, canvas.height/2 + 100);
		drawText("Press X to interact with objects",                     canvas.width/2, canvas.height/2 + 175);

		drawButtons(controlsButtons, mouse);
	}

	states[2] = function() 
	{
		// game
		player.vx *= fX;
		// player.vy *= fY;
		
		player.vy += gravity;
		
		player.x += Math.round(player.vx);
		player.y += Math.round(player.vy);


		// Collisions
		[platform0, platform1, platform2, platform3, platform4, platform5, platform6, platform7, platform8, platform9, door0].forEach(p => platformCollision(p, player));
		canvasCollision(player);

		checkDeathZones(player);   
		if (isDead) { currentState = 3; return; }

		// Door proximity
		isTouchingDoor = isTouching(door0, player);
		while (door0.hitTestPoint(player.right())) 
		{ 
			player.x--; player.vx = 0; 
		}

		isTouchingItem = isTouching(key0, player);

		
		// Drawing
		[platform0, platform1, platform2, platform3, platform4, platform5, platform6, platform7, platform8, platform9, platform10, door0, player].forEach(obj => obj.drawRect());
		[key0].forEach(obj => obj.drawCircle());

		//  |-------Controls & Actions-------|

		// ---> Jumping
		if(w && player.canJump && !isBoosting)  // add !isBoosting here
		{
			player.canJump = false;
			player.vy += gravity > 0 ? player.jumpHeight : -player.jumpHeight;
		}

		// ---> Move Side to Side
		if(a)
		{
			player.vx += -player.ax * player.force;
		}
		if(d)
		{
			player.vx += player.ax * player.force;
		}

		// ---> Dash
		if (f && !fPressed && !dashCooldown) {
			fPressed = true;
			dashCooldown = true;
			
			player.isDashing = true;
			player.dashDuration = 10;

			if (a)
			{
				player.vx = -player.dashSpeed;
			} 
			else if (d)
			{
				player.vx = player.dashSpeed;
			}
			else 
			{
				player.vx = player.dashSpeed; //set it to default
			}
		

			setTimeout(() => 
			{
				dashCooldown = false;
			}, 2000);
		}

		if (player.isDashing) {
			player.dashDuration--;
			if (player.dashDuration <= 0) {
				player.isDashing = false;
			}
		}

		if (!f) 
		{
			fPressed = false;
		}

		// ---> Gravity Shift
		if(g && !gPressed && !gravityCooldown) 
		{
			gPressed = true;
			gravityCooldown = true;

			isGravity = !isGravity;
    		gravity = isGravity ? 2 : -2;
			player.vy = 0;        // kill existing vertical momentum
  		  	player.canJump = false;

			setTimeout(() => {
				gravityCooldown = false;
				gravity = isGravity ? 1 : -1; 
			}, 3000);

		}

		if(!g) 
		{
			gPressed = false;
		}

		
		// ---> Interaction
		if (x && !xPressed && isTouchingDoor)  
		{
			xPressed = true;

			if (isHoldingKey == true) 
			{
				// clear the door
				console.log("Player does have the key.");
				
				door0.x = 1000;
				door0.y = 1000;
			}

			if (isHoldingKey == false) 
			{
				// print text
				console.log("Player does not have the key.");

				interactMessage = "You need a key to open this door.";
				messageTimer = 300;
			}
		}
		
		if (x && !xPressed && isTouchingItem && !isHoldingKey) 
		{
			xPressed = true;
			isHoldingKey = true;

			if (isHoldingKey == true) 
			{
				// clear the door
				console.log("Player picked up key.");
				
				key0.x = 1000;
				key0.y = 1000;

				interactMessage = "You picked up a key!";
				messageTimer = 300;
			}
		}

		if (!x) 
		{
			xPressed = false;
		}

		// ---> Jump Boost
		if (z) 
		{
			if (!jumpBoost && !boostCooldown)
			{
				chargeTimer -= 1/60;

				if (chargeTimer <= 0) 
				{
					player.vy = (gravity > 0 ? -1 : 1) * (chargePower * 5);
					jumpBoost = true;
					isBoosting = true;             // disable regular jump
					boostCooldown = true;
					chargeTimer = chargeTimerMax;

					setTimeout(() => {
						boostCooldown = false;
					}, 2000);
				}
			}
		} 
		else 
		{
			if (!jumpBoost && !boostCooldown && chargeTimer < chargeTimerMax)
			{
				var chargePercent = (chargeTimerMax - chargeTimer) / chargeTimerMax;
				player.vy = (gravity > 0 ? -1 : 1) * (chargePower * 5 * chargePercent);
				chargeTimer = chargeTimerMax;
				jumpBoost = true;
				isBoosting = true;                 // disable regular jump
				boostCooldown = true;

				setTimeout(() => {
					boostCooldown = false;
				}, 2000);
			}
			
			if (player.canJump) 
			{
				jumpBoost = false;
				isBoosting = false;                // re-enable regular jump on landing
			}
		}


		if (messageTimer > 0) 
		{
			context.fillStyle = "black";
			context.font = "16px Arial";
			context.textAlign = "center";
			context.fillText(interactMessage, canvas.width/2, canvas.height/2 + 40);
			messageTimer--;
		}
	}

	states[3] = function() 
	{
		// Title
		context.fillStyle = "black";
		context.font = "40px Arial";
		context.textAlign = "center";
		context.fillText("Game Over!", canvas.width/2, canvas.height/2 - 80);

		drawButtons(gameOverButtons, mouse);
	}