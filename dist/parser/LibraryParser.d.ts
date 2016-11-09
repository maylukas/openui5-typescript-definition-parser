import { IndentedOutputWriter } from '../util';
import { NamespaceParser } from './NamespaceParser';
export declare class LibraryParser {
    protected writer: IndentedOutputWriter;
    protected symbols: ts_gen.api.Symbol[];
    protected namespaces: ts_gen.api.Symbol[];
    allNamespaces: ts_gen.api.Symbol[];
    jQueryAdditionalContent: string;
    jQuerySapDefs: string;
    constructor(writer: IndentedOutputWriter, symbols: ts_gen.api.Symbol[], namespaces: ts_gen.api.Symbol[]);
    generate(): void;
    private filterMatching(kind, namespace);
    buildNamespaceParser(ns: ts_gen.api.Symbol, parentCtx: string): NamespaceParser;
}
