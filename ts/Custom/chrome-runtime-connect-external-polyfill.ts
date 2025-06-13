var connection: chrome.runtime.Port;
var reconnectAttempts = 0;
var maxReconnectAttempts = 5;
var reconnectDelay = 1000; // 1 second
var reconnectTimeout: ReturnType<typeof setTimeout>;

document.documentElement!.addEventListener("message-from-portal", e =>
{
    if (e instanceof CustomEvent && e.detail)
    {
        try {
            openConnection().postMessage(JSON.parse(e.detail));
        } catch (error) {
            console.warn('Failed to post message to extension:', error);
        }
    }
});

function openConnection(port?: any)
{
    if (!connection || port)
    {
        try {
            connection = chrome.runtime.connect({ name: 'portal' });
            connection.onMessage.addListener((msg, port) =>
            {
                document.documentElement!.dispatchEvent(
                    new CustomEvent("message-from-extension", { detail: JSON.stringify(msg) }));
            });
            connection.onDisconnect.addListener(() => {
                handleDisconnect();
            });
            
            // Reset reconnect attempts on successful connection
            reconnectAttempts = 0;
            
            // Clear any pending reconnect timeout
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = undefined as any;
            }
            
        } catch (error) {
            console.warn('Failed to establish connection to extension:', error);
            handleDisconnect();
        }
    }
    return connection;
}

function handleDisconnect()
{
    connection = undefined as any;
    
    // Check for runtime.lastError to avoid unnecessary reconnect attempts
    if (chrome.runtime.lastError) {
        console.warn('Extension connection failed:', chrome.runtime.lastError.message);
        
        // Only attempt to reconnect if we haven't exceeded the limit
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            
            // Exponential backoff: delay increases with each attempt
            var delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1);
            
            console.log('Attempting to reconnect to extension in ' + delay + 'ms (attempt ' + reconnectAttempts + '/' + maxReconnectAttempts + ')');
            
            reconnectTimeout = setTimeout(function() {
                openConnection();
            }, delay);
        } else {
            console.error('Max reconnection attempts to extension reached. Giving up.');
        }
    }
}