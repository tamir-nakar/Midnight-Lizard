// Minimal service worker entry point for Manifest V3
// This avoids complex dependency injection in service worker context

import { ChromePromise } from "./ChromePromise";

// Essential service worker functionality only
class MinimalServiceWorker {
    private chromePromise: ChromePromise;

    constructor() {
        this.chromePromise = new ChromePromise();
        this.setupBasicListeners();
        console.log('Midnight Chameleon service worker started');
    }

    private setupBasicListeners(): void {
        // Handle extension installation
        if (chrome.runtime.onInstalled) {
            chrome.runtime.onInstalled.addListener((details) => {
                console.log('Extension installed/updated:', details);
                this.injectContentScripts();
            });
        }

        // Handle commands (keyboard shortcuts)
        if (chrome.commands?.onCommand) {
            chrome.commands.onCommand.addListener((command) => {
                this.handleCommand(command);
            });
        }

        // Handle messages from content scripts/popup
        if (chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                this.handleMessage(request, sender, sendResponse);
                return true; // Keep message channel open for async responses
            });
        }
    }

    private async injectContentScripts(): Promise<void> {
        try {
            const tabs = await this.chromePromise.tabs.query({});
            const manifest = chrome.runtime.getManifest();
            const mainContentScript = manifest.content_scripts?.[0];

            if (!mainContentScript) return;

            for (const tab of tabs) {
                if (!tab.id || !tab.url) continue;
                
                // Skip chrome:// and extension pages
                if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                    continue;
                }

                try {
                    // Inject CSS files
                    if (mainContentScript.css) {
                        for (const css of mainContentScript.css) {
                            await this.chromePromise.scripting.insertCSS({
                                target: { tabId: tab.id, allFrames: true },
                                files: [css]
                            });
                        }
                    }

                    // Inject JS files
                    if (mainContentScript.js) {
                        await this.chromePromise.scripting.executeScript({
                            target: { tabId: tab.id, allFrames: true },
                            files: [mainContentScript.js[0]]
                        });
                    }
                } catch (error) {
                    console.log('Failed to inject into tab:', tab.url, error);
                }
            }
        } catch (error) {
            console.error('Failed to inject content scripts:', error);
        }
    }

    private async handleCommand(command: string): Promise<void> {
        try {
            const tabs = await this.chromePromise.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]?.id) {
                await this.chromePromise.tabs.sendMessage(tabs[0].id, {
                    action: 'command',
                    command: command
                });
            }
        } catch (error) {
            console.error('Failed to handle command:', command, error);
        }
    }

    private handleMessage(request: any, sender: any, sendResponse: (response: any) => void): void {
        if (request.action === 'injectPageScript') {
            this.injectPageScript(sender.tab?.id)
                .then(() => sendResponse({ success: true }))
                .catch(error => {
                    console.error('Page script injection error:', error);
                    sendResponse({ error: error.message });
                });
        }
        // Basic message forwarding to active tab
        else if (request.action === 'toggleExtension') {
            this.chromePromise.tabs.query({ active: true, currentWindow: true })
                .then(tabs => {
                    if (tabs[0]?.id) {
                        return this.chromePromise.tabs.sendMessage(tabs[0].id, request);
                    }
                    return null;
                })
                .then(response => sendResponse(response || { success: true }))
                .catch(error => {
                    console.error('Message handling error:', error);
                    sendResponse({ error: error.message });
                });
        } else {
            sendResponse({ success: true });
        }
    }

    private async injectPageScript(tabId?: number): Promise<void> {
        if (!tabId) return;
        
        try {
            // Check if page script is already injected
            const results = await this.chromePromise.scripting.executeScript({
                target: { tabId },
                func: () => {
                    return document.getElementById('midnight-lizard-page-script-injected') !== null;
                }
            });

            if (results[0]?.result) {
                return; // Already injected
            }

            // Inject the page script using proper chrome.scripting API
            await this.chromePromise.scripting.executeScript({
                target: { tabId },
                files: ['js/page-script.js'],
                world: 'MAIN' // Inject into the main world to access page context
            });

            // Mark as injected
            await this.chromePromise.scripting.executeScript({
                target: { tabId },
                func: () => {
                    const marker = document.createElement('meta');
                    marker.id = 'midnight-lizard-page-script-injected';
                    marker.style.display = 'none';
                    document.head.appendChild(marker);
                }
            });

        } catch (error) {
            console.error('Failed to inject page script:', error);
            throw error;
        }
    }
}

// Initialize the minimal service worker
new MinimalServiceWorker(); 