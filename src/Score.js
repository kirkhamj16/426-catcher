
// move to diff file to modularize
class Score {
    constructor(initialscore) {
            this.element = document.createElement("DIV");
            this.element.innerText = initialscore;
            document.body.appendChild(this.element);


    // possible styling for container to put above div into
           
            this.element.style.display = "hidden"; 
            this.element.style.width = "16px"; 
            this.element.style.height = "150px"; 
            this.element.style.border = "1px solid #cdcdcd"; 
            this.element.style.position = "absolute"; 
            this.element.style.top = "50%"; 
            this.element.style.left = "50%"; 
            this.element.style.transform = "translate(-2500%, -50%)"; 
            this.element.style['align-items'] = "flex-end"; 


           // div styling
            // this.element.style.display = "block"; 
            // this.element.style.width = "16px"; 
            this.element.style['background-color'] = "aqua"; 
            this.element.style.border = "1px solid #000000"; 
            // this.element.style.margin = "0 auto"; 
            // this.element.style['vertical-align'] = "bottom"
            // this.element.style.height = "0px";
            this.element.style['text-align'] = "center";
            // this.element.style.top = "50%"; 
            // this.element.style.left = "50%"; 
            // this.element.style.transform = "translate(-2500%, -50%)"; 
            // this.element.style['align-items'] = "flex-end"; 
    



    }
    showScore() {
        this.element.style.display = "block";
    }
    updateScore(newScore) {
        this.element.innerText = newScore;
    }
}    
