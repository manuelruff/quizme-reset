function resetThisPage(priority) {
    const selectElements = document.querySelectorAll('.selectPriority');
    selectElements.forEach((selectElement) => {
        selectElement.value = priority;
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    });
}

let processCompleted = false;
async function resetPageAndNavigate(priority) {
    if (processCompleted) return; 
    resetThisPage(priority);
    const nextButton = document.querySelector('.pagination a[rel="next"]');
    if (nextButton) {
        chrome.runtime.sendMessage({ type: "pageNavigated" });
        nextButton.click(); 
    } else {
        processCompleted = true;
        alert("process completed");
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "save") {
        chrome.storage.local.set({ lastAction: message.action, lastPriority: message.selectedPriority });
    }
    if (message.action === "resetThisPage") {
        resetThisPage(message.selectedPriority);
    } else if (message.action === "resetAllPages") {
        chrome.storage.local.get(["lastAction", "lastPriority"], (data) => {
            if (data.lastAction && data.lastPriority) {
                resetPageAndNavigate(data.lastPriority);
            }
            else {
                chrome.runtime.sendMessage({ type: "displayAlert", message: "we had a problem. please reset and try again" });
            }
        });
    }
});
