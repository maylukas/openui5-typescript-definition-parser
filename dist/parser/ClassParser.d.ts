import { IndentedOutputWriter } from '../util';
export declare class ClassParser {
    protected writer: IndentedOutputWriter;
    protected classSymbol: ts_gen.api.Symbol;
    protected namespacePrefix: string;
    constructor(writer: IndentedOutputWriter, classSymbol: ts_gen.api.Symbol, namespacePrefix: string);
    getNestedNamespaceName(): string;
    generate(): void;
}
