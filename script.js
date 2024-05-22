window.onload = function () {//excecute this when the window is on load
    var canvas;
    var canvas_width = 900;
    var canvas_height = 600;

    //we will view the canvas as grided with square blocks of size block_size * block_size
    //we need this because we will think of the snake as unions of these imaginary bocks
    var block_size = 30;
    var ctx;
    var delay = 100; //unit is in milisecond
    // var x_coord = 0;
    // var y_coord = 0;
    var snakee;

    init();

    function init() {
        //canvas is for drawing
        canvas = document.createElement('canvas');
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        canvas.style.border = '2px solid';

        //to attach the above properties to the html page
        document.body.appendChild(canvas);

        //to draw in canvas, we need the so-called context
        ctx = canvas.getContext('2d');

        //let's just consider this snake as an example to draw for an initial position
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], 'right');

        refresh_canvas();
    }

    function refresh_canvas() {
        // ctx.clearRect(0, 0, canvas_width, canvas_height);//initialize the rect position
        // x_coord += 2; 
        // y_coord += 2;
        // ctx.fillStyle = 'red';
        // //create a rectangle. args: x, y, w, h (all unit in px). x: x-distance from the left-top corner of the canvas, similarly for the y. w and h are width and height of the rectangle
        // ctx.fillRect(x_coord, y_coord, 100, 50);

        snakee.draw();
        snakee.move();
        //to call a certain function each time a certain delay has passed
        setTimeout(refresh_canvas, delay);

    }


    //snake prototype:
    // the snake body will be union of grid blocks,
    // each block is refered by a pair [x, y] where x is the number of blocks to its left
    // and y to its top.
    //so the snake will be represented by an array of arrays(2) where the first element represents the block pf its head
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;//direction where the snake moves

        //to draw the snake
        this.draw = function () {
            ctx.save();//save the previous ctx of the canvas
            ctx.fillStyle = 'red';
            for (i = 0; i < this.body.length; i++) {
                draw_block(ctx, this.body[i]);
            }
            ctx.restore();
        };

        //to move the snake:add one block where its head will be (depending on the direction), and erase its tail
        this.move = function () {
            var head_new_position = this.body[0].slice();//make a copy of this.body[0]

            //the new head position depending on the direction
            switch (this.direction) {
                case 'right':
                    head_new_position[0] += 1;
                    break;
                case 'down':
                    head_new_position[1] += 1;
                    break;
                case 'left':
                    head_new_position[0] -= 1;
                    break;
                case 'up':
                    head_new_position[1] -= 1;
                    break;
                default:
                    throw ('Invalid direction');
            }

            //append this new position to body as its first element
            this.body.unshift(head_new_position);

            //delete the tail
            this.body.pop();
        };

        this.set_direction = function (new_direction) {
            var possible_directions;
            switch (this.direction) {
                case 'left':
                case 'right':
                    possible_directions = ['up', 'down'];
                    break;
                case 'up':
                case 'down':
                    possible_directions = ['left', 'right'];
                    break;
                default:
                    throw ('Invalid direction');
            }
            if (possible_directions.indexOf(new_direction) > -1) {//that is new_direction is in the list possible_directions
                this.direction = new_direction;
            }
        };

    }

    function draw_block(ctx, position) {
        var x = position[0] * block_size; //unit in px 
        var y = position[1] * block_size;
        ctx.fillRect(x, y, block_size, block_size);
    }

    document.onkeydown = function handle_keydown(e) {//excecute when the user use keyboard
        var key = e.keyCode;
        var new_direction;
        switch (key) {
            case 37://code for left arrow
                new_direction = 'left';
                break;
            case 38://code for up arrow
                new_direction = 'up';
                break;
            case 39://code for right arrow
                new_direction = 'right';
                break;
            case 40://code for down arrow
                new_direction = 'down';
                break;
            default:
                return;
        }
        snakee.set_direction(new_direction);
    }









}