import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@/lib/server";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const notificationJson = await request.json();
    
    // 1. Log the notification for auditing
    console.log("Midtrans Webhook Received:", notificationJson.order_id);

    // 2. Wrap Midtrans callback to get transaction status
    const statusResponse = await snap.transaction.notification(notificationJson);
    
    const dbOrderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // 3. Logic to update database based on payment status in Supabase
    const updateData: any = {
      payment_status: transactionStatus,
      last_update: new Date().toISOString(),
    };

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        updateData.status = "Final";
        updateData.payment_status = "settlement";
      }
    } else if (transactionStatus === "settlement") {
      updateData.status = "Final";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      updateData.payment_status = "failed";
    }

    // 4. Update the record in Supabase
    const { data: updatedRecord, error: updateError } = await supabase
      .from('financial_records')
      .update(updateData)
      .eq('order_id', dbOrderId)
      .select()
      .single();

    if (updateError || !updatedRecord) {
      console.warn(`Webhook Error: Record with orderId ${dbOrderId} not found.`);
    } else {
      console.log(`Updated record ${dbOrderId} to status ${updateData.status || transactionStatus}`);
    }

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("Webhook Internal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
