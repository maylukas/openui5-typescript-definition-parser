import { IndentedOutputWriter } from '../util';
export declare class NamespaceParser {
    protected writer: IndentedOutputWriter;
    protected namespace: ts_gen.api.Symbol;
    protected parentCtx: string;
    private _namespaceParsers;
    private _enums;
    private _classes;
    private _interfaces;
    private _additionalContent;
    constructor(writer: IndentedOutputWriter, namespace: ts_gen.api.Symbol, parentCtx: string);
    generate(): void;
    addContainedNamespaceParsers(namespaces: NamespaceParser[]): void;
    addContainedClasses(classes: ts_gen.api.Symbol[]): void;
    addContainedInterfaces(interfaces: ts_gen.api.Symbol[]): void;
    addContainedEnums(enums: ts_gen.api.Symbol[]): void;
    setAdditionalContent(content: string): void;
}
