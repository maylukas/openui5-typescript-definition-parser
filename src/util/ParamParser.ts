import {TypeUtil} from './TypeUtil';
export class ParamParser {
    public static parseParams(parameters: ts_gen.api.Parameter[]): string {
        if (parameters) {
            let lastMandatoryParamIdx = 0;
            for(let i = 0; i < parameters.length; i++){
                if(!parameters[i].optional){
                    lastMandatoryParamIdx = i;
                }
            }

            return parameters.map((param, i) => {
                let paramString = "";
                paramString += param.name
                if (param.optional && i > lastMandatoryParamIdx) paramString += "?"
                paramString += ": " + TypeUtil.sapUiTypeToTSType(param.type)
                return paramString;
            }).reduce((a, b) => {
                return a + ", " + b;
            });
        } else {
            return "";
        }

    }
}