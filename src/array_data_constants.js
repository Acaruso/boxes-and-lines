import { textConstants } from "./text_constants";

let arrayDataConstants_ = {
    refRect: { x: 0, y: 0, w: 26, h: 26 },
    topLabelYPadding: 4,
    pointRadius: 3,
    bottomLabelYPadding: 4,
    indexLabelTopYPadding: 4,
    indexLabelBottomYPadding: 2,
    indexLabelArrowLength: 9,
    bottomMargin: 4,
    sideMargin: 8,
};

arrayDataConstants_.totalHeightWithIndexLabels = (
    textConstants.charHeight
    + arrayDataConstants_.indexLabelTopYPadding
    + arrayDataConstants_.indexLabelArrowLength
    + arrayDataConstants_.indexLabelBottomYPadding
    + textConstants.charHeight
    + arrayDataConstants_.topLabelYPadding
    + arrayDataConstants_.refRect.h
    + arrayDataConstants_.bottomLabelYPadding
    + textConstants.charHeight
    + arrayDataConstants_.bottomMargin
);

arrayDataConstants_.totalHeightWithoutIndexLabels = (
    textConstants.charHeight
    + arrayDataConstants_.topLabelYPadding
    + arrayDataConstants_.refRect.h
    + arrayDataConstants_.bottomLabelYPadding
    + textConstants.charHeight
    + arrayDataConstants_.bottomMargin
);

const arrayDataConstants = { ...arrayDataConstants_ };

export { arrayDataConstants };