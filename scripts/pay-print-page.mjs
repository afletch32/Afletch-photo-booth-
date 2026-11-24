const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId") || "default";
const printItemId = params.get("printItemId") || "";
const orderId = params.get("token") || "";
const status = document.getElementById("payment-status");

function showStatus(message) {
  status.textContent = message;
}

if (params.get("flow") === "cancel") {
  showStatus("Payment was canceled. Your print is still waiting for payment.");
} else if (!eventId || !printItemId || !orderId) {
  showStatus("This payment link is incomplete. Please scan the code at the booth again.");
} else {
  try {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, printItemId, orderId }),
    });
    const result = await response.json();
    if (!response.ok || result.paid !== true) {
      throw new Error(result.error || "PayPal has not confirmed this payment.");
    }
    showStatus("Payment confirmed. Your print is ready with the booth attendant.");
  } catch (error) {
    showStatus(error.message || "Payment could not be confirmed. Please show this page to the booth attendant.");
  }
}
