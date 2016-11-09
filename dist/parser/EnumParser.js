"use strict";
class EnumParser {
    constructor(writer, enumSymbol) {
        this.writer = writer;
        this.enumSymbol = enumSymbol;
    }
    generate() {
        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.enumSymbol.description);
        this.writer.closeBlockComment();
        this.writer.writeLine("enum " + this.enumSymbol.basename + " {");
        this.writer.increaseIndent();
        if (this.enumSymbol.properties) {
            for (var i = 0; i < this.enumSymbol.properties.length; i++) {
                let property = this.enumSymbol.properties[i];
                let line = "\"" + property.name + "\"";
                if (i !== this.enumSymbol.properties.length - 1) {
                    line += ",";
                }
                this.writer.writeLine(line);
            }
        }
        this.writer.decreaseIndent();
        this.writer.writeLine("}");
    }
}
exports.EnumParser = EnumParser;
//# sourceMappingURL=EnumParser.js.map