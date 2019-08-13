/* ***** GAME OF LIFE OBJECT ***** */

function Game(canvas, cfg) {
  
	// Properties
	this.canvas   = canvas;
	this.ctx      = canvas.getContext && canvas.getContext('2d'),
	this.matrix   = undefined;
	this.round    = 0;
	
	// Merge of the default and delivered config.
	var defaults = {
		cellsX    : 64,
		cellsY    : 64,
		cellSize  : 10,
		gridColor : "#ddd",
    cellColor : "#000000",
    bgColor: "#FFFFFF"
	};
    // this.cfg = defaults;//$.extend({}, defaults, cfg);
    this.cfg = Object.assign(defaults, cfg || {});
	
	// Initialize the canvas and matrix.
	this.init();
}

Game.prototype = {
	
	init: function() {
		// set canvas dimensions
		this.canvas.width  = this.cfg.cellsX * this.cfg.cellSize;
        this.canvas.height = this.cfg.cellsY * this.cfg.cellSize;
        
		// initialize matrix
		this.matrix = new Array(this.cfg.cellsX);
		for (var x = 0; x < this.matrix.length; x++) {
			this.matrix[x] = new Array(this.cfg.cellsY);
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = false;
			}
		}
		
		this.draw();
	},
	
	draw: function() {
    var x, y;
		// clear canvas and set colors
		this.canvas.width = this.canvas.width;
		this.canvas.height = this.canvas.height;
		this.ctx.strokeStyle = this.cfg.gridColor;
		this.ctx.fillStyle = this.cfg.cellColor;
		
		// draw grid
		for (x = 0.5; x < this.cfg.cellsX * this.cfg.cellSize; x += this.cfg.cellSize) {
		  this.ctx.moveTo(x, 0);
		  this.ctx.lineTo(x, this.cfg.cellsY * this.cfg.cellSize);
		}

		for (y = 0.5; y < this.cfg.cellsY * this.cfg.cellSize; y += this.cfg.cellSize) {
		  this.ctx.moveTo(0, y);
		  this.ctx.lineTo(this.cfg.cellsX * this.cfg.cellSize, y);
		}
		this.ctx.strokeStyle = this.cfg.gridColor;
		this.ctx.stroke();
		
        // draw matrix
        this.ctx.fillStyle = this.cfg.bgColor;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = this.cfg.cellColor;
		for (x = 0; x < this.matrix.length; x++) {
			for (y = 0; y < this.matrix[x].length; y++) {
				if (this.matrix[x][y]) {
					this.ctx.fillRect(x * this.cfg.cellSize + 1,
					                  y * this.cfg.cellSize + 1,
									  this.cfg.cellSize - 1,
									  this.cfg.cellSize - 1);
				}
			}
		}
	},
	
	step: function() {
		// initalize buffer
    var x, y;
		var buffer = new Array(this.matrix.length);
		for (x = 0; x < buffer.length; x++) {
			buffer[x] = new Array(this.matrix[x].length);
		}
		
		// calculate one step
		for (x = 0; x < this.matrix.length; x++) {
			for (y = 0; y < this.matrix[x].length; y++) {
				// count neighbours
				var neighbours = this.countNeighbours(x, y);
				
				// use rules
				if (this.matrix[x][y]) {
					if (neighbours == 2 || neighbours == 3)
						buffer[x][y] = true;
					if (neighbours < 2 || neighbours > 3)
						buffer[x][y] = false;
				} else {
					if (neighbours == 3)
						buffer[x][y] = true;
				}
			}
		}
		
		// flip buffers
		this.matrix = buffer;
		this.round++;
		this.draw();
	},
	
	countNeighbours: function(cx, cy) {
		var count = 0;
		
		for (var x = cx-1; x <= cx+1; x++) {
			for (var y = cy-1; y <= cy+1; y++) {
				if (x == cx && y == cy)
					continue;
				if (x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[x].length)
					continue;
				if (this.matrix[x][y])
					count++;
			}
		}
		
		return count;
	},
	
	clear: function() {
		for (var x = 0; x < this.matrix.length; x++) {
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = false;
			}
		}
		
		this.draw();
	},
	
	randomize: function() {
		for (var x = 0; x < this.matrix.length; x++) {
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = Math.random() < 0.3;
			}
		}
		
		this.draw();
	},
	
	toggleCell: function(cx, cy) {
		if (cx >= 0 && cx < this.matrix.length && cy >= 0 && cy < this.matrix[0].length) {
			this.matrix[cx][cy] = !this.matrix[cx][cy];
			this.draw();
		}
	}
};