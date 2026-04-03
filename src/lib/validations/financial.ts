import { z } from "zod";
import { FundingSourceType } from "../types";

export const budgetPaymentSchema = z.object({
  programName: z.string().min(5, "Nama program minimal 5 karakter"),
  budgetCode: z.string().min(3, "Kode anggaran wajib diisi"),
  allocation: z.number().min(10000, "Alokasi minimal Rp 10.000"),
  source: z.nativeEnum(FundingSourceType),
  disbursementStage: z.enum(["Planning", "Approval", "Treasury", "Transfer", "Completed"]),
  notes: z.string().optional(),
});

export type BudgetPaymentFormData = z.infer<typeof budgetPaymentSchema>;
