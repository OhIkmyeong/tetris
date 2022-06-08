import Blocks from "./Blocks.js";
import Grid from "./Grid.js";

export default class Game{
    constructor(){
        this.GRID = new Grid(this);
        this.BLOCK = new Blocks(this);
        this.$btn = document.getElementById('btn-start');

        this.$btn.addEventListener('click',this.on_click);
        this.playing = false;
    }//constructor

    /* [METHOD] */
    on_click = (e) =>{
        const dataGame = this.$btn.dataset.game;
        if(dataGame == "ready"){
            this.$btn.dataset.game = 'playing';
            this.$btn.textContent = 'STOP';
            this.playing = true;
            this.BLOCK.newTet();
        }else{
            this.playing = false;
            this.BLOCK.stop();
        }//else
    };//on_click
    
    is_lost(){
        const cells = this.GRID.cell;
        const curr = this.BLOCK.curr;
        const currPos = this.BLOCK.currPos;
        for(let idx of curr){
            if(cells[idx + currPos].classList.contains('stack')){return true;}
        }//for
        return false;
    }//is_lost
}//Game