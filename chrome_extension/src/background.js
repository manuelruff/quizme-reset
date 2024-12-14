chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "pageNavigated") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await new Promise(resolve => {
      const checkPageLoaded = () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: sender.tab.id },
            func: () => document.readyState,
          },
          (results) => {
            if (results[0]?.result === "complete") {
              resolve(); 
            } else {
              setTimeout(checkPageLoaded, 1000);
            }
          }
        );
      };
      checkPageLoaded();
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        files: ["src/content.js"],
      },
      () => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "resetAllPages",
        });
      }
    );
  }
});