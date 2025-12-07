function Box(tempX, tempY, tempW, tempH){

    this.colorArray = ['red', 'green', 'yellow', 'blue', 'teal', 'orange', 'light'];

    this.synthNote = new p5.MonoSynth();
    this.synthNote.setADSR(.2, .1, .9, .1);

    //createSound.play();

    this.x = tempX;
    this.y = tempY;
    this.w = tempW;
    this.h = tempH;

    let options = {
        friction: .9,
        restitution: .2,
    }

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    this.hasCollided = false;

    this.boxStroke = 0;

    //this.isColliding = false;

    this.heightId;

    this.isPaused = false;

    Composite.add(engine.world, this.body);

    this.show = function(){
        var pos = this.body.position;
        var ang = this.body.angle;

        if (this.isPaused){
            fill(0, 190, 190);
        } else

        if (this.hasCollided){
            //fill(0, 255, 0);
            fill("LawnGreen");
        } else {
            fill(255);
        }

        // if (this.isColliding){
        //     stroke(255);
        // } else {
        //     stroke(0);
        // }

        stroke(this.boxStroke);

        push();

        translate(pos.x, pos.y);
        rotate(ang);
        rect(0, 0, this.w, this.h);

        pop();
    }

    this.changeStroke = function(){
        this.boxStroke = 255;
    }

    this.returnStroke = function(){
        if (this.boxStroke > 0){
            this.boxStroke -= 2;
        }
    }

    this.boxCollision = function(){
        //collisionSound.play();
    }

    this.playBoxSound = function(){
        //polySynth.noteAttack(notes[this.heightId], .05);
        this.synthNote.triggerAttack(notes[this.heightId], (.06 - (this.heightId * .002)));
    }

    this.stopBoxSound = function(){
        //polySynth.noteRelease();
    }

    this.checkHeight = function(){
        for (let j = 1; j < 11; j ++){
            if (this.body.position.y >= (airSpace - (j * airSpace / 10)) && this.body.position.y <= (airSpace - ((j-1)* airSpace / 10))){
                this.heightId = j - 1;
            } 
        }
    }

    this.newNote = function(){
        this.synthNote.triggerRelease();
        this.synthNote.triggerAttack(notes[this.heightId], (.06 - (this.heightId * .002)));
        //polySynth.noteRelease();
        //polySynth.noteAttack(notes[this.heightId], .05);
    }

    this.toggle = function(){
        console.log("toggle");
        if (!this.isPaused){
            this.synthNote.triggerRelease();
            this.isPaused = true;
            console.log("paused");
        } else {
            this.synthNote.triggerAttack(notes[this.heightId], (.06 - (this.heightId * .002)))
            this.isPaused = false;
        }
    }
}