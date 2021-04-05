let population;
//rocket lives for lifespan frames
let lifespan = 200;
let lifeP;
let count = 0;
let generation = 0;
let generationP;
let fastestRocket = 'None';
let fastestRocketP
let target;


function setup(){
    createCanvas(400,300)
    population = new Population();
    generationP = createP();
    lifeP = createP();
    target = createVector(width/2,50)
}

function draw(){
    background(0)
    population.run();
    lifeP.html('Frame: ' + count);
    generationP.html('Generation: ' + generation) 

    count++;
    if(count == lifespan){
        population.evaluate();
        population.selection();
        for(let i = 0; i < population.rockets.length; i++){
            population.rockets[i].reset()
        }
        count = 0;
    }

    ellipse(target.x,target.y,16,16);
}

//rocket constructor function
class DNA{
    constructor(genes){
        if(genes){
            this.genes = genes;
        } else {
            this.genes = [];
            for(let i = 0; i < lifespan; i++){
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(.1);
            }
        }
    }

    crossover(partner){
        let newGenes = []
        let mid = floor(random(this.genes.length))
        let mutationRate = .005
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
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(.1);
                console.log('MUTATESTE')
            }
        }
        return new DNA(newGenes);
    }
}
class Rocket{
    constructor(dna){
        this.pos = createVector(width/2,height);
        this.vel = createVector();
        this.acc = createVector();
        this.completed = false;
        this.framesToFinish = 200;
        if(dna){
            this.dna = dna;
        } else {
            this.dna = new DNA();
        }
        this.fitness = 0;
    }

    reset(){
        this.pos = createVector(width/2,height);
        this.vel = createVector();
        this.acc = createVector();
        this.completed = false;
        this.fitness = 0;
    }

    //accelartion control
    applyForce(force){
        this.acc.add(force)
    }

    calcFitness(){
        let d = dist(this.pos.x,this.pos.y,target.x,target.y)/this.framesToFinish
        //if distance is 1, distnace is 1
        this.fitness = map(d, 0, width, width, 0)
        if(this.completed){
            this.fitness *= 10
        }
    }
    
    //physics
    update(){
        //makes rockets go crazy
        let d = dist(this.pos.x,this.pos.y,target.x,target.y)
        if(d < 10){
            if(!this.completed)
                this.framesToFinish = count;
            this.completed = true;
            this.pos = target.copy();
        }
        
        this.applyForce(this.dna.genes[count])
        if(!this.completed){
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
    }

    show(){
        push();
        noStroke();
        fill(255,150)
        translate(this.pos.x,this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        rect(0, 0, 25, 5);
        pop();
    }
}

//array of all rockets
class Population{
    constructor(){
        this.rockets = [];
        this.popsize = 25;
        for(let i = 0; i < this.popsize; i++){
            this.rockets[i] = new Rocket();
        }

        
    }

    //run through all of the rockets and calculate fitness
    evaluate(){
        let maxFit = 0;
        for(let i = 0; i < this.popsize; i++){
            this.rockets[i].calcFitness();
        }
        for(let i = 0; i < this.popsize;i++){
            for(let j = 0; j < this.popsize - 1;j++){
                if(this.rockets[j].fitness > this.rockets[j + 1].fitness){
                    let temp = this.rockets[j];
                    this.rockets[j] = this.rockets[j + 1];
                    this.rockets[j + 1] = temp;
                }
            }
        }
        console.log(this.rockets[this.rockets.length - 1].framesToFinish)
        

        
 // createP(maxFit);

        

        // for(let i = 0; i < this.popsize; i++){
        //     this.rockets[i].fitness /= maxFit
        // }

        // this.matingPool = []

        // //ask steven about this part
        // for(let i = 0; i < this.popsize; i++){
        //     let n = this.rockets[i].fitness * 100;
        //     for(let j = 0; j < n; j++){
        //         this.matingPool.push(this.rockets[i])
        //     }
        // }
    }

    //GET SOME COOL CHILDREN
    selection(){
        let parentA;
        let parentB;
        let childrenBreeded = 5;
        let topParents = 10
        for(let i = 0; i < childrenBreeded; i++){
            let randomA = Math.floor(Math.random() * topParents);
            let randomB = Math.floor(Math.random() * topParents);
            while(randomA == randomB)
                randomB = Math.floor(Math.random() * topParents);
            parentA = this.rockets[this.rockets.length - 1 - Math.floor(Math.random() * topParents)].dna;
            parentB = this.rockets[this.rockets.length - 1 - Math.floor(Math.random() * topParents)].dna;
            
            let child = parentA.crossover(parentB);
            this.rockets[i] = new Rocket(child);
        }
        generation++
    }

    run(){
        for(let i = 0; i < this.popsize; i++){
            this.rockets[i].update();
            this.rockets[i].show();
        }
    }
}


