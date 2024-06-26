import { arrayDataConstants } from "../constants/array_data_constants";
import { colorMap } from "../constants/color_constants";
import { getWidthOfText } from "../util"
import { textConstants } from "../constants/text_constants";

class ArrayRenderer {
    constructor(gfx, state, model) {
        this.gfx = gfx;
        this.state = state;
        this.model = model;
    }

    drawArray(arrWrapper, coord) {
        const innerCoord = { x: coord.x + arrayDataConstants.sidePadding, y: coord.y };
        const arr = arrWrapper.data;

        if (arr.length === 0) {
            return;
        }

        let totalHeight = 0;
        let curRectY = 0;

        if (arrWrapper.labels.length > 0) {
            totalHeight = this.getTotalHeightWithIndexLabels();
            curRectY = (
                innerCoord.y
                + textConstants.charHeight
                + arrayDataConstants.indexLabelTopYPadding
                + arrayDataConstants.indexLabelArrowLength
                + arrayDataConstants.indexLabelBottomYPadding
                + textConstants.charHeight
                + arrayDataConstants.topLabelYPadding
            );
        } else {
            totalHeight = this.getTotalHeightWithoutIndexLabels();
            curRectY = (
                innerCoord.y
                + textConstants.charHeight
                + arrayDataConstants.topLabelYPadding
            );
        }

        let curRect = {
            ...arrayDataConstants.refRect,
            x: innerCoord.x,
            y: curRectY
        };

        for (let i = 0; i < arr.length; i++) {
            const color = this.getColor(i, arrWrapper.colors);
            this.drawBox(String(arr[i]), curRect, color);

            if (arrWrapper.reverseIndex === true) {
                this.drawTopLabel(String(arr.length - 1 - i), curRect);
                this.drawPoint(
                    String(arr.length - i),
                    { x: curRect.x, y: curRect.y + curRect.h }
                );
            } else {
                this.drawTopLabel(String(i), curRect);
                this.drawPoint(
                    String(i),
                    { x: curRect.x, y: curRect.y + curRect.h }
                );
            }

            curRect.x += curRect.w;
        }

        // draw final point
        if (arrWrapper.reverseIndex === true) {
            this.drawPoint(
                String(0),
                { x: curRect.x, y: curRect.y + curRect.h }
            );
        } else {
            this.drawPoint(
                String(arr.length),
                { x: curRect.x, y: curRect.y + curRect.h }
            );
        }

        // draw index labels
        for (const label of arrWrapper.labels) {
            this.drawIndexLabel(label, innerCoord, arrWrapper);
        }

        // this.drawOutline(arrWrapper, coord, totalHeight);
    }

    getColor(i, colors) {
        for (const colorElt of colors) {
            if (colorElt.length === 2) {
                const [color, idx] = colorElt;
                if (i === idx) {
                    if (color in colorMap) {
                        return colorMap[color];
                    } else {
                        return "#FFFFFF";
                    }
                }
            } else if (colorElt.length === 3) {
                const [color, begin, end] = colorElt;
                if (i >= begin && i <= end) {
                    if (color in colorMap) {
                        return colorMap[color];
                    } else {
                        return "#FFFFFF";
                    }
                }
            }
        }

        return "#FFFFFF";
    }

    drawBox(str, rect, color) {
        let bgRect = { ...rect, color };

        this.gfx.drawRect(bgRect, 1);

        this.gfx.strokeRectHeavy(rect, 2);

        const textWidth = getWidthOfText(str, textConstants.charWidth, 0);
        const textHeight = textConstants.charHeightNoPadding;
        const charPadding = textConstants.charHeight - textConstants.charHeightNoPadding;

        const rectXMidpoint = rect.x + (rect.w / 2);
        const rectYMidpoint = rect.y + (rect.h / 2);

        // note that to find the y-coord of the text, we need to find the y-coord of where
        // we want the actual visible part of the text to be drawn,
        // and then subtract the top char padding to get the final y-coord

        const textX = rectXMidpoint - Math.floor(textWidth / 2);
        const textY = rectYMidpoint - Math.floor(textHeight / 2) - charPadding;

        this.gfx.drawText(
            str,
            textConstants.charHeight,
            { x: textX, y: textY },
            2
        );
    }

    drawTopLabel(str, rect) {
        const textWidth = getWidthOfText(str, textConstants.charWidth, 0);

        const rectXMidpoint = rect.x + (rect.w / 2);
        const textX = rectXMidpoint - Math.floor(textWidth / 2);

        this.gfx.drawText(
            str,
            textConstants.charHeight,
            { x: textX, y: rect.y - arrayDataConstants.topLabelYPadding - textConstants.charHeight },
            2
        );
    }

    drawPoint(str, coord) {
        this.gfx.drawFilledCircle(coord, arrayDataConstants.pointRadius, 2);

        const textWidth = getWidthOfText(str, textConstants.charWidth, 0);
        const textX = Math.floor(coord.x - (textWidth / 2));

        this.gfx.drawText(
            str,
            textConstants.charHeight,
            { x: textX, y: coord.y + arrayDataConstants.bottomLabelYPadding },
            2
        );
    }

    drawIndexLabel(label, coord, arrWrapper) {
        const [labelStr, labelIndex] = label;

        const rectY = (
            coord.y
            + textConstants.charHeight
            + arrayDataConstants.indexLabelTopYPadding
            + arrayDataConstants.indexLabelArrowLength
            + arrayDataConstants.indexLabelBottomYPadding
            + textConstants.charHeight
            + arrayDataConstants.topLabelYPadding
        );

        let rect = {
            ...arrayDataConstants.refRect,
            x: coord.x,
            y: rectY
        };

        if (arrWrapper.reverseIndex === true) {
            rect.x += rect.w * (arrWrapper.data.length - 1 - labelIndex);
        } else {
            rect.x += rect.w * labelIndex;
        }

        // draw arrow /////////////////////////////////

        const rectXMidpoint = rect.x + (rect.w / 2);

        const start = {
            x: rectXMidpoint,
            y: coord.y + textConstants.charHeight + arrayDataConstants.indexLabelTopYPadding
        };

        const end = {
            x: rectXMidpoint,
            y: start.y + arrayDataConstants.indexLabelArrowLength
        };

        this.gfx.drawLine(start, end, 2);

        const left = {
            x: end.x - 4,
            y: end.y - 4,
        };

        this.gfx.drawLine(left, end, 2);

        const right = {
            x: end.x + 4,
            y: end.y - 4,
        };

        this.gfx.drawLine(right, end, 2);

        // draw label /////////////////////////////////

        const textWidth = getWidthOfText(labelStr, textConstants.charWidth, 0);
        const textX = Math.floor(rectXMidpoint - (textWidth / 2));
        const textY = coord.y;

        this.gfx.drawText(
            labelStr,
            textConstants.charHeight,
            { x: textX, y: textY },
            2
        );
    }

    drawOutline(arrWrapper, coord, totalHeight) {
        const arr = arrWrapper.data;

        const rect = {
            x: coord.x,
            y: coord.y,
            w: (arr.length * arrayDataConstants.refRect.w) + (arrayDataConstants.sidePadding * 2),
            h: totalHeight
        };

        this.gfx.strokeRect(rect, 2);
    }

    getTotalHeightWithIndexLabels() {
        return (
            textConstants.charHeight
            + arrayDataConstants.indexLabelTopYPadding
            + arrayDataConstants.indexLabelArrowLength
            + arrayDataConstants.indexLabelBottomYPadding
            + textConstants.charHeight
            + arrayDataConstants.topLabelYPadding
            + arrayDataConstants.refRect.h
            + arrayDataConstants.bottomLabelYPadding
            + textConstants.charHeight
            + arrayDataConstants.bottomPadding
        );
    }

    getTotalHeightWithoutIndexLabels() {
        return (
            textConstants.charHeight
            + arrayDataConstants.topLabelYPadding
            + arrayDataConstants.refRect.h
            + arrayDataConstants.bottomLabelYPadding
            + textConstants.charHeight
            + arrayDataConstants.bottomPadding
        );
    }
}

export { ArrayRenderer };
