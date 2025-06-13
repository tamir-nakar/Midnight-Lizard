import { injectable } from "../Utils/DI";
import { IContentMessageBus } from "../ContentScript/IContentMessageBus";
import { ArgumentedEventDispatcher } from "../Events/EventDispatcher";
import { LocalMessageToContent, LocalMessageFromContent } from "../Settings/Messages";
import { IApplicationSettings } from "../Settings/IApplicationSettings";

@injectable(IContentMessageBus)
export class ChromeContentMessageBus implements IContentMessageBus
{
    private connection?: chrome.runtime.Port;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // 1 second
    private reconnectTimeout?: ReturnType<typeof setTimeout>;

    private _onMessage = new ArgumentedEventDispatcher<
        LocalMessageToContent>();
    public get onMessage()
    {
        return this._onMessage.event;
    }

    constructor(private app: IApplicationSettings)
    {
        this.openConnection();
    }

    public postMessage(message: LocalMessageFromContent)
    {
        try {
            const conn = this.openConnection();
            if (conn) {
                conn.postMessage(message);
            } else if (this.app.isDebug) {
                console.warn('No connection available to post message');
            }
        } catch (error) {
            if (this.app.isDebug) {
                console.warn('Failed to post message:', error);
            }
        }
    }

    openConnection(port?: any): chrome.runtime.Port | undefined
    {
        if (!this.connection || port)
        {
            try {
                this.connection = chrome.runtime.connect({ name: 'content' });
                this.connection.onMessage.addListener((msg, port) =>
                {
                    this._onMessage.raise(msg);
                });
                this.connection.onDisconnect.addListener(() => {
                    this.handleDisconnect();
                });
                
                // Reset reconnect attempts on successful connection
                this.reconnectAttempts = 0;
                
                // Clear any pending reconnect timeout
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = undefined;
                }
                
            } catch (error) {
                if (this.app.isDebug) {
                    console.warn('Failed to establish connection:', error);
                }
                this.handleDisconnect();
            }
        }
        return this.connection;
    }

    private handleDisconnect()
    {
        this.connection = undefined;
        
        // Check for runtime.lastError to avoid unnecessary reconnect attempts
        if (chrome.runtime.lastError) {
            if (this.app.isDebug) {
                console.warn('Connection failed:', chrome.runtime.lastError.message);
            }
            
            // Only attempt to reconnect if we haven't exceeded the limit
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                
                // Exponential backoff: delay increases with each attempt
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
                
                if (this.app.isDebug) {
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                }
                
                this.reconnectTimeout = setTimeout(() => {
                    this.openConnection();
                }, delay);
            } else {
                if (this.app.isDebug) {
                    console.error('Max reconnection attempts reached. Giving up.');
                }
            }
        }
    }
}