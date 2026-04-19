import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

/** POST /api/payment/create — Create Midtrans payment transaction (protected) */
const postHandler = async (request: Request, { body, session }: any) => {
  try {
    const supabase = await createClient();
    const { amount, budgetCode, programName, partnerName, disbursementStage, source } = body;

    // SECURITY: Paksa instansiId dari session, jangan percaya body (Anti-Impersonation)
    const instansiId = session.user.role === 'admin' ? (body.partnerId || "INTERNAL") : session.user.instansiId;

    if (!instansiId && session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Identitas instansi tidak ditemukan." }, { status: 403 });
    }

    const order_id = `ORDER-${Math.floor(Math.random() * 1000000)}-${Date.now()}`;

    // Save to Supabase as a draft record first
    const { error: dbError } = await supabase
      .from('financial_records')
      .insert([
        {
          instansi_id: instansiId,
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

    // Build Midtrans transaction details
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
        first_name: partnerName || session.user.name,
        email: session.user.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Audit log
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "INIT_PAYMENT",
      module: "FINANCIAL",
      details: `Inisialisasi pembayaran Rp${amount.toLocaleString()} untuk program ${programName}`,
      meta: { orderId: order_id, instansiId }
    });

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Payment API Error:", error.message);
    return NextResponse.json({ success: false, error: "Gagal memproses inisialisasi pembayaran." }, { status: 500 });
  }
};

export const POST = secureRoute(postHandler, { roles: ['admin', 'partner'], limit: 10 });
