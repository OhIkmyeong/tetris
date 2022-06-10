/* 
00 [01] [02] 03 04 05 06 07 08 09
10 [11]  12  13 14 15 16 17 18 19
20 [21]  22  23 24 25 26 27 28 29
*/

/* 
00 [01] [02] 03 04
05 [06]  07  08 09
10 [11]  12  13 14
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
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2]];

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

export default class Blocks{
    constructor(GAME){
        this.GAME = GAME;
        this.TETS = [Ltet,Ztet,Ttet,Otet,Itet];
        this.COLOR = ["red","yellow","blue","green","purple"];

        this.reset();
    }//constructor

    /* 리셋 */
    reset(){
        this.currPos = undefined;
        this.currType = undefined;
        this.currRot = 0;
        this.colorIdx = -1;
        this.currColor = undefined;
        this.curr = undefined;

        this.define_next();
        
        this.timeId = undefined;
    }//reset

    /* 새 블록을 만듦 */
    async newTet(){
        this.stop();
        
        this.currPos = 4;
        this.currRot = 0;
        
        this.currType = this.nextType;
        this.currColor = this.nextColor;
        this.curr = this.next;
        
        this.define_next();
        this.display_next();

        this.moveDownCascading();
    }//newTet;

    define_next(){
        this.nextColor = this.random_color();
        this.nextType = this.random_type();
        this.next = this.random_tet(this.nextType);
    }//define_next

    random_type(){
        return Math.floor(this.TETS.length * Math.random());
    }

    random_tet(type){
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
            },0);
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
                res();
            },0);
        });
    }//undraw

    /* 자동으로 내려감 */
    moveDownCascading = async()=>{
        //플레이 안 되도록
        if(!this.GAME.playing){
            this.stop();
            return;}

        //패배 판정
        if(this.GAME.is_lost()){
            this.GAME.gameOver();
            return;}

        //내리고
        await this.moveDown();

        //바닥이나 블럭에 닿아 멈추는 경우
        if(this.is_stop()){
            //멈추고 쌓기
            this.stop();
            await this.stack();

            //점수 업데이트 (개별)
            this.GAME.update_score(this.curr.length);

            //한줄 완성 확인
            const isClear = this.lineClear();
            
            //새 블록 생성
            this.newTet();
            return;
        }//else if
        
        //반복
        setTimeout(()=>{
            this.timeId = window.requestAnimationFrame(this.moveDownCascading);
        },500);
    }//moveDownCascading;

    /* 단순히 아래로 내리기 */
    moveDown = async()=>{
        await this.undraw();
        this.currPos += width;
        const CELL = this.GAME.GRID.cell;
        const isStack = this.curr.some(idx=>CELL[this.currPos + idx].classList.contains('stack'));
        const isTaken = this.curr.some(idx=>CELL[this.currPos + idx].classList.contains('taken'));
        if(isStack || isTaken){
            this.currPos -= 10;
            await this.draw();
            return;}
        await this.draw();
    }//moveDown

    /* 왼쪽 */
    moveLeft = async() =>{
        if(this.isAtLeft()){return;}

        await this.undraw();

        this.currPos--;

        const CELL = this.GAME.GRID.cell;
        const isStack = this.curr.some(idx=>CELL[this.currPos + idx].classList.contains('stack'));
        if(isStack){this.currPos++;}
        
        await this.draw();
    }//moveLeft;

    /* 오른쪽 */
    moveRight = async()=>{
        if(this.isAtRight()){return;}

        await this.undraw();

        this.currPos++;

        const CELL = this.GAME.GRID.cell;
        const isStack = this.curr.some(idx=>CELL[this.currPos + idx].classList.contains('stack'));
        if(isStack){this.currPos--;}

        await this.draw();
    }//moveRight

    /* 벽에 닿는지 */
    isAtLeft(){
        return this.curr.some(idx =>(this.currPos + idx) % width === 0);}
    isAtRight(){ 
        return this.curr.some(idx =>(this.currPos + idx) % width === width - 1);}

    /* 회전 */
    async rotate(){
        await this.undraw();
        this.currRot = this.currRot + 1 > this.TETS[this.currType].length - 1 ? 0 : this.currRot + 1;
        this.curr = this.TETS[this.currType][this.currRot];
        this.checkRotatedPosition();
        await this.draw();
    }//rotate

    /* 회전 가능 확인 및 위치 재조정 */
    checkRotatedPosition(P){
        P = P || this.currPos;
        if((P+1) % width < 4){
            if(this.isAtRight()){
                this.currPos++;
                this.checkRotatedPosition(P);}
        }else if(P % width > 5){
            if(this.isAtLeft()){
                this.currPos--;
                this.checkRotatedPosition(P);}
        }//if else 4,5
    }//checkRotatedPosition

    /* 멈출 때인가 */
    is_stop(){
        const CELL = this.GAME.GRID.cell;
        const isRowEnd = this.curr.some(idx => CELL[this.currPos + idx + width]?.classList.contains('taken'));
        const isStack = this.curr.some(idx => CELL[this.currPos + idx + width]?.classList.contains('stack'));
        if(isRowEnd || isStack){return true;}
        return false;
    }//is_stop

    /* 쌓기 */
    stack(){
        return new Promise(res=>{
            this.curr.forEach(idx=>{
                this.GAME.GRID.cell[idx + this.currPos].classList.add('stack');
            });
            res();
        });
    }//stack

    /* 타이머 종료 */
    stop(){
        while(this.timeId){
            window.cancelAnimationFrame(this.timeId);
            this.timeId--;
        }//while
    }//stop

    /* 미리보기 표시 */
    display_next(){
        const PREVIEW = this.GAME.GRID.preview;
        PREVIEW.forEach(cell=>cell.classList.remove('tet',this.currColor));
        this.next.forEach(idx=>{
            const q = Math.floor(idx / 10);
            PREVIEW[idx - (q * 6)].classList.add('tet',this.nextColor);
        });
    }//display_next

    /* 💥 한 줄 완성시 */
    lineClear(){
        for(let i=0; i<this.GAME.GRID.cell.length - width; i += width){
            this.isClearRow(i);
            for(let k=0; k<i; k+=width){
                this.isClearRow(k);
            }//for-(1)
        }//for(0)
    }//lineClear

    isClearRow(i){
        const CELL = this.GAME.GRID.cell;
        const row = this.getRow(i);
        const CLEAR = row.every(idx=>CELL[idx].classList.contains('stack'));
        if(CLEAR){
            //점수 업데이트
            this.GAME.update_score(width * 10);
            //클래스 없애고
            row.forEach(idx=>{
                CELL[idx].classList.remove('tet', 'stack', 'red', 'yellow', 'blue', 'green', 'purple');
            });
            //삭제
            this.removeLine(i);
        }//if
    }//isClearRow

    removeLine(i){
        const removed = this.GAME.GRID.cell.splice(i, width);
        this.GAME.GRID.cell = removed.concat(this.GAME.GRID.cell);
        this.GAME.GRID.cell.forEach($cell => this.GAME.GRID.$grid.appendChild($cell));
    }//removeLine

    getRow(i){
        const row = [];
        for(let k=0; k<width; k++){
            row.push(i + k);
        }//for
        return row;
    }//getRow
}//class - Blocks