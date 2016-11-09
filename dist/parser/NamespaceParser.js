"use strict";
const PropertyParser_1 = require("./PropertyParser");
const MethodParser_1 = require("./MethodParser");
const ClassParser_1 = require("./ClassParser");
const InterfaceParser_1 = require("./InterfaceParser");
const EnumParser_1 = require("./EnumParser");
class NamespaceParser {
    constructor(writer, namespace, parentCtx) {
        this.writer = writer;
        this.namespace = namespace;
        this.parentCtx = parentCtx;
        this._namespaceParsers = [];
        this._enums = [];
        this._classes = [];
        this._interfaces = [];
    }
    generate() {
        if (this.parentCtx.length) {
            this.writer.writeLine("namespace " + this.namespace.name.substring(this.parentCtx.length + 1) + "{");
        }
        else {
            this.writer.writeLine("declare namespace " + this.namespace.name + "{");
        }
        this.writer.increaseIndent();
        if (this.namespace.properties) {
            for (let property of this.namespace.properties) {
                let propertyParser = new PropertyParser_1.PropertyParser(this.writer, property, this.namespace);
                propertyParser.generate();
            }
        }
        if (this.namespace.methods) {
            for (let method of this.namespace.methods) {
                let methodParser = new MethodParser_1.MethodParser(this.writer, method, this.namespace);
                methodParser.generate();
            }
        }
        for (let containedNamespaceParser of this._namespaceParsers) {
            containedNamespaceParser.generate();
        }
        for (let containedClass of this._classes) {
            let classParser = new ClassParser_1.ClassParser(this.writer, containedClass, this.namespace.name);
            classParser.generate();
        }
        for (let containedInterface of this._interfaces) {
            let interfaceParser = new InterfaceParser_1.InterfaceParser(this.writer, containedInterface, this.namespace.name);
            interfaceParser.generate();
        }
        for (let containedEnum of this._enums) {
            let enumParser = new EnumParser_1.EnumParser(this.writer, containedEnum);
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
    addContainedNamespaceParsers(namespaces) {
        this._namespaceParsers = this._namespaceParsers.concat(namespaces);
    }
    addContainedClasses(classes) {
        this._classes = this._classes.concat(classes);
    }
    addContainedInterfaces(interfaces) {
        this._interfaces = this._interfaces.concat(interfaces);
    }
    addContainedEnums(enums) {
        this._enums = this._enums.concat(enums);
    }
    setAdditionalContent(content) {
        this._additionalContent = content;
    }
}
exports.NamespaceParser = NamespaceParser;
//# sourceMappingURL=NamespaceParser.js.map