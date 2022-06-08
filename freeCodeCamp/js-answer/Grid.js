export default class Grid{
    #CELL;
    constructor(GAME){
        this.GAME = GAME;
        
        this.$grid = document.getElementById('grid');

        //자동 실행
        this.draw_grid();
    }//constructor

    draw_grid(){
        const $frag = document.createDocumentFragment();
        const cell = [];
        
        for(let i=0; i<200; i++){
            const $gridCell = document.createElement('DIV');
            $gridCell.classList.add('grid-cell');
            $frag.appendChild($gridCell);
            cell.push($gridCell);
        }//for
        this.$grid.appendChild($frag);
        this.#CELL = cell;
    }//draw_grid

    /* [GETTER, SETTER] */
    get cell(){return this.#CELL;}
}//Grid