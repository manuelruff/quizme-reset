function resetThisPage(priority) {
    const selectElements = document.querySelectorAll('.selectPriority');
    selectElements.forEach((selectElement) => {
        selectElement.value = priority;
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    });
}

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

async function resetPageAndNavigate(priority) {
    resetThisPage(priority);
    const nextButton = document.querySelector('.pagination a[rel="next"]');
    const { currentPage, totalPages } = getPaginationInfo();
    if (nextButton && currentPage < totalPages) {
        chrome.runtime.sendMessage({type: "pageNavigated"});
        nextButton.click();
    } else {
        alert("Process completed!");
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "save") {
        const { currentPage, totalPages } = getPaginationInfo();
        chrome.storage.local.set({
            currentPage,
            totalPages,
            lastAction: message.action,
            lastPriority: message.selectedPriority,
        });
    }
    if (message.action === "resetThisPage") {
        resetThisPage(message.selectedPriority);
    } else if (message.action === "resetAllPages") {
        chrome.storage.local.get(["lastAction", "lastPriority"], (data) => {
            if (data.lastAction && data.lastPriority) {
                resetPageAndNavigate(data.lastPriority);
            } else {
                chrome.runtime.sendMessage({
                    type: "displayAlert",
                    message: "We had a problem. Please reset and try again.",
                });
            }
        });
    }
});
