export interface ConfigDef {
    namespaces?: string[];
    outFilePath?: string;
    methodExceptionsFile?: string;
    typeConfigFile?: string;
}
export declare function parseDefinitions(config: ConfigDef): void;
