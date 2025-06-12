import { injectable } from "../Utils/DI";
import { IApplicationSettings, BrowserName, BrowserVendor } from "../Settings/IApplicationSettings";
import { StorageType, StorageLimits } from "../Settings/IStorageManager";
import { ChromePromise } from "./ChromePromise";

@injectable(IApplicationSettings)
export class ChromeApplicationSettings implements IApplicationSettings
{
    protected readonly _isDebug: boolean;
    get isDebug() { return this._isDebug }

    get isInIncognitoMode() { 
        try {
            return chrome.extension.inIncognitoContext;
        } catch {
            return false;
        }
    }

    get currentLocale()
    {
        try {
            return chrome.runtime.getManifest().current_locale || "en";
        } catch {
            return "en";
        }
    }

    get browserName()
    {
        return typeof browser === "object"
            ? BrowserName.Firefox
            : BrowserName.Chrome
    }

    get browserVendor(): BrowserVendor
    {
        if (typeof navigator !== 'undefined')
        {
            if (/Edg\//.test(navigator.userAgent))
            {
                return BrowserVendor.Microsoft;
            }
            else if (/OPR/.test(navigator.userAgent))
            {
                return BrowserVendor.Opera;
            }
            else if (/UBrowser/.test(navigator.userAgent))
            {
                return BrowserVendor.UC;
            }
            else if (this.browserName === BrowserName.Firefox)
            {
                return BrowserVendor.Mozilla;
            }
            else
            {
                return BrowserVendor.Google;
            }
        }
        // Fallback for service workers
        return this.browserName === BrowserName.Firefox 
            ? BrowserVendor.Mozilla 
            : BrowserVendor.Google;
    }

    get isMobile()
    {
        return typeof navigator !== 'undefined' 
            ? /mobile/gi.test(navigator.userAgent)
            : false;
    }

    get isDesktop()
    {
        return typeof navigator !== 'undefined' 
            ? !/mobile/gi.test(navigator.userAgent)
            : true;
    }

    protected readonly _preserveDisplay: boolean = false;
    get preserveDisplay() { return this._preserveDisplay }

    get version() { 
        try {
            return chrome.runtime.getManifest().version;
        } catch {
            return "unknown";
        }
    }

    get id() { 
        try {
            return chrome.runtime.id;
        } catch {
            return "unknown";
        }
    }

    constructor(
        protected readonly _rootDocument: Document,
        protected readonly _chrome: ChromePromise)
    {
        try {
            if (chrome.runtime.id === "pbnndmlekkboofhnbonilimejonapojg" || // chrome
                chrome.runtime.id === "{8fbc7259-8015-4172-9af1-20e1edfbbd3a}" || // firefox
                chrome.runtime.getManifest().update_url)
            {   // production environment
                this._isDebug = false;
            }
            else
            {   // development environment
                this._isDebug = true;
            }
        } catch {
            // Fallback if Chrome APIs are not available
            this._isDebug = true;
        }

        // console.log(`Midnight Chameleon ${this._isDebug ? "Development" : "Production"}-${this.id}`);

        // Only access document if it's available (not in service workers)
        this._preserveDisplay = _rootDocument && _rootDocument.location 
            ? /facebook|baidu/gi.test(_rootDocument.location.hostname)
            : false;
    }

    public getFullPath(relativePath: string)
    {
        try {
            return chrome.runtime.getURL(relativePath);
        } catch {
            return relativePath;
        }
    }

    public getStorageLimits(
        storage: StorageType,
        limit: StorageLimits)
    {
        try {
            return chrome.storage[storage as 'sync'][limit];
        } catch {
            return 0;
        }
    }
}