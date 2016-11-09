import {IndentedOutputWriter, ParamParser} from '../util';
import {PropertyParser} from "./PropertyParser";
import {MethodParser} from "./MethodParser";


export class InterfaceParser {
    constructor(protected writer: IndentedOutputWriter, protected interfaceSymbol: ts_gen.api.Symbol, protected namespacePrefix: string) {

    }

    public generate() {
        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.interfaceSymbol.description);
        this.writer.writeTsDocComment("@resource " + this.interfaceSymbol.resource);
        this.writer.closeBlockComment();

        this.writer.writeLine("interface " + this.interfaceSymbol.basename + " {");
        this.writer.increaseIndent();

        if (this.interfaceSymbol.properties) {
            for (let property of this.interfaceSymbol.properties) {
                let propertyParser = new PropertyParser(this.writer, property, this.interfaceSymbol);
                propertyParser.generate();
            }
        }


        this.writer.newLine();
        this.writer.newLine();

        if (this.interfaceSymbol.methods) {
            for (let method of this.interfaceSymbol.methods) {
                let methodParser = new MethodParser(this.writer, method, this.interfaceSymbol);
                methodParser.generate();
            }
        }

        this.writer.decreaseIndent();
        this.writer.writeLine("}");

    }
}