declare module ts_gen.api {
    export interface Property {
        name: string;
        visibility: string;
        since: string;
        type: string;
        description: string;
        static?: boolean;
        module: string;
        resource: string;
    }

    export interface ReturnValue {
        type: string;
        description: string;
    }

    export interface Deprecated {
        since: string;
        text: string;
    }

    export interface Parameter {
        name: string;
        type: string;
        optional: boolean;
        description: string;
    }

    export interface Method {
        name: string;
        visibility: string;
        returnValue: ReturnValue;
        since: string;
        description: string;
        deprecated: Deprecated;
        parameters: Parameter[];
        static: boolean;
    }

    export interface Symbol {
        kind: string;
        name: string;
        basename: string;
        resource: string;
        module: string;
        static: boolean;
        visibility: string;
        description: string;
        properties: Property[];
        methods: Method[];
        constructor: Constructor;
        extends: string;
        abstract: boolean;
    }

    export interface Constructor {
        visibility: string;
        description: string;
        parameters: Parameter[];
    }

    export interface RootObject {
        version: string;
        library: string;
        symbols: Symbol[];
    }
}