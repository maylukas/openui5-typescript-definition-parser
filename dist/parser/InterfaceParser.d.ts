import { IndentedOutputWriter } from '../util';
export declare class InterfaceParser {
    protected writer: IndentedOutputWriter;
    protected interfaceSymbol: ts_gen.api.Symbol;
    protected namespacePrefix: string;
    constructor(writer: IndentedOutputWriter, interfaceSymbol: ts_gen.api.Symbol, namespacePrefix: string);
    generate(): void;
}
