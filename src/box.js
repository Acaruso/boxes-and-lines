import { textConstants } from "./text_constants";

class Box {
    constructor(text, coord, id=0) {
        this.coord = { ...coord };
        this.id = id;
        this.text = text;
        this.rect = {};

        // new:
        this.parentId = null;

        this.updateRect();
    }

    appendStr(s) {
        for (let i = 0; i < s.length; i++) {
            this.appendChar(s[i]);
        }
    }

    appendChar(c) {
        this.text += c;
        this.updateRect();
    }

    deleteChar() {
        if (this.text.length > 0) {
            this.text = this.text.slice(0, -1);
        }
        this.updateRect();
    }

    setCoord(newCoord) {
        this.coord = { ...newCoord };
        this.updateRect();
    }

    setCoordMidpoint(newCoord) {
        this.coord.x = newCoord.x - (this.rect.w / 2);
        this.coord.y = newCoord.y;
        this.updateRect();
    }

    updateRect() {
        const length = this.text.length > 0 ? this.text.length : 1;

        this.rect = {
            x: this.coord.x,
            y: this.coord.y,
            w: Math.floor(length * textConstants.charWidth) + (textConstants.xPadding * 2),
            h: textConstants.charHeight + textConstants.yPadding
        };
    }
}

export { Box };
