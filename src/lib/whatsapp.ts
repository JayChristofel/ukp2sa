/**
 * WhatsApp Integration Utility for UKP2SA
 * Using WhatsApp Webhook / API provider (Placeholders for now)
 */

export async function sendWhatsApp(to: string, message: string) {
  try {
    // Check for API presence
    if (!process.env.WA_API_URL || !process.env.WA_TOKEN) {
      console.warn("[WA MOCK] Missing credentials, printing message to console:");
      console.log(`[WA TO: ${to}] ${message}`);
      return { success: true, mock: true };
    }

    const res = await fetch(`${process.env.WA_API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WA_TOKEN}`,
      },
      body: JSON.stringify({
        phone: to,
        message: message,
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("WhatsApp Send Failed", error);
    return { success: false, error };
  }
}
