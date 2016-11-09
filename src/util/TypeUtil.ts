export interface TypeConfig {
    ignoredTypes: string[];
    typeMapping: { [id: string]: string };
}
export class TypeUtil {
    public static namespaces: string[];
    public static _config: TypeConfig;


    public static sapUiTypeToTSType(type: string) {
        let parts;
        if (type.indexOf("|") > 0) {
            parts = type.split("|");
        } else {
            parts = [type];
        }

        return parts.map((part) => {
            if (!this.namespaces.length) {
                throw "no namespaces defined"
            }

            let arrayRegex = new RegExp("^[Aa]rray\\((.*)\\)$")
            if (arrayRegex.exec(part)) {
                return arrayRegex.exec(part)[1] + "[]";
            }

            let isNamespace = this.namespaces.filter((e) => e.trim().toLowerCase().endsWith(part.trim().toLowerCase())).length > 0;

            if (this._config.ignoredTypes.indexOf(part) > -1) {
                return "any";
            }

            if (this._config.ignoredTypes.indexOf(part.replace("[]", "")) > -1) {
                return "any[]";
            }

            if (isNamespace) {
                return "typeof " + part;
            }

            if (part.indexOf("jQuery") === 0) {
                return "any"
            }

            var matchingTypes = Object.keys(this._config.typeMapping).filter((e) => {
                return e === part
            });

            if (matchingTypes.length > 1) {
                throw "Found multiple matching types for \"" + part + "\": " + JSON.stringify(matchingTypes);
            }

            if (matchingTypes.length === 1) {
                return this._config.typeMapping[matchingTypes[0]];
            }

            return part;
        }).reduce((a, b) => {
            return a + "|" + b;
        });
    }
}
