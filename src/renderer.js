import { textConstants } from "./text_constants";
import { getMidpoint, getWidthOfText } from "./util"

class Renderer {
    constructor(gfx, state, model) {
        this.gfx = gfx;
        this.state = state;
        this.model = model;
    }

    render() {
        this.drawBoxes();
        this.drawSelectedBoxes();
        this.drawLine();
        this.drawConnections();
        this.drawSelectedRegion();
        this.drawHelpDialog();
        this.drawArrays();
    }

    drawBoxes() {
        this.model.boxes.forEach(box => this.drawBox(box));
    }

    drawBox(box) {
        this.drawBoxRect(box);
        this.drawBoxText(box);
    }

    drawBoxRect(box) {
        const bgRect = {
            ...box.rect,
            color: "#FFFFFF"
        };

        this.gfx.drawRect(bgRect, 0);
        this.gfx.strokeRect(box.rect, 1);
    }

    drawBoxText(box) {
        this.drawMultiLineText(box.text, box.coord, 2);
    }

    drawSelectedBoxes() {
        const boxes = this.model.boxes;

        for (const selectedBoxId of this.model.selectedBoxIds) {
            const selectedBox = boxes.getBox(selectedBoxId);
            const rect = { ...selectedBox.rect };
            rect.x -= 2;
            rect.y -= 2;
            rect.w += 4;
            rect.h += 4;
            this.gfx.strokeRect(rect);
        }
    }

    drawLine() {
        if (
            this.state.cur.mouse.clicked
            && this.state.cur.keyboard.control
            && this.model.drawingLine
        ) {
            const curMouse = this.state.cur.mouse;
            this.gfx.drawLine(this.model.lineBegin, { ...curMouse.coord }, -1);
        }
    }

    drawConnections() {
        this.model.boxes.getAllConnections()
            .map(([box1, box2]) => [getMidpoint(box1.rect), getMidpoint(box2.rect)])
            .forEach(([begin, end]) => this.gfx.drawLine(begin, end, -1));
    }

    drawSelectedRegion() {
        if (this.model.draggingSelectedRegion) {
            this.gfx.drawRect(this.model.selectedRegion, 10);
        }
    }

    drawHelpDialog() {
        const helpDialog = this.model.helpDialog;

        if (helpDialog.visible == false) {
            return;
        }

        this.gfx.drawRect(helpDialog.rect, 11);

        this.drawMultiLineText(
            helpDialog.text,
            { x: helpDialog.rect.x, y: helpDialog.rect.y },
            12
        );

        this.drawCloseButton();
    }

    drawCloseButton() {
        const cbRect = this.model.helpDialog.closeButtonRect;

        this.gfx.strokeRect(cbRect, 20);

        this.gfx.drawLine(
            { x: cbRect.x, y: cbRect.y },
            { x: cbRect.x + cbRect.w, y: cbRect.y + cbRect.h },
            20
        );

        this.gfx.drawLine(
            { x: cbRect.x + cbRect.w, y: cbRect.y },
            { x: cbRect.x, y: cbRect.y + cbRect.h },
            20
        );
    }

    drawMultiLineText(text, coord, z=0) {
        for (let i = 0; i < text.length; i++) {
            this.gfx.drawText(
                text[i],
                textConstants.charHeight,
                {
                    x: coord.x + textConstants.xPadding,
                    y: coord.y + (textConstants.charHeight * (i + 1))
                },
                z
            );
        }
    }

    drawArrays() {
        const arr = [1, 22, 3, 4, "AA"];
        this.drawArray(arr);
    }

    drawArray(arr) {
        const drawBox = (str, rect) => {
            this.gfx.strokeRectHeavy(rect);

            const textWidth = getWidthOfText(str, textConstants.charWidth, 0);
            const textHeight = textConstants.charHeightNoPadding;

            const rectXMidpoint = rect.x + (rect.w / 2);
            const rectYMidpoint = rect.y + (rect.h / 2);

            const textX = rectXMidpoint - Math.floor(textWidth / 2);
            const textY = rectYMidpoint + Math.floor(textHeight / 2);

            this.gfx.drawText(
                str,
                textConstants.charHeight,
                { x: textX, y: textY },
                1
            );
        }

        const drawText = (str, rect) => {
            const yPadding = 4;
            const textWidth = getWidthOfText(str, textConstants.charWidth, 0);

            const rectXMidpoint = rect.x + (rect.w / 2);
            const textX = rectXMidpoint - Math.floor(textWidth / 2);

            this.gfx.drawText(
                str,
                textConstants.charHeight,
                { x: textX, y: rect.y - yPadding },
                1
            );
        };

        const drawPoint = (str, coord) => {
            this.gfx.drawFilledCircle(coord, 3, 2);

            const yPadding = 2;
            const textWidth = getWidthOfText(str, textConstants.charWidth, 0);
            const textX = Math.floor(coord.x - (textWidth / 2));

            this.gfx.drawText(
                str,
                textConstants.charHeight,
                { x: textX, y: coord.y + textConstants.charHeight + yPadding},
                1
            );
        }

        const length = arr.length;

        let rect = {
            x: 30,
            y: 30,
            w: 30,
            h: 30,
        };

        const xIncrement = rect.w;

        for (let i = 0; i < length; i++) {
            // draw rect
            drawBox(String(arr[i]), rect);

            // draw numbers above rect
            drawText(String(i), rect);

            // draw points
            drawPoint(String(i), { x: rect.x, y: rect.y + rect.h });

            // draw final point
            if (i === length - 1) {
                drawPoint(String(i), { x: rect.x + rect.w, y: rect.y + rect.h });
            }

            rect.x += xIncrement;
        }
    }
}

export { Renderer };
