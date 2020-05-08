
//----------------------------------
//  POINTS
//----------------------------------
class Score {

    constructor(initialscore) {
        this.element = document.createElement("DIV");
        this.element.innerText = initialscore;
        document.body.appendChild(this.element);
        // this.element.style = // ...several lines for custom styling
    }

    updateScore(newScore) {
        this.element.innerText = newScore;
    }
}    

