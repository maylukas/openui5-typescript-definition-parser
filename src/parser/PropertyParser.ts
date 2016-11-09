import {IndentedOutputWriter, TypeUtil} from '../util';
export class PropertyParser {
    constructor(protected writer: IndentedOutputWriter, protected property: ts_gen.api.Property, protected symbolContext: ts_gen.api.Symbol) {

    }

    public generate() {
        this.writer.newLine();
        let type = TypeUtil.sapUiTypeToTSType(this.property.type)
        if (type === "undefined") {
            type = "any";
        }

        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.property.description);
        if (this.property.since) {
            this.writer.writeTsDocComment("@since " + this.property.since)
        }
        this.writer.closeBlockComment();

        let accessModifier = this.property.visibility;
        if(this.symbolContext.kind === "namespace"){
            accessModifier = "var"
        }

        this.writer.writeLine(accessModifier + " " + this.property.name + ": " + type + ";")
    }
}