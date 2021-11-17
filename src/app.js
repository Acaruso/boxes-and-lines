import { Gfx } from "./gfx"
import { Renderer } from "./renderer"
import { State } from "./state"
import { Model } from "./model"
import { Ui } from "./ui"
import { Scripter } from "./scripter"
import { EventTable } from "./event_table"

class App {
    constructor() {
        this.gfx = new Gfx();
        this.state = new State();
        this.model = new Model();
        this.scripter = new Scripter();
        this.eventTable = new EventTable(this.state, this.model);
        this.ui = new Ui(
            this.state,
            this.model,
            this.scripter,
            this.eventTable
        );
        this.renderer = new Renderer(this.gfx, this.state, this.model);

        this.scripter.init(["a(0)", "a(1)", "b(0)", "b(1)"]);

        this.interval = {};
    }

    startMainLoop() {
        this.interval = setInterval(() => this.loop(), 10);
    }

    loop() {
        this.gfx.clearScreen();
        this.ui.run();
        this.renderer.render();
        this.gfx.draw();
        this.state.nextState();
    }
}

export { App };
