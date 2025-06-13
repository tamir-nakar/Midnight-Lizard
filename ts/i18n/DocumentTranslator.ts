import { injectable } from "../Utils/DI";
import { ITranslationAccessor } from "./ITranslationAccessor";

export abstract class IDocumentTranslator
{
    public abstract translateDocument(doc: Document): void;
}

@injectable(IDocumentTranslator)
class DocumentTranslator implements IDocumentTranslator
{
    constructor(
        protected readonly _i18n: ITranslationAccessor)
    {
    }

    public translateDocument(doc: Document): void
    {
        // Translation system disabled - English only
        // All text should be directly in HTML without i18n attributes
        return;
    }
}