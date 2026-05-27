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
		platform0.x = platform0.width/2;
		platform0.y = canvas.height - platform0.height/2;
		platform0.color = "#0012b3";
	
	var platform1 = new GameObject();
		platform1.height = 50;
		platform1.width = 1000;
		platform1.x = platform1.width/2;
		platform1.y = canvas.height - 775;
		platform1.color = "#006b6b";

	var platform2 = new GameObject();
		platform2.width = 100;
		platform2.height = 50;
		platform2.x = canvas.width - 700;
		platform2.y = canvas.height - 100;
		platform2.color = "#208100";

	
	var platform3 = new GameObject();
		platform3.width = 100;
		platform3.height = 50;
		platform3.x = platform0.width/2 + 50;
		platform3.y = canvas.height - 300;
		platform3.color = "#580081";

	var platform4 = new GameObject();
		platform4.width = 400;
		platform4.height = 50;
		platform4.x = platform0.width/2 + 725;
		platform4.y = canvas.height - 500;
		platform4.color = "#810047";

	

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
		door0.height = 200;
		door0.x = canvas.width - 50;
		door0.y = canvas.height - 200;
		door0.color = "#535032"

	// Key(s)
	var key0 = new GameObject();
		key0.width = 50;
		key0.height = 50;
		key0.x = 300;
		key0.y = canvas.height - 125;
		key0.color = "#b8a800"


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
	var chargeTimer = 1;   // 3 seconds to charge
	var chargeTimerMax = 1;
	var chargePower = 10;   

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
		player.vy *= fY;
		
		player.vy += gravity;
		
		player.x += Math.round(player.vx);
		player.y += Math.round(player.vy);


		// Collisions
		[platform0, platform1, platform2, platform3, platform4].forEach(p => platformCollision(p, player));
		canvasCollision(player);
	
		// Door proximity
		isTouchingDoor = isTouching(door0, player);
		while (door0.hitTestPoint(player.right())) 
		{ 
			player.x--; player.vx = 0; 
		}
		
		// Drawing
		[platform0, platform1, platform2, platform3, platform4, player].forEach(obj => obj.drawRect());


		//  |-------Controls & Actions-------|

		// ---> Jumping
		if(w && player.canJump && player.vy ==0)
		{
			player.canJump = false;
			player.vy += player.jumpHeight;
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
			
			if (isGravity == true)
			{
				gravity = 10;
			}
			if (isGravity == false) 
			{
				gravity = -10;
			}

			setTimeout(() => 
			{
				gravityCooldown = false;
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
			if (!jumpBoost) 
			{
				chargeTimer -= 1/60;

				if (chargeTimer <= 0) 
				{
					player.vy = -(chargePower * 5);
					jumpBoost = true;
					chargeTimer = 3;
				}
			}
		} 

		else 
		{
			if (!jumpBoost && chargeTimer < 3) 
			{
				var chargePercent = (chargeTimerMax - chargeTimer) / chargeTimerMax;
				player.vy = -(chargePower * 5 * chargePercent);
				chargeTimer = chargeTimerMax;
				jumpBoost = true;
			}
			
			if (player.canJump) 
			{
				jumpBoost = false;
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
		// Game Over Screen
	}