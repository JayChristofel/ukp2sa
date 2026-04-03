import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@/lib/server";

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { amount, budgetCode, programName, partnerName, partnerId, disbursementStage, source } = body;

    const order_id = `ORDER-${Math.floor(Math.random() * 1000000)}-${Date.now()}`;

    // 1. Save to our database as a draft record first in Supabase
    const { error: dbError } = await supabase
      .from('financial_records')
      .insert([
        {
          instansi_id: partnerId || "INTERNAL",
          program_name: programName,
          allocation: amount,
          realization: 0,
          percentage: 0,
          source: source || "APBN",
          disbursement_stage: disbursementStage || "Planning",
          status: "Draft",
          order_id: order_id,
          payment_status: "pending",
          last_update: new Date().toISOString(),
          history: [
            {
              stage: disbursementStage || "Planning",
              amount: 0,
              date: new Date().toISOString(),
              note: "Payment initialization via Midtrans",
            },
          ],
        }
      ]);

    if (dbError) throw dbError;

    // 2. Build Midtrans transaction details
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: amount,
      },
      item_details: [
        {
          id: budgetCode,
          price: amount,
          quantity: 1,
          name: programName.substring(0, 50),
        },
      ],
      customer_details: {
        first_name: partnerName,
        email: "finance@ukp2sa.id",
      },
    };

    const transaction = await snap.createTransaction(parameter);
    console.log("Midtrans Transaction Created:", transaction.token);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Payment API Error Detail:");
    console.error("- Message:", error.message);
    
    // Check for specific Midtrans errors
    if (error.ApiResponse) {
      console.error("- Midtrans Response:", error.ApiResponse);
    }

    return NextResponse.json(
      { 
        error: error.message,
        details: error.ApiResponse || null 
      }, 
      { status: 500 }
    );
  }
}
