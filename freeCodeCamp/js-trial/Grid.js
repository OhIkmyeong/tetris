export default class Grid{
    #CELL;
    #PREVIEW
    constructor(GAME){
        this.GAME = GAME;
        
        this.$grid = document.getElementById('grid');
        this.$mini = document.getElementById('miniGrid');
        //자동 실행
        this.draw_grid();
        this.draw_mini();
    }//constructor

    reset(){
        this.cell.forEach($cell => $cell.classList.remove('tet','stack','red','yellow','blue','green','purple'));
        this.preview.forEach($cell => $cell.classList.remove('tet','red','yellow','blue','green','purple'));
    }//reset

    /* 메인 그리드 */
    draw_grid(){
        const $frag = document.createDocumentFragment();
        const cell = [];
        
        for(let i=0; i<210; i++){
            const $gridCell = document.createElement('DIV');
            $gridCell.classList.add('grid-cell');
            $gridCell.dataset.number = i;
            if(i >= 200){ $gridCell.classList.add('taken');}
            $frag.appendChild($gridCell);
            cell.push($gridCell);
        }//for

        this.$grid.appendChild($frag);
        this.#CELL = cell;
    }//draw_grid

    /* 미리보기 */
    draw_mini(){
        const $frag = document.createDocumentFragment();
        const preview = [];
        
        for(let i=0; i<16; i++){
            const $gridCell = document.createElement('DIV');
            $gridCell.classList.add('grid-cell');
            $frag.appendChild($gridCell);
            preview.push($gridCell);
        }//for

        this.$mini.appendChild($frag);
        this.#PREVIEW = preview;
    }
    /* [GETTER, SETTER] */
    get cell(){return this.#CELL;}
    set cell(value){this.#CELL = value;}
    get preview(){return this.#PREVIEW;}
}//Grid