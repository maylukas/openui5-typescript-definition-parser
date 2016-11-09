export declare class IndentedOutputWriter {
    protected outputFilePath: string;
    private indentChars;
    private indentLevel;
    private lineLength;
    private filehandle;
    constructor(outputFilePath: string);
    increaseIndent(): void;
    decreaseIndent(): void;
    writeLine(line: string): void;
    writeChunked(lineModifier: (string) => string, line: string): void;
    openBlockComment(): void;
    closeBlockComment(): void;
    writeTsDocComment(line: string): void;
    newLine(): void;
    closeFile(): void;
}
