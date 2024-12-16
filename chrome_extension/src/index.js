import translations from './translations.js';

let currentLanguage = "en";
let singlePageFlag = false;

function updateLanguage(lang) {
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("dropdownLabel").textContent = translations[lang].dropdownLabel;
    document.getElementById("optionRegular").textContent = translations[lang].optionRegular;
    document.getElementById("optionNever").textContent = translations[lang].optionNever;
    document.getElementById("optionLow").textContent = translations[lang].optionLow;
    document.getElementById("optionHigh").textContent = translations[lang].optionHigh;
    document.getElementById("resetThisPage").textContent = translations[lang].resetThisPage;
    document.getElementById("resetAllPages").textContent = translations[lang].resetAllPages;
    document.getElementById("toggleLanguage").textContent = translations[lang].toggleLanguage;

    document.body.dir = lang === "he" ? "rtl" : "ltr";
}

async function injectScript(action) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const selectedPriority = document.getElementById("priorityValue").value;
        if (!singlePageFlag) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["src/content.js"],
            });
            singlePageFlag = true; 
        } 
        chrome.tabs.sendMessage(tab.id, { type: "save", action, selectedPriority });
    } catch (error) {
        console.error("Error injecting script or sending message:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resetThisPage").addEventListener("click", () => {
    injectScript("resetThisPage");
  });

  document.getElementById("resetAllPages").addEventListener("click", () => {
    injectScript("resetAllPages");
    window.close();
  });

  document.getElementById("toggleLanguage").addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "he" : "en";
    updateLanguage(currentLanguage);
  });
});
