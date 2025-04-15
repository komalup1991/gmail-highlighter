document.addEventListener("DOMContentLoaded", () => {
  // Load saved keywords
  chrome.storage.local.get(
    ["rejectionEmailCount", "customKeywords"],
    (data) => {
      document.getElementById("count").textContent =
        data.rejectionEmailCount || 0;
      document.getElementById("keywords").value = (
        data.customKeywords || []
      ).join(", ");
    },
  );

  document.getElementById("save").addEventListener("click", () => {
    const keywordInput = document.getElementById("keywords").value;
    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
    chrome.storage.local.set({ customKeywords: keywords }, () => {
      alert("Keywords saved! Refresh Gmail to apply.");
    });
  });
});
