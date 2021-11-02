import { Boxes } from "./boxes";
import { getMidpoint } from "./util"

class Ui {
    constructor(gfx, state) {
        this.gfx = gfx;
        this.state = state;

        this.boxes = new Boxes(gfx, state);
        this.boxes.addBox("test1", { x: 4, y: 4 });
        this.boxes.addBox("test2", { x: 90, y: 4 });
        this.boxes.addBox("test3", { x: 90, y: 100 });

        this.lineBegin = { x: 0, y: 0 };
        this.outBox = {};
        this.drawingLine = false;

        this.addEventListeners();
    }

    addEventListeners() {
        const createBoxListener = () => {
            if (this.state.cur.keyboard.shift) {
                const coord = { ...this.state.cur.mouse.coord };
                this.boxes.addBox("", coord);
            }
        };

        document.addEventListener("mousedown", createBoxListener, false);

        const connectionMousedownListener = () => {
            this.boxes.forEach((box) => {
                if (
                    this.state.isMousedownInside(box.rect)
                    && this.state.cur.keyboard.control
                ) {
                    this.lineBegin = getMidpoint(box.rect);
                    this.outBox = box;
                    this.drawingLine = true;
                }
            });
        };

        document.addEventListener("mousedown", connectionMousedownListener, false);

        const connectionMouseupListener = () => {
            this.boxes.forEach((box) => {
                if (
                    this.state.isMouseupInside(box.rect)
                    && this.drawingLine
                ) {
                    this.boxes.addConnection(this.outBox, box);
                    this.drawingLine = false;
                }
            });
        };

        document.addEventListener("mouseup", connectionMouseupListener, false);
    }

    run() {
        this.boxes.run();
        this.handleDrawLine();
    }

    handleDrawLine() {
        if (
            this.state.cur.mouse.clicked
            && this.state.cur.keyboard.control
            && this.drawingLine
        ) {
            const curMouse = this.state.cur.mouse;
            this.gfx.drawLine(this.lineBegin, { ...curMouse.coord }, -1);
        }
    }
}

export { Ui };
