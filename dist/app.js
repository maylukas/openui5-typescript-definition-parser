"use strict";
const https_1 = require('https');
const parser_1 = require("./parser");
const util_1 = require('./util');
const util_2 = require('./util');
const fs_1 = require('fs');
function parseDefinitions(config) {
    if (!config) {
        config = {};
    }
    if (!config.namespaces) {
        config.namespaces = [
            "sap.m",
            "sap.ui.core",
            "sap.ui.layout",
            "sap.ui.unified"
        ];
    }
    if (!config.outFilePath) {
        config.outFilePath = pathJoin(["output", "ui5"], "\\") + ".d.ts";
    }
    if (!config.methodExceptionsFile) {
        config.methodExceptionsFile = 'parse-configurations/MethodExceptions.json';
    }
    if (!config.typeConfigFile) {
        config.typeConfigFile = "parse-configurations/TypeConfig.json";
    }
    util_1.TypeUtil._config = JSON.parse(fs_1.readFileSync(config.typeConfigFile, 'utf-8'));
    parser_1.MethodParser._exceptions = JSON.parse(fs_1.readFileSync(config.methodExceptionsFile, 'utf-8'));
    let libs = [];
    function pathJoin(parts, sep) {
        var separator = sep || '/';
        var replace = new RegExp(separator + '{1,}', 'g');
        return parts.join(separator).replace(replace, separator);
    }
    for (let ns of config.namespaces) {
        let namespaceWithSlashes = ns.replace(/\./g, "/");
        let namespaceNames = [];
        https_1.get("https://openui5.hana.ondemand.com/test-resources/" + namespaceWithSlashes + "/designtime/api.json", (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log("JSON Definition for namespace " + ns + " loaded.");
                let rootObj = JSON.parse(body);
                libs.push(rootObj);
                console.log(libs.length + "   " + config.namespaces.length);
                if (libs.length === config.namespaces.length) {
                    let allSymbols = [];
                    console.log("all downloads complete, starting compilation...");
                    for (let lib of libs) {
                        namespaceNames = namespaceNames.concat(lib.symbols.filter((s) => {
                            return s.kind === "namespace";
                        }).map((symbol) => symbol.name));
                        allSymbols = allSymbols.concat(lib.symbols);
                    }
                    console.log("Using namespaces: " + namespaceNames);
                    util_1.TypeUtil.namespaces = namespaceNames;
                    let namespaces = allSymbols.filter((s) => {
                        return s.kind === "namespace";
                    });
                    for (let symbol of allSymbols) {
                        if (symbol.kind !== "namespace") {
                            let classParser = new parser_1.ClassParser(null, symbol, null);
                            let matchingNamespaces = namespaces.filter((e) => e.name === classParser.getNestedNamespaceName());
                            if (!matchingNamespaces.length) {
                                let namespace = {
                                    kind: "namespace",
                                    name: classParser.getNestedNamespaceName(),
                                    basename: classParser.getNestedNamespaceName().substring(classParser.getNestedNamespaceName().lastIndexOf(".") + 1),
                                    resource: "",
                                    module: classParser.getNestedNamespaceName().substring(0, classParser.getNestedNamespaceName().lastIndexOf(".")),
                                    static: true,
                                    visibility: "public",
                                    description: "",
                                    properties: undefined,
                                    methods: undefined,
                                };
                                namespaces.push(namespace);
                                allSymbols.push(namespace);
                            }
                        }
                    }
                    let symbolsSortedByLength = allSymbols.sort((a, b) => {
                        return a.name.length - b.name.length;
                    });
                    namespaces = namespaces.sort((a, b) => {
                        return a.name.length - b.name.length;
                    });
                    let j = 0;
                    let writer = new util_2.IndentedOutputWriter(config.outFilePath);
                    new parser_1.LibraryParser(writer, symbolsSortedByLength, namespaces).generate();
                }
            });
        });
    }
}
exports.parseDefinitions = parseDefinitions;
//# sourceMappingURL=app.js.map