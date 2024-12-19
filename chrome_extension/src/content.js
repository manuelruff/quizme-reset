// Reset the page frequencies based on the selected priority
function resetThisPage(priority) {
    const selectElements = document.querySelectorAll('.selectPriority');
    selectElements.forEach((selectElement) => {
        selectElement.value = priority;
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    });
}
// Extract pagination information from the current page
function getPaginationInfo() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return { currentPage: 1, totalPages: 1 };

    const links = Array.from(pagination.querySelectorAll('a'));
    const pages = links
        .map((link) => parseInt(link.href.match(/p=(\d+)/)?.[1], 10))
        .filter(Number.isInteger);

    const currentPage = parseInt(pagination.querySelector('.active a')?.href.match(/p=(\d+)/)?.[1], 10) || 1;
    const totalPages = Math.max(...pages);
    return { currentPage, totalPages };
}
// Reset the current page, update current page and tells background to navigate to the next page
async function resetPageAndNavigate(priority) {
    resetThisPage(priority);
    chrome.storage.local.get(["currentPage", "totalPages"], (data) => {
        const { currentPage, totalPages } = data;
        if (currentPage < totalPages) {
            chrome.storage.local.set({currentPage: currentPage + 1,});
            chrome.runtime.sendMessage({type: "navigateNext"});
        } else {
            alert("Process completed!");
            location.reload();
        }
    });
}

// Listen for messages
chrome.runtime.onMessage.addListener((message) => {
    // Save the current page and total pages in Chrome storage
    if (message.type === "save") {
        const { currentPage, totalPages } = getPaginationInfo();
        chrome.storage.local.set({
            currentPage,
            totalPages,
            lastAction: message.action,
            lastPriority: message.selectedPriority,
        });
    }
    // Activate reset priorities for the current page
    if (message.action === "resetThisPage") {
        resetThisPage(message.selectedPriority);
    }
    // Activate reset priorities for all pages 
    else if (message.action === "resetAllPages") {
        chrome.storage.local.get(["lastAction", "lastPriority"], (data) => {
            resetPageAndNavigate(data.lastPriority);
        });
    }
    else if (message.action === "showAlert") {
        alert(message.message); 
        location.reload();
    }
});
