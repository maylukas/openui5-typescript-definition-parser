import {openSync, writeSync, closeSync} from 'fs';
import {existsSync, mkdirSync, unlinkSync } from 'fs';
import {dirname} from 'path';

export class IndentedOutputWriter {

    private indentChars = "  ";
    private indentLevel: number = 0;
    private lineLength: number = 100;

    private filehandle: number;

    constructor(protected outputFilePath: string) {
        let parentFolderPath = dirname(outputFilePath)

        if (!existsSync(parentFolderPath)) {
            console.log("Creating directory \"" + parentFolderPath + "\"")
            mkdirSync(parentFolderPath)
        }

        if (existsSync(outputFilePath)) {
            unlinkSync(outputFilePath);
        }

        this.filehandle = openSync(outputFilePath, "w")
    }

    public increaseIndent() {
        this.indentLevel++;
    }

    public decreaseIndent() {
        this.indentLevel--;
    }

    public writeLine(line: string) {
        let indentPrefix = new Array(this.indentLevel + 1).join(this.indentChars)
        writeSync(this.filehandle, indentPrefix + line + "\r\n", null, "UTF-8")
    }

    public writeChunked(lineModifier: (string) => string, line: string) {
        if (line) {
            if (line.length > 100) {
                let regexp = new RegExp("(.{0,100})\\s(.*)");
                let result = regexp.exec(line);
                if (!result) {
                    console.log("Cannot write line " + line)
                } else {
                    this.writeLine(lineModifier(result[1]))
                    if (result[2].trim().length) {
                        this.writeChunked(lineModifier, result[2]);
                    }
                }
            } else {
                this.writeLine(lineModifier(line))
            }
        }
    }
    public openBlockComment() {
        this.writeLine("/**")
    }

    public closeBlockComment() {
        this.writeLine("*/")
    }
    public writeTsDocComment(line: string) {
        if (line) {
            this.writeChunked((str) => { return " * " + str }, line.replace(/[\r\n]/g, ''))
        }

    }

    public newLine() {
        this.writeLine("")
    }

    public closeFile() {
        closeSync(this.filehandle);
    }
}