chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "navigateNext") {
      const tabId = sender.tab.id;
      chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
              const nextButton = document.querySelector('.pagination a[rel="next"]');
              if (nextButton) nextButton.click();
          },
      });

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
    
      chrome.scripting.executeScript(
          {
              target: { tabId },
              files: ["src/content.js"],
          },
          () => {
              chrome.tabs.sendMessage(tabId, {
                  action: "resetAllPages",
              });
          }
      );
  }
});
