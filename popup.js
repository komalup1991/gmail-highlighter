function loadProfiles() {
  chrome.storage.local.get(
    ["profiles", "activeProfile", "rejectionEmailCount"],
    (data) => {
      const profiles = data.profiles || {
        Rejections: ["unfortunately", "thanks for applying"],
      };
      const active = data.activeProfile || "Rejections";
      const count = data.rejectionEmailCount || 0;

      document.getElementById("count").textContent = count;
      const select = document.getElementById("profileSelect");
      select.innerHTML = "";

      Object.keys(profiles).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        if (name === active) option.selected = true;
        select.appendChild(option);
      });

      document.getElementById("keywords").value = profiles[active].join(", ");
    },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfiles();

  document.getElementById("profileSelect").addEventListener("change", (e) => {
    const newProfile = e.target.value;
    chrome.storage.local.get("profiles", (data) => {
      chrome.storage.local.set(
        {
          activeProfile: newProfile,
          customKeywords: data.profiles[newProfile],
        },
        () => loadProfiles(),
      );
    });
  });

  document.getElementById("save").addEventListener("click", () => {
    const newKeywords = document
      .getElementById("keywords")
      .value.split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const selected = document.getElementById("profileSelect").value;
    chrome.storage.local.get("profiles", (data) => {
      const profiles = data.profiles || {};
      profiles[selected] = newKeywords;

      chrome.storage.local.set(
        {
          profiles,
          customKeywords: newKeywords,
        },
        () => alert("Profile updated! Refresh Gmail."),
      );
    });
  });

  document.getElementById("newProfile").addEventListener("click", () => {
    const name = prompt("Enter new profile name:");
    if (!name) return;

    chrome.storage.local.get("profiles", (data) => {
      const profiles = data.profiles || {};
      if (profiles[name]) {
        alert("Profile already exists.");
        return;
      }

      profiles[name] = [];
      chrome.storage.local.set(
        {
          profiles,
          activeProfile: name,
          customKeywords: [],
        },
        () => loadProfiles(),
      );
    });
  });
});
