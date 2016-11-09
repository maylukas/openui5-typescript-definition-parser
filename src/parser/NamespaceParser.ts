import {IndentedOutputWriter} from '../util';
import {PropertyParser} from "./PropertyParser";
import {MethodParser} from "./MethodParser";
import {ClassParser} from "./ClassParser";
import {InterfaceParser} from "./InterfaceParser";
import {EnumParser} from "./EnumParser"
export class NamespaceParser {
    private _namespaceParsers: NamespaceParser[] = [];
    private _enums: ts_gen.api.Symbol[] = [];
    private _classes: ts_gen.api.Symbol[] = [];
    private _interfaces: ts_gen.api.Symbol[] = [];
    private _additionalContent: string;
    constructor(protected writer: IndentedOutputWriter, protected namespace: ts_gen.api.Symbol, protected parentCtx: string) {
    }

    public generate() {
        if (this.parentCtx.length) {
            this.writer.writeLine("namespace " + this.namespace.name.substring(this.parentCtx.length + 1) + "{");
        } else {
            this.writer.writeLine("declare namespace " + this.namespace.name + "{");
        }
        this.writer.increaseIndent();

        if (this.namespace.properties) {
            for (let property of this.namespace.properties) {
                let propertyParser = new PropertyParser(this.writer, property, this.namespace);
                propertyParser.generate();
            }
        }
        if (this.namespace.methods) {
            for (let method of this.namespace.methods) {
                let methodParser = new MethodParser(this.writer, method, this.namespace);
                methodParser.generate();
            }
        }
        for (let containedNamespaceParser of this._namespaceParsers) {
            containedNamespaceParser.generate();
        }

        for (let containedClass of this._classes) {
            let classParser = new ClassParser(this.writer, containedClass, this.namespace.name);
            classParser.generate();
        }

        for (let containedInterface of this._interfaces) {
            let interfaceParser = new InterfaceParser(this.writer, containedInterface, this.namespace.name);
            interfaceParser.generate();
        }
        for (let containedEnum of this._enums) {
            let enumParser = new EnumParser(this.writer, containedEnum)
            enumParser.generate();
        }

        if (this._additionalContent) {
            this._additionalContent.split(/[\r\n]+/).forEach((line) => {
                this.writer.writeLine(line);
            });
        }

        this.writer.decreaseIndent();
        this.writer.writeLine("}");
    }

    public addContainedNamespaceParsers(namespaces: NamespaceParser[]) {
        this._namespaceParsers = this._namespaceParsers.concat(namespaces)
    }

    public addContainedClasses(classes: ts_gen.api.Symbol[]) {
        this._classes = this._classes.concat(classes)
    }
    public addContainedInterfaces(interfaces: ts_gen.api.Symbol[]) {
        this._interfaces = this._interfaces.concat(interfaces)
    }

    public addContainedEnums(enums: ts_gen.api.Symbol[]) {
        this._enums = this._enums.concat(enums)
    }

    public setAdditionalContent(content: string){
        this._additionalContent = content;
    }
}