export function createServicesModule(__appRuntimeContext) {
  let paidPrintWatchInterval = null;

  function loadCloudinarySettings() {
    const cloud =
      localStorage.getItem("cloudinaryCloudName") || __appRuntimeContext.CLOUDINARY_CLOUD_NAME;
    const preset =
      localStorage.getItem("cloudinaryUploadPreset") || __appRuntimeContext.CLOUDINARY_UPLOAD_PRESET;
    const folderBase =
      localStorage.getItem("cloudinaryFolderBase") ||
      __appRuntimeContext.CLOUDINARY_FOLDER_BASE_DEFAULT;
    const use =
      (localStorage.getItem("cloudinaryUse") || "").toString() !== "false" &&
      Boolean(cloud && preset);
    if (__appRuntimeContext.DOM.cloudNameInput) __appRuntimeContext.DOM.cloudNameInput.value = cloud || "";
    if (__appRuntimeContext.DOM.cloudPresetInput) __appRuntimeContext.DOM.cloudPresetInput.value = preset || "";
    if (__appRuntimeContext.DOM.cloudFolderInput) __appRuntimeContext.DOM.cloudFolderInput.value = folderBase || "";
    if (__appRuntimeContext.DOM.cloudUseToggle) __appRuntimeContext.DOM.cloudUseToggle.checked = use;
  }

  function saveCloudinarySettings() {
    const cloud = (__appRuntimeContext.DOM.cloudNameInput && __appRuntimeContext.DOM.cloudNameInput.value.trim()) || "";
    const preset =
      (__appRuntimeContext.DOM.cloudPresetInput && __appRuntimeContext.DOM.cloudPresetInput.value.trim()) || "";
    const folderBase =
      (__appRuntimeContext.DOM.cloudFolderInput && __appRuntimeContext.DOM.cloudFolderInput.value.trim()) || "";
    const use = __appRuntimeContext.DOM.cloudUseToggle && __appRuntimeContext.DOM.cloudUseToggle.checked;
    if (cloud) localStorage.setItem("cloudinaryCloudName", cloud);
    else localStorage.removeItem("cloudinaryCloudName");
    if (preset) localStorage.setItem("cloudinaryUploadPreset", preset);
    else localStorage.removeItem("cloudinaryUploadPreset");
    if (folderBase) localStorage.setItem("cloudinaryFolderBase", folderBase);
    else localStorage.removeItem("cloudinaryFolderBase");
    localStorage.setItem("cloudinaryUse", use ? "true" : "false");
    __appRuntimeContext.showToast("Cloudinary settings saved");
  }

  function getCloudinaryConfig() {
    const cloud =
      localStorage.getItem("cloudinaryCloudName") || __appRuntimeContext.CLOUDINARY_CLOUD_NAME;
    const preset =
      localStorage.getItem("cloudinaryUploadPreset") || __appRuntimeContext.CLOUDINARY_UPLOAD_PRESET;
    const folderBase =
      localStorage.getItem("cloudinaryFolderBase") ||
      __appRuntimeContext.CLOUDINARY_FOLDER_BASE_DEFAULT;
    const use =
      (localStorage.getItem("cloudinaryUse") || "").toString() !== "false" &&
      Boolean(cloud && preset);
    return { cloud, preset, folderBase, use };
  }

  function cloudinaryEnabled() {
    const cfg = getCloudinaryConfig();
    return cfg.use;
  }

  function cloudinaryConfigured() {
    const cfg = getCloudinaryConfig();
    return Boolean(cfg.cloud && cfg.preset);
  }

  function getPrintSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(__appRuntimeContext.PRINT_SETTINGS_STORAGE_KEY) || "{}");
      const settings = { ...__appRuntimeContext.DEFAULT_PRINT_SETTINGS, ...(stored && typeof stored === "object" ? stored : {}) };
      if (settings.mode === "paid-queue") {
        settings.mode = settings.noPaymentRequired === true ? "free" : "paid";
      }
      if (!["off", "free", "paid"].includes(settings.mode)) settings.mode = "off";
      return settings;
    } catch (_) {
      return { ...__appRuntimeContext.DEFAULT_PRINT_SETTINGS };
    }
  }

  function getPrintQueueEventId() {
    const settings = getPrintSettings();
    const activeEvent = __appRuntimeContext.getActiveEvent();
    return String((activeEvent && activeEvent.id) || settings.eventId || "default")
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "default";
  }

  function getStaffPrintQueueUrl() {
    const isLocalEnvironment =
      window.location.protocol === "file:" ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const queuePath = isLocalEnvironment ? "staff-print.html" : "staff-print";
    const url = new URL(queuePath, window.location.href);
    const activeEvent = __appRuntimeContext.getActiveEvent();
    const draftEventId = __appRuntimeContext.DOM.printEventIdInput
      ? __appRuntimeContext.DOM.printEventIdInput.value.trim()
      : "";
    const eventId =
      (activeEvent && activeEvent.id) ||
      draftEventId
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") ||
      getPrintQueueEventId();
    url.searchParams.set("eventId", eventId || "default");
    return url.toString();
  }

  function updateStaffPrintQueueUrl() {
    const url = getStaffPrintQueueUrl();
    if (__appRuntimeContext.DOM.staffPrintQueueUrl) __appRuntimeContext.DOM.staffPrintQueueUrl.textContent = url;
    if (__appRuntimeContext.DOM.staffPrintQueueOpen) __appRuntimeContext.DOM.staffPrintQueueOpen.href = url;
    const queueLink = document.getElementById("statusQueueLink");
    if (queueLink) queueLink.href = url;
    if (!__appRuntimeContext.DOM.staffPrintQueueQr) return;
    __appRuntimeContext.DOM.staffPrintQueueQr.dataset.queueUrl = url;
    if (__appRuntimeContext.DOM.staffPrintQueueQrStatus) {
      __appRuntimeContext.DOM.staffPrintQueueQrStatus.textContent = "Preparing QR code…";
    }
    __appRuntimeContext.renderQrCodeAtWidth(__appRuntimeContext.DOM.staffPrintQueueQr, url, 176).then((rendered) => {
      if (__appRuntimeContext.DOM.staffPrintQueueQr.dataset.queueUrl !== url) return;
      if (__appRuntimeContext.DOM.staffPrintQueueQrStatus) {
        __appRuntimeContext.DOM.staffPrintQueueQrStatus.textContent = rendered
          ? "Scan to open the staff queue"
          : "QR code unavailable. Use the queue link instead.";
      }
    });
  }

  function loadPrintSettings() {
    const settings = getPrintSettings();
    if (__appRuntimeContext.DOM.printModeInput) {
      __appRuntimeContext.DOM.printModeInput.value = settings.mode;
      syncEventPrintPriceVisibility();
      if (document.documentElement.dataset.priceVisibilityBound !== "true") {
        document.documentElement.dataset.priceVisibilityBound = "true";
        document.addEventListener("change", (event) => {
          if (event.target && event.target.id === "printModeInput") {
            persistPrintModeSelection();
          }
        });
      }
    }
    if (__appRuntimeContext.DOM.printNoPaymentRequiredInput) __appRuntimeContext.DOM.printNoPaymentRequiredInput.checked = settings.noPaymentRequired === true;
    if (__appRuntimeContext.DOM.printPanelTitleInput) __appRuntimeContext.DOM.printPanelTitleInput.value = settings.panelTitle;
    if (__appRuntimeContext.DOM.printPanelBodyInput) __appRuntimeContext.DOM.printPanelBodyInput.value = settings.panelBody;
    if (__appRuntimeContext.DOM.printInstructionsInput) __appRuntimeContext.DOM.printInstructionsInput.value = settings.instructions;
    if (__appRuntimeContext.DOM.printPaymentQrInput) __appRuntimeContext.DOM.printPaymentQrInput.value = settings.paymentQr;
    if (__appRuntimeContext.DOM.printEventIdInput) __appRuntimeContext.DOM.printEventIdInput.value = settings.eventId;
    if (__appRuntimeContext.DOM.printEventIdInput && !__appRuntimeContext.DOM.printEventIdInput.dataset.queuePreviewBound) {
      __appRuntimeContext.DOM.printEventIdInput.dataset.queuePreviewBound = "true";
      __appRuntimeContext.DOM.printEventIdInput.addEventListener("input", updateStaffPrintQueueUrl);
    }
    updateStaffPrintQueueUrl();
    syncEventPrintPriceInput();
    loadPayPalPrintConfigStatus();
  }

  function persistPrintModeSelection() {
    const printModeInput = document.getElementById("printModeInput");
    if (!printModeInput) return;
    const mode = ["off", "free", "paid"].includes(printModeInput.value)
      ? printModeInput.value
      : "off";
    const settings = getPrintSettings();
    settings.mode = mode;
    settings.noPaymentRequired = mode === "free";
    try {
      localStorage.setItem(__appRuntimeContext.PRINT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
    syncEventPrintPriceVisibility();
    if (mode !== "paid") {
      __appRuntimeContext.finalPrintPriceRequestId += 1;
      if (__appRuntimeContext.DOM.printPriceNotice) {
        __appRuntimeContext.DOM.printPriceNotice.textContent = "";
        __appRuntimeContext.DOM.printPriceNotice.classList.add("hidden");
      }
      if (mode === "off" && __appRuntimeContext.DOM.finalPrintActions) {
        __appRuntimeContext.DOM.finalPrintActions.classList.add("hidden");
      }
    }
  }

  function syncEventPrintPriceVisibility() {
    const eventPrintPriceSettings = document.getElementById("eventPrintPriceSettings");
    const printModeInput = document.getElementById("printModeInput");
    if (!eventPrintPriceSettings || !printModeInput) return;
    const weddingSetup = !!document.querySelector(
      ".setup-session-card.wedding-setup-mode"
    );
    eventPrintPriceSettings.hidden = printModeInput.value !== "paid" && !weddingSetup;
  }

  function syncEventPrintPriceInput(force = false) {
    const active = __appRuntimeContext.getActiveEvent();
    if (!__appRuntimeContext.DOM.eventPrintPriceInput) return;
    if (
      !force &&
      __appRuntimeContext.DOM.eventPrintPriceInput.dataset.dirty === "true" &&
      __appRuntimeContext.DOM.eventPrintPriceInput.dataset.eventId === (active && active.id || "")
    ) return;
    const storedPrice = active ? Number(active.printPrice) : NaN;
    const price = Number.isFinite(storedPrice) && storedPrice >= 0.01 && storedPrice <= 999.99
      ? storedPrice
      : 3;
    __appRuntimeContext.DOM.eventPrintPriceInput.value = price.toFixed(2);
    __appRuntimeContext.DOM.eventPrintPriceInput.dataset.dirty = "false";
    __appRuntimeContext.DOM.eventPrintPriceInput.dataset.eventId = active && active.id || "";
    __appRuntimeContext.DOM.eventPrintPriceInput.disabled = !active;
    if (__appRuntimeContext.DOM.saveEventPrintPriceBtn) __appRuntimeContext.DOM.saveEventPrintPriceBtn.disabled = !active;
  }

  async function saveActiveEventPrintPrice() {
    const active = __appRuntimeContext.getActiveEvent();
    if (!active || !__appRuntimeContext.DOM.eventPrintPriceInput) {
      __appRuntimeContext.showToast("Select or create a saved event before setting its print price.");
      return;
    }
    const price = Number(__appRuntimeContext.DOM.eventPrintPriceInput.value);
    if (!Number.isFinite(price) || price < 0.01 || price > 999.99) {
      __appRuntimeContext.showToast("Enter an event print price from $0.01 to $999.99.");
      return;
    }
    const events = __appRuntimeContext.getStoredEvents();
    const event = events.find((entry) => entry && entry.id === active.id);
    if (!event) {
      __appRuntimeContext.showToast("This saved event could not be found.");
      return;
    }
    event.printPrice = Number(price.toFixed(2));
    __appRuntimeContext.setStoredEvents(events);
    if (__appRuntimeContext.pendingEventsSyncTimer) {
      clearTimeout(__appRuntimeContext.pendingEventsSyncTimer);
      __appRuntimeContext.pendingEventsSyncTimer = null;
    }
    const synced = await __appRuntimeContext.syncEventsRemote();
    syncEventPrintPriceInput(true);
    loadPayPalPrintConfigStatus();
    __appRuntimeContext.showToast(synced
      ? `Event print price saved: $${event.printPrice.toFixed(2)} per print.`
      : `Price is $${event.printPrice.toFixed(2)} on this device; reconnect to sync it for checkout.`);
  }

  async function loadPayPalPrintConfigStatus() {
    if (!__appRuntimeContext.DOM.paypalPrintConfigStatus) return;
    try {
      const eventId = getPrintQueueEventId();
      const response = await fetch(`/api/paypal/config?eventId=${encodeURIComponent(eventId)}`, { cache: "no-store" });
      const config = await response.json();
      if (!response.ok || !config.ok) throw new Error("PayPal status is unavailable.");
      __appRuntimeContext.DOM.paypalPrintConfigStatus.textContent = config.configured
        ? `PayPal ${config.environment} checkout ready · ${config.amount} ${config.currency} per print.`
        : "PayPal checkout is not connected. Add the PayPal API credentials in Cloudflare Pages to enable automatic checkout.";
    } catch (_) {
      __appRuntimeContext.DOM.paypalPrintConfigStatus.textContent = "PayPal checkout status could not be loaded.";
    }
  }

  function savePrintSettings() {
    const settings = {
      mode: __appRuntimeContext.DOM.printModeInput && ["free", "paid"].includes(__appRuntimeContext.DOM.printModeInput.value) ? __appRuntimeContext.DOM.printModeInput.value : "off",
      noPaymentRequired: __appRuntimeContext.DOM.printModeInput && __appRuntimeContext.DOM.printModeInput.value === "free",
      panelTitle: (__appRuntimeContext.DOM.printPanelTitleInput && __appRuntimeContext.DOM.printPanelTitleInput.value.trim()) || __appRuntimeContext.DEFAULT_PRINT_SETTINGS.panelTitle,
      panelBody: (__appRuntimeContext.DOM.printPanelBodyInput && __appRuntimeContext.DOM.printPanelBodyInput.value.trim()) || __appRuntimeContext.DEFAULT_PRINT_SETTINGS.panelBody,
      instructions: (__appRuntimeContext.DOM.printInstructionsInput && __appRuntimeContext.DOM.printInstructionsInput.value.trim()) || __appRuntimeContext.DEFAULT_PRINT_SETTINGS.instructions,
      paymentQr: (__appRuntimeContext.DOM.printPaymentQrInput && __appRuntimeContext.DOM.printPaymentQrInput.value.trim()) || "",
      eventId: (__appRuntimeContext.DOM.printEventIdInput && __appRuntimeContext.DOM.printEventIdInput.value.trim()) || "",
    };
    localStorage.setItem(__appRuntimeContext.PRINT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    syncEventPrintPriceVisibility();
    updateStaffPrintQueueUrl();
    __appRuntimeContext.showToast("Print settings saved");
  }

  async function copyStaffPrintQueueUrl() {
    const url = getStaffPrintQueueUrl();
    try {
      await navigator.clipboard.writeText(url);
      __appRuntimeContext.showToast("Staff queue URL copied");
    } catch (_) {
      __appRuntimeContext.showToast("Copy failed");
    }
  }

  async function enqueueFinalPrintIfNeeded(imageUrl, printEligible = true) {
    const settings = getPrintSettings();
    if (settings.mode === "off" || !printEligible) return null;
    if (!/^https?:\/\//i.test(String(imageUrl || ""))) {
      if (__appRuntimeContext.DOM.shareStatus) {
        __appRuntimeContext.DOM.shareStatus.textContent = "Print queue waiting for shared upload";
        __appRuntimeContext.DOM.shareStatus.style.display = "inline-flex";
      }
      __appRuntimeContext.showToast("Print queue needs an uploaded image before staff can print.");
      return null;
    }
    try {
      const response = await fetch("/api/print-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: getPrintQueueEventId(),
          imageUrl,
          thumbnailUrl: imageUrl,
          quantity: 1,
          paymentRequired: settings.mode === "paid",
        }),
      });
      let result;
      try {
        result = await response.json();
      } catch (_) {
        throw new Error(`Print queue returned an unreadable response (HTTP ${response.status}).`);
      }
      if (!response.ok || !result.ok) {
        throw new Error(result.error || `Print queue rejected the request (HTTP ${response.status}).`);
      }
      if (__appRuntimeContext.DOM.shareStatus && __appRuntimeContext.DOM.shareStatus.textContent === "Print queue waiting for shared upload") {
        __appRuntimeContext.DOM.shareStatus.style.display = "none";
      }
      return result.item || null;
    } catch (error) {
      console.warn("Print queue enqueue failed", error);
      if (__appRuntimeContext.DOM.shareStatus) {
        __appRuntimeContext.DOM.shareStatus.textContent = error.message || "Print queue failed";
        __appRuntimeContext.DOM.shareStatus.style.display = "inline-flex";
      }
      throw error;
    }
  }

  async function showPayPalPrintCheckout(item) {
    if (!item || !__appRuntimeContext.DOM.paypalPrintCheckout) throw new Error("The print request could not be loaded.");
    if (paidPrintWatchInterval) window.clearInterval(paidPrintWatchInterval);
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: item.eventId, printItemId: item.id }),
    });
    const result = await response.json();
    if (!response.ok || !result.approvalUrl) throw new Error(result.error || "PayPal did not provide a phone checkout link.");
    const checkout = __appRuntimeContext.DOM.paypalPrintCheckout;
    checkout.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = "Scan with your phone to pay";
    const copy = document.createElement("p");
    copy.textContent = "Checkout will open on your personal device, not this booth.";
    const qrTarget = document.createElement("div");
    qrTarget.className = "mobile-print-payment-qr";
    checkout.append(title, copy, qrTarget);
    checkout.classList.remove("hidden");
    const QRCode = await __appRuntimeContext.loadQrCodeLibrary();
    new QRCode(qrTarget, {
      text: result.approvalUrl,
      width: 220,
      height: 220,
      colorDark: "#173f3b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
    if (__appRuntimeContext.DOM.shareStatus) {
      __appRuntimeContext.DOM.shareStatus.textContent = "Scan to pay on your phone, then continue. The booth will be ready for the next guest before checkout finishes.";
      __appRuntimeContext.DOM.shareStatus.style.display = "inline-flex";
    }
    if (__appRuntimeContext.DOM.finishBoothBtn) __appRuntimeContext.DOM.finishBoothBtn.textContent = "Next Guest";
    clearTimeout(__appRuntimeContext.hidePreviewTimer);
    __appRuntimeContext.hidePreviewTimer = window.setTimeout(__appRuntimeContext.finishBoothFlow, 20000);
    paidPrintWatchInterval = window.setInterval(async () => {
      try {
        const queueResponse = await fetch(`/api/print-queue?eventId=${encodeURIComponent(item.eventId || "default")}`, { cache: "no-store" });
        const queue = await queueResponse.json();
        const paidItem = queue.items && queue.items.find((entry) => entry.id === item.id);
        if (paidItem && paidItem.paymentStatus === "paid") {
          window.clearInterval(paidPrintWatchInterval);
          paidPrintWatchInterval = null;
          if (__appRuntimeContext.DOM.shareStatus) __appRuntimeContext.DOM.shareStatus.textContent = "Payment confirmed. Your print is ready with the attendant.";
          if (__appRuntimeContext.DOM.requestPrintBtn) __appRuntimeContext.DOM.requestPrintBtn.textContent = "Payment Complete";
          __appRuntimeContext.playThemeCue("success", "success");
        }
      } catch (error) {
        console.warn("Paid print status check failed", error);
      }
    }, 3000);
  }

  return {
    loadCloudinarySettings,
    saveCloudinarySettings,
    getCloudinaryConfig,
    cloudinaryEnabled,
    cloudinaryConfigured,
    getPrintSettings,
    getPrintQueueEventId,
    getStaffPrintQueueUrl,
    updateStaffPrintQueueUrl,
    loadPrintSettings,
    persistPrintModeSelection,
    syncEventPrintPriceVisibility,
    syncEventPrintPriceInput,
    saveActiveEventPrintPrice,
    loadPayPalPrintConfigStatus,
    savePrintSettings,
    copyStaffPrintQueueUrl,
    enqueueFinalPrintIfNeeded,
    showPayPalPrintCheckout,
  };
}
