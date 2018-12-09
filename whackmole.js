var whackmole = whackmole || (function(window, undefined) {
	
	var game = 0;
	var score = 0;
	var startingTime = 0;
	var popping = 0;
	var currentTime = 0;
	var clicked = 0;
	var moles = 0;
	var gameTimeout = 0;
	var hits = 0;
		
	var	aliveClass = "mole";
	var	deadClass = "mole-dead";
	var	hidingInterval = 750;
	var	poppingInterval = 750;
	var	moleLimit = 25;
		
	
	function getStyle(el, cssprop){
		if (el.currentStyle) {
			return el.currentStyle[cssprop];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			return document.defaultView.getComputedStyle(el, "")[cssprop];
		}
	}
		
	game = {
		mode: "start",
		
		alive: function() {
			this.mole.className = aliveClass;
			this.mole.clicked = false;
			this.mode = "main";
		},
		
		killed: function() {
			var currentTime = (new Date).getTime();
			score += (Math.floor( ( ( poppingInterval - (currentTime - startingTime) ) / poppingInterval) * 100 )) * 10;
			hits++;
			this.mole.className = deadClass;
			this.mode = "dead";
		},
		move: function() {
			moles++;
			clicked = false;
			this.mole.style.top = Math.floor(Math.random() * (parseInt(getStyle(this.stage, "height")) - parseInt(getStyle(this.mole, "height")) ) ) + "px";//Math.floor(Math.random() * 800) - mole.width + "px";  
			 
			this.mole.style.left = Math.floor(Math.random() * (parseInt(getStyle(this.stage, "width")) - parseInt(getStyle(this.mole, "width")) ) ) + "px";//Math.floor(Math.random() * 512)- mole.height + "px";  
			 
			startingTime = (new Date).getTime();
		},
		
		popup: function() {
			this.mole.style.display = (popping) ? "block" : "none";
		},
		reset: function() {
			game.mode = "main";
			popping = false;
			hits = score = moles = 0;
		},
		
		showStart: function() {
			this.startScreen.style.display = "block";
		},
		showScoreboard: function() {
			this.scoreb.style.display = "block";
		}
	}
	
	
	function setup(elementId) {
		
		var mole, scoreb, stage;
		
		
		mole = game.mole = document.createElement("div");
		mole.className = aliveClass;
		mole.style.display = "none";
		
		mole.onclick = function() {
			if (!game.mole.clicked) {
				game.killed();
				game.mole.clicked = true;
				game.scoreboard.update();
				window.clearTimeout(gameTimeout);
				step();
			}
		};
		
		
		
		
		starts = game.startScreen = document.createElement("div");
		starts.className = "startScreen";
		starts.innerHTML = "start";
		starts.style.display = "none";
		starts.onclick = function() {
			game.mode = "main";
			this.style.display = "none";
			step();
		}
		
		scoreb = game.scoreboard = document.createElement("div");
		scoreb.className = "scoreboard";
		scoreb.update = function() {
			this.innerHTML = "points: " + score + "<br />Moles: " + hits + " / " + moles;
		}
		
		ends = game.endScreen = document.createElement("div");
		ends.className = "endScreen";
		ends.style.display = "none";
		ends.innerHTML = "Play again?";
		ends.onclick = function() {
			game.reset();
			game.mode = "main"
			this.style.display = "none";
			game.startScreen.display = "none";
			step();
			
		}
		
		
		stage = game.stage = document.getElementById(elementId);
		stage.style.position = "relative";
	
		
		stage.appendChild(starts);
		stage.appendChild(scoreb);
		stage.appendChild(mole);
		stage.appendChild(ends);
		
	}
	
	
	function step() {
		switch(game.mode) {
			case "start":
				game.showStart();
				break;
			case "dead":
				gameTimeout = setTimeout(function(){
					
					step();
				}, 500);
				game.mode = "main";
				break;
			case "main":
				game.scoreboard.update();
				if (moles >= moleLimit) {
					game.mode = "end";
					gameTimeout = setTimeout(step, 10);
					break;
				}
				game.alive();
				game.popup();
				if (popping) game.move();
				popping = !popping
				
				if (popping) gameTimeout = setTimeout(step, hidingInterval);
					else gameTimeout = setTimeout(step, poppingInterval)
				
				
				break;
			case "end":
			default:
				game.scoreboard.innerHTML = "Final Score: " + score + "<br />Moles: " + hits + " / " + moles;
				game.endScreen.style.display = "block";
				break;
		}
	}
	
	
	return {
		setup: function(element) {
			setup(element);
			this.start();
		},
		start: function() {
			game.reset();
			game.mode = "start";
			step();
		},
		stop: function() {
			game.mode = "dead";
			moles = moleLimit + 1;
			window.clearTimeout(gameTimeout);
			step();
		}
	};
	
})(window);