import { IndentedOutputWriter } from '../util';
export declare class EnumParser {
    protected writer: IndentedOutputWriter;
    protected enumSymbol: ts_gen.api.Symbol;
    constructor(writer: IndentedOutputWriter, enumSymbol: ts_gen.api.Symbol);
    generate(): void;
}
