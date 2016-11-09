import {IndentedOutputWriter, ParamParser} from '../util';
import {PropertyParser} from "./PropertyParser";
import {MethodParser} from "./MethodParser";


export class ClassParser {
    constructor(protected writer: IndentedOutputWriter, protected classSymbol: ts_gen.api.Symbol, protected namespacePrefix: string) {

    }

    public getNestedNamespaceName() {
        let nestedNamespaceName = this.classSymbol.name.substring(0, this.classSymbol.name.length - this.classSymbol.basename.length - 1)
        return nestedNamespaceName
    }

    public generate() {
        let nestedNamespaceName = null;
        if (this.getNestedNamespaceName() !== this.namespacePrefix && this.classSymbol.name !== this.namespacePrefix) {
            nestedNamespaceName = this.classSymbol.name.substring(this.namespacePrefix.length + 1)
            nestedNamespaceName = nestedNamespaceName.substring(0, nestedNamespaceName.length - this.classSymbol.basename.length - 1)
            this.writer.writeLine("declare namespace " + nestedNamespaceName + "{")
            this.writer.increaseIndent();
        }

        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.classSymbol.description);
        this.writer.writeTsDocComment("@resource " + this.classSymbol.resource);
        this.writer.closeBlockComment();

        let extendsModifier = "";
        if (this.classSymbol.extends) {
            let e = this.classSymbol.extends;
            if(e === "sap.ui.core.Toolbar"){
                e =  "sap.m.Toolbar"
            }
            extendsModifier = " extends " + e;
        }

        let abstractModifier = "";

        if (this.classSymbol.abstract || this.classSymbol.basename === "MultiComboBox") {
            abstractModifier = "abstract ";
        }

        this.writer.writeLine("export " + abstractModifier + "class " + this.classSymbol.basename + extendsModifier + " {");
        this.writer.increaseIndent();

        if (this.classSymbol.properties) {
            for (let property of this.classSymbol.properties) {
                let propertyParser = new PropertyParser(this.writer, property, this.classSymbol);
                propertyParser.generate();
            }
        }

        this.writer.newLine();
        this.writer.newLine();

        if (this.classSymbol.constructor && this.classSymbol.constructor.visibility === "public") {
            if (this.classSymbol.constructor.description) {
                this.writer.openBlockComment();
                this.writer.writeTsDocComment(this.classSymbol.constructor.description);
                if (this.classSymbol.constructor.parameters) {
                    for (let constructorParam of this.classSymbol.constructor.parameters) {
                        this.writer.writeTsDocComment("@param " + constructorParam.name + " " + constructorParam.description);
                    }
                }
                this.writer.closeBlockComment();
            }

            this.writer.writeLine("constructor(" + ParamParser.parseParams(this.classSymbol.constructor.parameters) + ");");
        }

        this.writer.newLine();
        this.writer.newLine();


        if (this.classSymbol.methods) {
            for (let method of this.classSymbol.methods) {
                let methodParser = new MethodParser(this.writer, method, this.classSymbol);
                methodParser.generate();
            }
        }



        this.writer.decreaseIndent();
        this.writer.writeLine("}");

        if (nestedNamespaceName) {
            this.writer.decreaseIndent();
            this.writer.writeLine("}")
        }

    }
}