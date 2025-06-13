import { injectable } from "../Utils/DI";
import { ITranslationAccessor } from "../i18n/ITranslationAccessor";

@injectable(ITranslationAccessor)
export class ChromeTranslationAccessor implements ITranslationAccessor
{
    constructor()
    {
    }

    public getMessage(messageKey: string, ...substitutions: string[]): string
    {
        // Translation system disabled - return empty string
        // All text should be directly in HTML without i18n
        return "";
    }
}