class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.hits = size;
        this.sunk = false;
    
    }
    addPosition(position) {
        this.positions.push(position);
    }

    getSunkMessage() {
        return this.name + " has been sunk";
    }

    getPlayerHitButNotSunkMessage() {
        return this.name +" was hit but not sunk";
    }

    getEnemyHitButNotSunkMessage() {
        return "ship was hit but not sunk";
    }

    logHit() {
        if(this.hits == 1 || this.hits == 0) {
            this.sunk = true;
            this.hits = 0;
            //return this.getSunkMessage();
        }
        this.hits--;
        //return this.getHitButNotSunkMessage();
    }


}

module.exports = Ship;