import { ColorScheme, excludeSettingsForExport, ColorSchemePropertyName } from "./ColorScheme";
import { injectable } from "../Utils/DI";
import { IApplicationSettings } from "./IApplicationSettings";
import { SettingsFile } from "./SettingsFile";

export abstract class ISettingsExporter
{
    abstract export(settings: ColorScheme): void;
}

@injectable(ISettingsExporter)
class SettingsExporter implements ISettingsExporter
{
    constructor(
        protected readonly _doc: Document,
        protected readonly _app: IApplicationSettings)
    {
    }

    public export(settings: ColorScheme): void
    {
        const fileContentObject: SettingsFile =
        {
            description: "Midnight Chameleon Color Scheme File",
            version: this._app.version,
            timestamp: new Date(),
            colorSchemes:
                [
                    settings
                ]
        };
        const fileContentText = JSON.stringify(fileContentObject, (propName, propVal) =>
            !propName || excludeSettingsForExport.indexOf(propName as ColorSchemePropertyName) === -1 || fileContentObject.hasOwnProperty(propName)
                ? propVal
                : undefined, 4);
        const fileLink = this._doc.createElement("a");
        fileLink.style.display = "none";
        fileLink.target = "_blank";
        fileLink.download = `${(settings.colorSchemeName || "midnight lizard color scheme").replace(/\W/gi, "-")}.json`;
        fileLink.href = `data:application/json;charset=utf-8,${encodeURIComponent(fileContentText)}`;
        this._doc.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
    }
}