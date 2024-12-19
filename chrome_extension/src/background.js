// Function to inject the content script into a tab and send a message
function injectContentScriptAndSendMessage(tabId, message) {
    chrome.scripting.executeScript(
        {
            target: { tabId },
            files: ["src/content.js"],
        },
        () => {
            chrome.tabs.sendMessage(tabId, message);
        }
    );
}

// Listen for messages from the content script to navigate to the next page and reinject the content script
chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === "navigateNext") {
        const tabId = sender.tab.id;

        // Click the next button on the current page
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                const nextButton = document.querySelector('.pagination a[rel="next"]');
                if (nextButton) nextButton.click();
            },
        });

        // Wait for the next page to load
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId },
                        func: () => document.readyState,
                    },
                    (results) => {
                        if (results[0]?.result === "complete") {
                            clearInterval(interval);
                            resolve();
                        }
                    }
                );
            }, 1000);
        });

        // Check that the user did not switch to a different page than the expected one (next page)
        chrome.tabs.get(tabId, (tab) => {
            const currentUrl = tab.url;

            if (!currentUrl.includes("quiz-discussion")) {
                injectContentScriptAndSendMessage(tabId, {
                    action: "showAlert",
                    message: `The extension has stopped because you navigated to a different page. Please do not interact with this tab while the extension is running. Restart the extension if necessary.`,
                });
                return; // Stop execution if the user navigated to an unexpected page
            }

            chrome.storage.local.get(["currentPage", "totalPages"], (data) => {
                const { currentPage } = data;
                const urlParams = new URLSearchParams(new URL(currentUrl).search);
                const pageInUrl = parseInt(urlParams.get("p"), 10);

                if (pageInUrl !== currentPage) {
                    injectContentScriptAndSendMessage(tabId, {
                        action: "showAlert",
                        message: `The extension has stopped because you navigated to a different page. Please do not interact with this tab while the extension is running. Restart the extension if necessary.`,
                    });
                    return; // Stop if the page number does not match the expected page
                }

                // Reinject the content script to handle the next page
                injectContentScriptAndSendMessage(tabId, {
                    action: "resetAllPages",
                });
            });
        });
    }
});
