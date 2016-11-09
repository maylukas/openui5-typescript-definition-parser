import { IndentedOutputWriter } from '../util';
export interface MethodException {
    methodName: string;
    applicableReturnTypes: string[];
    applicableSignatures: string[];
    usedReturnType: string;
    usedSignature: string;
}
export declare class MethodParser {
    protected writer: IndentedOutputWriter;
    protected method: ts_gen.api.Method;
    protected symbolContext: ts_gen.api.Symbol;
    static _exceptions: MethodException[];
    constructor(writer: IndentedOutputWriter, method: ts_gen.api.Method, symbolContext: ts_gen.api.Symbol);
    generate(): string;
}
