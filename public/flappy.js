let mostPointsGen = 0;
let mostPointsAll = 0;
let generation = 0;
let population;
let obstacles = []
let maxGenes = 500;
let count = 0;
let generationP;
let mostPointsGenP
let mostPointsAllP
let frameP
let pipeValues = []
let pipeNum = 0;



class Bird{
    constructor(dna){
        this.y = height / 2
        this.x = 64
        this.gravity = 0.6
        this.lift = -16
        this.velocity = 0
        this.fitness = 0;
        this.crashed = false;

        if(dna){
            this.dna = dna;
        } else {
            this.dna = new DNA();
        }
    }

    reset(){
        this.y = height / 2
        this.x = 64
        this.gravity = 0.6
        this.lift = -16
        this.velocity = 0
        this.fitness = 0;
        this.crashed = false;
    }

    show(){
        if(!this.crashed){
            push();
            noStroke();
            fill(150,150)
            ellipse(this.x, this.y, 32, 32)
            pop();
        }
    }

    // calcFitness(){
    //     //console.log(obstacles[0].gapStart + 50)
    // //    console.log(this.y)
    //     let d = Math.abs(this.y - (obstacles[0].gapStart + 50))
    //     console.log(d)
    //     this.fitness = this.fitness/d
    // }


    goUp() {
        this.velocity += this.lift
    }

    update() {
        if(!this.crashed){
            if(this.dna.genes[count]){
                this.goUp()
            }
            this.velocity += this.gravity
            this.velocity *= 0.9
            this.y += this.velocity

            if (this.y > height) {
                this.y = height
                this.velocity = 0
            }

            if (this.y < 0) {
                this.y = 0
                this.velocity = 0
            }
        }
        for(let i = 0; i < obstacles.length;i++){
            if (this.y < obstacles[i].gapStart || this.y > obstacles[i].gapStart + obstacles[i].gapLength) {
                if (this.x > obstacles[i].x && this.x < obstacles[i].x + obstacles[i].w) {
                    this.crashed = true;
                }
            }
        }
    }
}

class DNA{
    constructor(genes){
        if(genes){
            this.genes = genes;
        } else {
            this.genes = [];
            for(let i = 0; i < maxGenes; i++){
                let geneToGive;
                let randNum = Math.random()
                if(randNum < .05){
                    geneToGive = true;
                } else {
                    geneToGive = false;
                }
                this.genes[i] = geneToGive
            }
        }
    }

    add(numberGenes){
        for(let i = 0; i < numberGenes; i++){
            let geneToGive;
            let randNum = Math.random()
            if(randNum < .05){
                geneToGive = true;
            } else {
                geneToGive = false;
            }
            this.genes.push(geneToGive)
        }
    }

    crossover(partner){
        let newGenes = []
        let mid = floor(random(this.genes.length))
        let mutationRate = .01
        for(let i = 0; i < this.genes.length; i++){
            if(i > mid){
                newGenes[i] = this.genes[i]
            } else{
                newGenes[i] = partner.genes[i];
            }
        }

        for(let i = 0; i < this.genes.length; i++){
            let random = Math.random()
            if(random < mutationRate){
                let geneToGive;
                let randNum = Math.random()
                if(randNum < .05){
                    geneToGive = true;
                } else {
                    geneToGive = false;
                }
                this.genes[i] = geneToGive
            }
        }
        return new DNA(newGenes);
    }
}

class Obstacle{
    constructor(pipeNum){
        this.x = width
        this.w = 30
        this.gapStart = pipeValues[pipeNum]
        //this.gapStart=-
        this.gapLength = 100
        this.speed = 5
    }

    show() {
        fill(0)
        rect(this.x, 0, this.w, this.gapStart)
        rect(this.x, (this.gapStart  + this.gapLength), this.w, height)
    }
    update() {
        this.x -= this.speed
    }
    offscreen() {
        return this.x < -this.w
    }
}

class Population{
    constructor(){
        this.birds = [];
        this.popsize = 250;
        for(let i = 0; i < this.popsize; i++){
            this.birds[i] = new Bird();
        }
    }

    updateScore(){
        for(let i = 0; i < this.birds.length; i++){
            if(!this.birds[i].crashed){
                this.birds[i].fitness = this.birds[i].fitness + 1
            }
        }
    }

    //run through all of the rockets and calculate fitness
    evaluate(){
        let mostPoints = 0;
        for(let i = 0; i < this.popsize; i++){
            if(this.birds[i].fitness > mostPoints){
                mostPoints = this.birds[i].fitness
            }
            mostPointsGen = mostPoints;
            if(mostPointsGen > mostPointsAll){
                mostPointsAll = mostPointsGen
            }
        //    this.birds[i].calcFitness()
        }
        //console.log(this.birds);
    //    this.birds.fitness.sort()
    //    console.log(this.birds)
        this.birds.sort((a, b) => {
            return a.fitness - b.fitness;
        });
        // for(let i = 0; i < this.birds.length;i++){
        //     for(let j = 0; j < this.birds.length-1;j++){
        //         if(this.birds[j].fitness > this.birds[j + 1].fitness){
        //             //console.log("SWAP")
        //             let temp = this.birds[j];
        //             this.birds[j] = this.birds[j + 1];
        //             this.birds[j + 1] = temp;
        //         }
        //     }
        // }
        if(count >= maxGenes){
            for(let i = 0; i < this.birds.length; i++){
                this.birds[i].dna.add(maxGenes/2)
            }
            //this.birds[this.birds.length - 1].dna.add(maxGenes/2)
            maxGenes+=maxGenes/2
        }
    //    console.log(this.birds)

    }

    //GET SOME COOL CHILDREN
    selection(){
        let parentA;
        let parentB;
        let childrenBreeded = 50;
        let topParents = 10;
        for(let i = 0; i < childrenBreeded; i++){
            let randomA = Math.floor(Math.random() * topParents);
            let randomB = Math.floor(Math.random() * topParents);
            while(randomA == randomB)
                randomB = Math.floor(Math.random() * topParents);
            parentA = this.birds[this.birds.length - 1 - Math.floor(Math.random() * topParents)].dna;
            parentB = this.birds[this.birds.length - 1 - Math.floor(Math.random() * topParents)].dna;

            let child = parentA.crossover(parentB);
            this.birds[i] = new Bird(child);
        }
        let adoptionPercent = .01
        let random = Math.random()
        if(random < adoptionPercent){
            this.birds[Math.floor(Math.random() * this.birds.length -1)] = new Bird();
        }
        generation++
    }

    run(){
        let bool = true
        for(let i = 0; i < this.popsize; i++){
            this.birds[i].update();
            this.birds[i].show();
            if(!this.birds[i].crashed){
                bool = false
            }
        }
        if(bool){
            //count = lifespan
            endGen()
        }
    }
}

function endGen(){
    population.evaluate();
    population.selection();
    for(let i = 0; i < population.birds.length; i++){
        population.birds[i].reset()
    }
    count = 0;
    pipeNum = 0;
    obstacles = []
    obstacles.push(new Obstacle(pipeNum))

}

function setup() {
    var canvas = createCanvas(800, 400)
    bird = new Bird()
    population = new Population();
    generationP = createP();
    frameP = createP();
    mostPointsGenP = createP();
    mostPointsAllP = createP();
    for(let i = 0; i < 10000; i++){
        pipeValues.push(random(50, height - 100))
    }
//    frameRate(60);
    //obstacles.push(new Obstacle(pipeNum))
}


function draw() {
    clear();
    frameP.html('Frame: ' + count);
    generationP.html('Generation: ' + generation)
    mostPointsAllP.html('Farthest Bird All Gens: ' + mostPointsAll)
    mostPointsGenP.html('Farthest Bird Last Gen: ' + mostPointsGen)

    if (count % 85 == 0) {
        pipeNum++;
        obstacles.push(new Obstacle(pipeNum))
    }

    population.run()

    for (var i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].show()
        obstacles[i].update()

        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1)
            population.updateScore()
        }
    }

    count++;
}
