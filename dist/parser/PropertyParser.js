"use strict";
const util_1 = require('../util');
class PropertyParser {
    constructor(writer, property, symbolContext) {
        this.writer = writer;
        this.property = property;
        this.symbolContext = symbolContext;
    }
    generate() {
        this.writer.newLine();
        let type = util_1.TypeUtil.sapUiTypeToTSType(this.property.type);
        if (type === "undefined") {
            type = "any";
        }
        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.property.description);
        if (this.property.since) {
            this.writer.writeTsDocComment("@since " + this.property.since);
        }
        this.writer.closeBlockComment();
        let accessModifier = this.property.visibility;
        if (this.symbolContext.kind === "namespace") {
            accessModifier = "var";
        }
        this.writer.writeLine(accessModifier + " " + this.property.name + ": " + type + ";");
    }
}
exports.PropertyParser = PropertyParser;
//# sourceMappingURL=PropertyParser.js.map