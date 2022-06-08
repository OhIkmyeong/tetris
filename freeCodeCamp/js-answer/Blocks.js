/* 
00 [01] [02] 03 04 05 06 07 08 09
10 [11]  12  13 14 15 16 17 18 19
20 [21]  22  23 24 25 26 27 28 29
*/

//아님 https://www.youtube.com/watch?v=QDp8BZbwOqk&t=198s
//의 9:47이 더 좋아보이긴 한데 흠..

const width = 10;

const Ltet = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]];

const Ztet = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]];

const Ttet = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]];

const Otet = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]];

const Itet = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]];


/* CLASS */
let timeId;

export default class Blocks{
    constructor(GAME){
        this.GAME = GAME;
        this.TETS = [Ltet,Ztet,Ttet,Otet,Itet];
        this.COLOR = ["red","yellow","blue","green","purple"];

        this.currPos = undefined;
        this.currRot = undefined;
        this.colorIdx = -1;
        this.currColor = undefined;
        this.curr = undefined;

     }//constructor

    newTet(){
        this.stop();
        this.currPos = 4;
        this.currRot = 0;
        this.curr = this.random_tet();
        this.currColor = this.random_color();

        timeId = window.requestAnimationFrame(this.moveDown);
    }//newTet;

    random_tet(){
        const type = Math.floor(Math.random() * this.TETS.length);
        return this.TETS[type][this.currRot];
    }//random_tet

    random_color(){
        // this.colorIdx = Math.floor(this.COLOR.length * Math.random());
        this.colorIdx = this.colorIdx >= this.COLOR.length - 1 ? -1 : this.colorIdx;
        this.colorIdx++;
        return this.COLOR[this.colorIdx];
    };

    draw(){
        return new Promise(res=>{
            setTimeout(()=>{
                const CELL = this.GAME.GRID.cell;
                this.curr.forEach(idx=>{
                    const curr_cell = CELL[this.currPos + idx]; 
                    curr_cell.classList.add('tet',this.currColor);            
                });
                res();
            },width);
        });
    }//draw

    undraw(){
        return new Promise(res=>{
            setTimeout(()=>{
                const CELL = this.GAME.GRID.cell;
                this.curr.forEach(idx=>{
                    const curr_cell = CELL[this.currPos + idx]; 
                    curr_cell.classList.remove('tet',this.currColor);            
                });
                res(this.currPos += width);
            },100);
        });
    }//undraw

    moveDown = async()=>{
        if(!this.GAME.playing){
            this.stop();
            return;}

        await this.undraw();
            
        await this.draw();

        if(this.is_stop()){
            this.stop();
            await this.stack();
            this.newTet();
            if(this.GAME.is_lost()){
                this.stop();
                return;
            }else{
                return;
            }
        }//if

        timeId = window.requestAnimationFrame(this.moveDown);
    }//moveDown;

    moveLeft = async() =>{

    }//moveLeft;

    is_stop(){
        for(let idx of this.curr){
            if(idx + this.currPos >= 189){return true;}
            if(this.GAME.GRID.cell[idx + this.currPos + width].classList.contains('stack')){return true;}
        }//for
        return false;
    }//is_stop

    stack(){
        return new Promise(res=>{
            this.curr.forEach(idx=>{
                this.GAME.GRID.cell[idx + this.currPos].classList.add('stack');
            });
            res();
        });
    }//stack

    stop(){
        window.cancelAnimationFrame(timeId);
        return;
    }//stop
}//Blocks

//53:00