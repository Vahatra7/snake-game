window.onload = function () {//excecute this when the window is on load
    var canvas;
    var canvas_width = 900;
    var canvas_height = 600;

    //we will view the canvas as grided with square blocks of size block_size * block_size
    //we need this because we will think of the snake as unions of these imaginary bocks
    var block_size = 30;
    var ctx;
    var max_delay = 200; //unit is in milisecond
    var delay_step = 50;
    var level;
    var score_step = 10; //to increase level
    var saved_score;
    var min_delay = 50;
    //level delay: 200, 150, 100, 50
    var snakee;
    var apple;
    var score;

    //needed when checking if snake bumps into a wall
    var canvas_width_blocks = canvas_width / block_size;
    var canvas_height_blocks = canvas_height / block_size;

    //track the setTimeout and clear it before refresh canvas
    var timeout;

    init();

    function init() {
        //canvas is for drawing
        canvas = document.createElement('canvas');
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        canvas.style.border = '20px solid gray';
        canvas.style.margin = '50px auto';
        canvas.style.display = 'block'
        canvas.style.backgroundColor = '#ddd';

        //to attach the above properties to the html page
        document.body.appendChild(canvas);

        //to draw in canvas, we need the so-called context
        ctx = canvas.getContext('2d');

        //let's just consider this snake as an example to draw for an initial position
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], 'right');

        apple = new Appel([10, 10]);

        delay = max_delay;
        level = 1;
        score = 0;
        saved_score = 0;
        refresh_canvas();
    }

    function refresh_canvas() {
        snakee.move();
        if (snakee.check_crash()) {
            //Game over
            game_over();
        }
        else {
            if (snakee.eating_appel(apple)) {
                score++;
                snakee.ate_apple = true;
                do {
                    apple.set_new_position();
                } while (apple.is_on_snake(snakee))//we don't want the new apple on the snake's body
            }
            ctx.clearRect(0, 0, canvas_width, canvas_height);//initialize the rect position
            //draw the score first so that the snake and appel won't be hidden by the score
            draw_score();
            snakee.draw();
            apple.draw();

            //to call a certain function each time a certain delay has passed
            if (score - saved_score == score_step && delay > min_delay) {
                delay -= delay_step;
                saved_score = score
                level++;
            }
            timeout = setTimeout(refresh_canvas, delay);
        }
    }


    //snake prototype:
    // the snake body will be union of grid blocks,
    // each block is refered by a pair [x, y] where x is the number of blocks to its left
    // and y to its top.
    //so the snake will be represented by an array of arrays(2) where the first element represents the block pf its head
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;//direction where the snake moves
        this.ate_apple = false;//used when increasing the snake's length

        //to draw the snake
        this.draw = function () {
            ctx.save();//save the previous property of the canvas (ex:color etc)
            ctx.fillStyle = 'red';
            for (i = 0; i < this.body.length; i++) {
                draw_block(ctx, this.body[i]);
            }
            ctx.restore();//restore the saved property
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

            //delete the tail only if the snake didn't eat an apple
            if (!this.ate_apple)
                this.body.pop();
            else
                this.ate_apple = false;

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
            if (possible_directions.includes(new_direction)) {//that is new_direction is in the list possible_directions
                this.direction = new_direction;
            }
        };

        this.check_crash = function () {
            var wall_crash = false;
            var self_crash = false;
            var snake_head = this.body[0];
            var snake_body = this.body.slice(1);
            var left_right_crashed = snake_head[0] < 0 || snake_head[0] >= canvas_width_blocks;
            var up_down_crashed = snake_head[1] < 0 || snake_head[1] >= canvas_height_blocks;
            if (left_right_crashed || up_down_crashed) { wall_crash = true; }
            for (i = 0; i < snake_body.length; i++) {//.incudes and .indexOf don't work
                if (snake_body[i][0] === snake_head[0] && snake_body[i][1] === snake_head[1]) {
                    self_crash = true;
                    break;
                }
            }
            return wall_crash || self_crash;
        };

        this.eating_appel = function (appel_to_eat) {
            var head = this.body[0];
            if (head[0] === appel_to_eat.position[0] && head[1] === appel_to_eat.position[1])
                return true;
            else
                return false;
        };

    }

    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], 'right');
        apple = new Appel([10, 10]);
        delay = max_delay;
        level = 1;
        score = 0;
        saved_score = 0;
        clearTimeout(timeout);
        refresh_canvas();
    }

    function draw_score() {
        ctx.save();
        ctx.font = "bold 200px Verdana";
        ctx.fillStyle = 'lightgray';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center'
        ctx.fillText(score.toString(), canvas_width / 2, canvas_height / 2);

        ctx.font = "bold 100px Verdana";
        ctx.fillText("LEVEL " + level.toString(), canvas_width / 2, 450);
        ctx.restore();
    }

    function game_over() {
        ctx.save();
        ctx.font = "bold 70px Verdana";
        //border of the text
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;

        ctx.strokeText("GAME OVER", 200, 150);
        ctx.fillText("GAME OVER", 200, 150);

        ctx.font = "bold 30px Verdana";
        ctx.strokeText("Press space to replay", 250, 180);
        ctx.fillText("Press space to replay", 250, 180);
        ctx.restore();
    }

    function draw_block(ctx, position) {
        var x = position[0] * block_size; //unit in px 
        var y = position[1] * block_size;
        ctx.fillRect(x, y, block_size, block_size);
    }

    function Appel(position) {//block position where the appel is
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = '#33cc33';
            ctx.beginPath();
            var radius = block_size / 2;
            var x_center = this.position[0] * block_size + radius;
            var y_center = this.position[1] * block_size + radius;
            ctx.arc(x_center, y_center, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        this.set_new_position = function () {
            var new_x = Math.round(Math.random() * (canvas_width_blocks - 1));
            var new_y = Math.round(Math.random() * (canvas_height_blocks - 1));
            this.position = [new_x, new_y];
        };

        //we don't want the new appel to be on the snake's body
        this.is_on_snake = function (snake_to_check) {
            var on_snake = false;
            for (i = 0; i < snake_to_check.body.length; i++) {
                if (this.position[0] === snake_to_check.body[i][0] && this.position[1] === snake_to_check.body[i][1]) {
                    on_snake = true;
                    //break;
                }
            }
            return on_snake;
        };
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
            case 32://space key
                if (snakee.check_crash())//don't restart if space was pressed before game over
                    restart();
                return;
            default:
                return;
        }
        snakee.set_direction(new_direction);
    }









}