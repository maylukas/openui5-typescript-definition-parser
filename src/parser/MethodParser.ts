import {IndentedOutputWriter, TypeUtil, ParamParser} from '../util';
import {readFileSync} from 'fs';
export interface MethodException {
    methodName: string;
    applicableReturnTypes: string[];
    applicableSignatures: string[];
    usedReturnType: string;
    usedSignature: string;
}

export class MethodParser {

    public static _exceptions: MethodException[] = null;

    constructor(protected writer: IndentedOutputWriter, protected method: ts_gen.api.Method, protected symbolContext: ts_gen.api.Symbol) {

    }

    public generate() {
        this.writer.newLine();

        let returnDescription;
        let returnValue = ""
        if (this.method.returnValue && this.method.returnValue.type && this.method.returnValue.type !== "null") {
            if (this.method.returnValue.type === "function" && this.method.name === "extend") {
                returnValue = TypeUtil.sapUiTypeToTSType(this.symbolContext.basename)
            } else if (this.method.name === "getProperty") {
                returnValue = "any"
            } else {
                returnValue = TypeUtil.sapUiTypeToTSType(this.method.returnValue.type);
                if (this.method.returnValue.description) {
                    returnDescription = this.method.returnValue.description;
                }
            }
        } else {
            returnValue = "void";
        }

        // Workaround for jQuery.sap.control
        if (this.method.name === "control" && returnValue === "sap.ui.core.Control[]|sap.ui.core.Control|any") {
            returnValue = "any";
        }

        if (this.method.name === "extend") {
            return "any";
        }

        this.writer.openBlockComment();
        this.writer.writeTsDocComment(this.method.description);
        if (this.method.since) {
            this.writer.writeTsDocComment("@since " + this.method.since)
        }
        if (this.method.parameters) {
            for (let param of this.method.parameters) {
                this.writer.writeTsDocComment("@param " + param.name + " " + param.description);
            }
        }
        if (returnDescription) this.writer.writeTsDocComment("@returns " + returnDescription);

        this.writer.closeBlockComment();

        let matchingExceptions = MethodParser._exceptions.filter((e) => e.methodName === this.method.name && e.applicableReturnTypes.indexOf(returnValue) > -1 && e.applicableSignatures.indexOf(ParamParser.parseParams(this.method.parameters)) > -1)
        let accessModifier = "";
        /*if (this.method.static) {
            accessModifier += " static";
        }*/

        if (this.method.name === "getControlMessages") {
            console.log();
        }

        if (this.symbolContext.kind === "namespace") {
            accessModifier = "function"
        }

        if (this.method.name === "define") {
            let additionalMethods = `
interface ComponentConfig {
    // 	the name of the Component to load
    name: string;
    // 	an alternate location from where to load the Component
    url?: string;
    // 	initial data of the Component (@see sap.ui.core.Component#getComponentData)
    componentData?: any;
    // 	the sId of the new Component
    id?: string;
    //	the mSettings of the new Component
    settings?;
}
//  Creates a new instance of a Component or returns the instance of an existing Component.
function component(vConfig: string | ComponentConfig): JQueryPromise<sap.ui.core.Component> | sap.ui.core.Component;

//  Defines a controller class or creates an instance of an already defined controller class.
function controller(sName: string, oControllerImpl?): void | sap.ui.core.mvc.Controller;

//  Defines a Javascript module with its name, its dependencies and a module value or factory.
function define(vFactory);
function define(aDependencies, vFactory);
function define(sModuleName: string, aDependencies, vFactory);

//  Creates 0.
function extensionpoint(oContainer, sExtName: string, fnCreateDefaultContent?, oTargetControl?, sAggregationName?: string);

//  Instantiate a Fragment - this method loads the Fragment content, instantiates it, and returns this content.
function fragment(sName: string, sType: string, oController?);

//  Retrieve the SAPUI5 Core instance for the current window.
//  and returns it or if a library name is specified then the version info of the individual library will be returned.
function getCore(): sap.ui.core.Core;

// Loads the version info file (resources/sap-ui-version.json);
function getVersionInfo(sLibName?: string)

//  Instantiates an HTML-based Fragment.
function htmlfragment(vFragment, oController?);
function htmlfragment(sId: string, vFragment, oController?);

//  Defines or creates an instance of a declarative HTML view.
function htmlview(vView);
function htmlview(sId: string, vView);

//  Defines OR instantiates an HTML-based Fragment.
function jsfragment(sFragmentName: string, oController?);
function jsfragment(sId: string, sFragmentName: string, oController?);

//  Creates a JSON view of the given name and id.
function jsonview(vView): sap.ui.core.mvc.View;
function jsonview(sId: string, vView): sap.ui.core.mvc.View;

//  Defines or creates an instance of a JavaScript view.
function jsview(vView): sap.ui.core.mvc.JSView;
function jsview(sId: string, vView): sap.ui.core.mvc.JSView;

//  Creates a lazy loading stub for a given class sClassName.
function lazyRequire(sClassName: string, sMethods?: string, sModuleName?: string);

//  Redirects access to resources that are part of the given namespace to a location relative to the assumed application root folder.
function localResources(sNamespace: string);

//  Resolves one or more module dependencies.
function require(vDependencies, fnCallback?);

//  Returns the URL of a resource that belongs to the given library and has the given relative location within the library.
function resource(sLibraryName: string, sResourcePath: string);

//  Creates a Template for the given id, dom reference or a configuration object.
function template(oTemplate?);

//  Defines or creates an instance of a template view.
function templateview(vView);
function templateview(sId: string, vView);

//  Creates a view of the given type, name and with the given id.
function view(sId: string, vView?): sap.ui.core.mvc.View;

//  Instantiates an XML-based Fragment.
function xmlfragment(vFragment, oController?);
function xmlfragment(sId: string, vFragment, oController?);

//  Instantiates an XMLView of the given name and with the given id.
function xmlview(vView): sap.ui.core.mvc.View;
function xmlview(sId: string, vView): sap.ui.core.mvc.View; 
            `
            additionalMethods.split(/[\r\n]+/).forEach(line => this.writer.writeLine(line))
            
        } else if (matchingExceptions.length === 1) {
            let exception = matchingExceptions[0]
            this.writer.writeLine(accessModifier + " " + exception.methodName + "(" + exception.usedSignature + "): " + exception.usedReturnType.replace("__returnValue__", returnValue) + ";");
        } else if (matchingExceptions.length > 1) {
            throw "Too many exception matched method " + JSON.stringify(this.method);
        } else {

            let line = accessModifier + " " + this.method.name + "(" + ParamParser.parseParams(this.method.parameters) + "): " + returnValue + ";";
            this.writer.writeLine(line)
        }


        return "";
    }


}