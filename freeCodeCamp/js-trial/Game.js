import Blocks from "./Blocks.js";
import Grid from "./Grid.js";

export default class Game{
    #SCORE
    constructor(){
        this.GRID = new Grid(this);
        this.BLOCK = new Blocks(this);

        this.$btn = document.getElementById('btn-start');
        this.$btn.addEventListener('click',this.on_click);
        this.playing = false;

        this.$score = document.getElementById('score');
        this.score = 0;

        this.addEvent();
    }//constructor

    /* [METHOD] */
    on_click = (e) =>{
        const dataGame = this.$btn.dataset.game; 

        if(dataGame == "playing"){
            //멈추기
            this.$btn.dataset.game = 'paused';
            this.$btn.textContent = 'PLAY AGAIN';
            this.playing = false;
            this.BLOCK.stop();
        }else{
            this.$btn.dataset.game = 'playing';
            this.$btn.textContent = 'PAUSE';
            this.playing = true;
            if(dataGame == "ready"){
                //새 시작
                this.reset_score();
                this.GRID.reset();
                this.BLOCK.reset();
                this.BLOCK.newTet();
            }else if(dataGame == "paused"){
                //재개
                this.BLOCK.moveDownCascading();
            }
        }//if else
    };//on_click
    
    reset_btn(){
        this.$btn.dataset.game = 'ready';
        this.$btn.textContent = 'GAME OVER';
    }//reset_btn

    is_lost(){
        const cells = this.GRID.cell;
        const curr = this.BLOCK.curr;
        const currPos = this.BLOCK.currPos;
        for(let idx of curr){
            if(cells[idx + currPos].classList.contains('stack')){return true;}
        }//for
        return false;
    }//is_lost

    gameOver(){
        if(!this.playing){return;}
        this.playing = false;
        this.BLOCK.stop();
        this.reset_btn();
        console.log('GAME OVER',new Date());
    }//gameOver

    addEvent(){
        window.addEventListener('keydown', this.on_keydown,{once:true});
    }//addEvent

    on_keydown = async (e) => {
        if(!this.playing){return;}
        
        switch(e.key){
            case "ArrowLeft":
                await this.BLOCK.moveLeft();
                break;
            case "ArrowRight":
                await this.BLOCK.moveRight();
                break;
            case "ArrowUp":
                await this.BLOCK.rotate();
                break;
            case "ArrowDown":
                this.BLOCK.moveDown();
                break;
            default :
                this.addEvent();
                return;
        }//switch

        //add Event Again...
        this.addEvent();
    }//on_keydown

    /* SCORE */
    get score(){return this.#SCORE;}
    set score(value){this.#SCORE = value;}

    reset_score(){
        this.score = 0;
        this.display_score();}
    update_score(value){
        this.score += value;
        this.display_score();}
    display_score(){this.$score.textContent = this.score;}
}//Game