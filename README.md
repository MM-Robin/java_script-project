# java_script-project

It is a web-based game. I created a 3D snake game for this game using the JavaScript three.js framework, HTML and CSS. The snake in this game will devour its food and lengthen. Food will be produced within the game space. The snake's head is not allowed to touch its body or the edge of the environment or the maps.
The reqiurements are given below_
1 Requirements
1. Create a gray playing field in the x - y -plane of size 10 × 10 with the origin of world space located at the center of the playing field.
2. Divide this playing field into units cells of size 1 × 1 and visualize them with a grid. Hint: use THREE.GridHelper
3. Add a snake, which initially consists of a single cube at rest, at a random unit square of the playing field.
4. Place a red ball of unit diameter at a random cell in the playing field. When the head of the snake hits the red ball grow the snake by one unit and reposition the ball to a random unit cell which is not covered by the snake.
5. Move the snake forward by one unit every 250ms. Hint: use setInterval
6. Use the arrow keys to specify the direction into which the snake moves. Make sure that the snake is at rest initially and starts moving only at the first key stroke.
7. Use a green cube for the head of the snake and blue cubes for the rest of the snake. The edge length of each cube should be 95% of the side length of a unit cell so that a small gap is visible between the cubes of the snake.
 
8. Use the alert function to report game over either when the head of the snake moves beyond the boundaries of the playing field or when the snake intersects itself. Also report the length of the snake when the game is over.
9. To make the game a little bit more challenging move the camera position on a circle with radius 7 and center (0, −7, 18) in the plane at z = 18 with an angular frequency of ω = π.
Optional: Use the three.js audio interface (see documentation) to play a sound whenever the snake eats a ball and when the game is over. This only works if you run your application using a web server.
