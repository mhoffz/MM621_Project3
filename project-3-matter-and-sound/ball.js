function Ball(tempX, tempY, tempR){

    this.x = tempX;
    this.y = tempY;
    this.r = tempR;
    this.body = Bodies.circle(this.x, this.y, this.r)

    Composite.add(engine.world, this.body);

    this.show = function(){
        var pos = this.body.position;
        push();

        translate(pos.x, pos.y);
        ellipse(0, 0, this.r * 2);

        pop();
    }
}