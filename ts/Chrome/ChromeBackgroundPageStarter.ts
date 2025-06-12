import { ChromeApplicationInstaller } from "./ChromeApplicationInstaller";
import { ChromeStorageManager } from "./ChromeStorageManager";
import { ChromeCommandListener } from "./ChromeCommandListener";
import { ChromeApplicationSettings } from "./ChromeApplicationSettings";
import { ChromeSettingsBus } from "./ChromeSettingsBus";
import { ChromeTranslationAccessor } from "./ChromeTranslationAccessor";
import { ChromeBackgroundMessageBus } from "./ChromeBackgroundMessageBus";
import { BackgroundPageStarter } from "../BackgroundPage/BackgroundPageStarter";
import { ChromeZoomService } from "./ChromeZoomService";
import { ChromeUninstallUrlSetter } from "./ChromeUninstallUrlSetter";
import { FirefoxThemeProcessor } from "./FirefoxThemeProcessor";

// Service worker safe initialization
try {
    new BackgroundPageStarter(
        ChromeApplicationInstaller,
        ChromeStorageManager,
        ChromeCommandListener,
        ChromeApplicationSettings,
        ChromeStorageManager,
        ChromeSettingsBus,
        ChromeZoomService,
        ChromeUninstallUrlSetter,
        ChromeTranslationAccessor,
        FirefoxThemeProcessor,
        ChromeBackgroundMessageBus
    );
    
    // Log successful initialization for debugging
    if (typeof console !== 'undefined' && console.log) {
        console.log('Midnight Chameleon background script initialized successfully');
    }
} catch (error) {
    // Log errors for debugging
    if (typeof console !== 'undefined' && console.error) {
        console.error('Failed to initialize Midnight Chameleon background script:', error);
    }
}