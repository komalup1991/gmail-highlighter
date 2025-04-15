function highlightRejectionEmails(keywords) {
  const emailRows = document.querySelectorAll("tr.zA");
  let count = 0;

  emailRows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    if (keywords.some((keyword) => text.includes(keyword))) {
      if (!row.classList.contains("rejection-highlight")) {
        row.classList.add("rejection-highlight");
      }
      count++;
    }
  });

  chrome.storage.local.set({ rejectionEmailCount: count });
}

function startObserver(keywords) {
  const observer = new MutationObserver(() =>
    highlightRejectionEmails(keywords),
  );
  observer.observe(document.body, { childList: true, subtree: true });

  // Run once initially
  highlightRejectionEmails(keywords);
}

// Load custom keywords from storage and start observing
setTimeout(() => {
  chrome.storage.local.get("customKeywords", (data) => {
    const keywords =
      data.customKeywords && data.customKeywords.length > 0
        ? data.customKeywords
        : ["unfortunately", "thanks for applying"];
    startObserver(keywords);
  });
}, 2000);
