import { Container } from "../Utils/DI";
import { CurrentExtensionModule, ExtensionModule } from "../Settings/ExtensionModule";
import { ICommandProcessor } from "./CommandProcessor";
import { IZoomService } from "./IZoomService";
import { IUninstallUrlSetter } from "./IUninstallUrlSetter";
import { IThemeProcessor } from "./IThemeProcessor";
import { IApplicationInstaller } from "./IApplicationInstaller";
import { IExternalMessageProcessor } from "./ExternalMessageProcessor";
import { ILocalMessageProcessor } from "./LocalMessageProcessor";

// Service workers don't have access to document, so we provide a safe implementation
if (typeof document !== 'undefined') {
    Container.register(Document, class { constructor() { return document } });
} else {
    // For service workers, provide a minimal mock document
    Container.register(Document, class { 
        constructor() { 
            return {
                location: null,
                body: null,
                documentElement: null,
                head: null
            } as any;
        } 
    });
}

Container.register(CurrentExtensionModule, class
{
    constructor()
    {
        return new CurrentExtensionModule(
            ExtensionModule.BackgroundPage);
    }
});

export class BackgroundPageStarter
{
    constructor(...registerations: any[])
    {
        Container.resolve(ICommandProcessor);
        Container.resolve(IZoomService);
        Container.resolve(IUninstallUrlSetter);
        Container.resolve(IThemeProcessor);
        Container.resolve(IApplicationInstaller);
        Container.resolve(IExternalMessageProcessor);
        Container.resolve(ILocalMessageProcessor);
    }
}