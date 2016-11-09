"use strict";
const TypeUtil_1 = require('./TypeUtil');
class ParamParser {
    static parseParams(parameters) {
        if (parameters) {
            let lastMandatoryParamIdx = 0;
            for (let i = 0; i < parameters.length; i++) {
                if (!parameters[i].optional) {
                    lastMandatoryParamIdx = i;
                }
            }
            return parameters.map((param, i) => {
                let paramString = "";
                paramString += param.name;
                if (param.optional && i > lastMandatoryParamIdx)
                    paramString += "?";
                paramString += ": " + TypeUtil_1.TypeUtil.sapUiTypeToTSType(param.type);
                return paramString;
            }).reduce((a, b) => {
                return a + ", " + b;
            });
        }
        else {
            return "";
        }
    }
}
exports.ParamParser = ParamParser;
//# sourceMappingURL=ParamParser.js.map