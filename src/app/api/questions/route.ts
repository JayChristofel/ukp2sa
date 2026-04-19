import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

export const GET = secureRoute(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ success: false, error: "topicId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, topic_id, parent_id, question_id, question_en, question_type, options, required')
      .eq('topic_id', Number(topicId))
      .order('id', { ascending: true });
    
    if (error) throw error;

    const formattedQuestions = questions?.map(q => ({
      id: q.id,
      topicId: q.topic_id,
      parentId: q.parent_id,
      question: {
        id: q.question_id,
        en: q.question_en
      },
      questionType: q.question_type,
      options: q.options,
      required: q.required
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuestions
    });
  } catch (error: any) {
    console.error("Questions API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data kuisioner aduan." }, { status: 500 });
  }
}, { isPublic: true, limit: 50 });
