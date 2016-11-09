import { IndentedOutputWriter } from '../util';
export declare class PropertyParser {
    protected writer: IndentedOutputWriter;
    protected property: ts_gen.api.Property;
    protected symbolContext: ts_gen.api.Symbol;
    constructor(writer: IndentedOutputWriter, property: ts_gen.api.Property, symbolContext: ts_gen.api.Symbol);
    generate(): void;
}
