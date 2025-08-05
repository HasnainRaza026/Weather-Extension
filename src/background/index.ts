chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    showOverlay: false,
  });
});
