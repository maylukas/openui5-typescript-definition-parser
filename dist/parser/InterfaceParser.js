"use strict";
const PropertyParser_1 = require("./PropertyParser");
const MethodParser_1 = require("./MethodParser");
class InterfaceParser {
    constructor(writer, interfaceSymbol, namespacePrefix) {
        this.writer = writer;
        this.interfaceSymbol = interfaceSymbol;
        this.namespacePrefix = namespacePrefix;
    }
    generate() {
        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.interfaceSymbol.description);
        this.writer.writeTsDocComment("@resource " + this.interfaceSymbol.resource);
        this.writer.closeBlockComment();
        this.writer.writeLine("interface " + this.interfaceSymbol.basename + " {");
        this.writer.increaseIndent();
        if (this.interfaceSymbol.properties) {
            for (let property of this.interfaceSymbol.properties) {
                let propertyParser = new PropertyParser_1.PropertyParser(this.writer, property, this.interfaceSymbol);
                propertyParser.generate();
            }
        }
        this.writer.newLine();
        this.writer.newLine();
        if (this.interfaceSymbol.methods) {
            for (let method of this.interfaceSymbol.methods) {
                let methodParser = new MethodParser_1.MethodParser(this.writer, method, this.interfaceSymbol);
                methodParser.generate();
            }
        }
        this.writer.decreaseIndent();
        this.writer.writeLine("}");
    }
}
exports.InterfaceParser = InterfaceParser;
//# sourceMappingURL=InterfaceParser.js.map