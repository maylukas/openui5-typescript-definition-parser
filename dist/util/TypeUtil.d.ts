export interface TypeConfig {
    ignoredTypes: string[];
    typeMapping: {
        [id: string]: string;
    };
}
export declare class TypeUtil {
    static namespaces: string[];
    static _config: TypeConfig;
    static sapUiTypeToTSType(type: string): any;
}
