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

        this.pos = {
            prev : {x:undefined, y:undefined}, 
            next : {x:undefined, y:undefined}
        };
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
                this.addKeyEvent();
                this.addTouchEvent();

                this.reset_score();
                this.GRID.reset();
                this.BLOCK.reset();
                this.BLOCK.newTet();
            }else if(dataGame == "paused"){
                //재개
                this.BLOCK.moveDownCascading();
                this.addKeyEvent();
                this.addTouchEvent();
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

    /* 이벤트 추가 */
    addKeyEvent(){
        window.addEventListener('keydown', this.on_keydown,{once:true});
    }//addKeyEvent

    addTouchEvent(){
        window.addEventListener('touchstart',this.on_touchStart, {once:true});
        window.addEventListener('touchend',this.on_touchEnd, {once:true});
    }//addTouchEvent

    /* 키보드 이벤트 */
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
                this.addKeyEvent();
                return;
        }//switch

        //add Event Again...
        this.addKeyEvent();
        this.addTouchEvent();
    }//on_keydown

    /* 터치시 */
    on_touchStart = (e) =>{
        this.pos.prev.x = e.changedTouches[0].clientX; 
        this.pos.prev.y = e.changedTouches[0].clientY; 
    }//on_touchStart

    on_touchEnd = (e) =>{
        this.pos.next.x = e.changedTouches[0].clientX; 
        this.pos.next.y = e.changedTouches[0].clientY; 
        const changeX = Math.abs(this.pos.next.x - this.pos.prev.x)
        const changeY = Math.abs(this.pos.next.y - this.pos.prev.y)
        const evt = {key : undefined};
        if(changeX > changeY){
            //좌우
            if(this.pos.prev.x > this.pos.next.x){
                evt.key = "ArrowLeft";
            }else{
                evt.key = "ArrowRight";
            }
        }else{
            //상하
            if(this.pos.prev.y > this.pos.next.y){
                evt.key = "ArrowUp";
            }else{
                evt.key = "ArrowDown";
            }
        }//if else

        this.on_keydown(evt);
    }//on_touchEnd

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