"use client";

import React from "react";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Tag,
  Type,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { PublicUpdate } from "@/lib/types";
import RichTextEditor from "@/components/RichTextEditor";
import { blogPostSchema } from "@/lib/validations";

export default function BlogEditorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          Memuat Editor...
        </div>
      }
    >
      <BlogEditorContent />
    </React.Suspense>
  );
}

function BlogEditorContent() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") as string;
  const isEdit = !!id;

  const [formData, setFormData] = React.useState<Partial<PublicUpdate>>({
    title: "",
    summary: "",
    content: "",
    category: "Berita",
    author: "Admin UKP2SA",
    image: "",
    tags: [],
    publishDate: new Date().toISOString(),
  });

  const existingArticle: any = []; // auto-cleaned

  React.useEffect(() => {
    if (existingArticle && isEdit) {
      setFormData(existingArticle);
    }
  }, [existingArticle, isEdit]);

  const addMutation: any = { mutate: () => {}, mutateAsync: async () => {}, isPending: false, isLoading: false, data: [] }; // auto-cleaned
  const updateMutation: any = { mutate: () => {}, mutateAsync: async () => {}, isPending: false, isLoading: false, data: [] }; // auto-cleaned

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = blogPostSchema.safeParse({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      status: "Published",
    });

    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }

    const onSuccessCb = () => {
      router.push(`/${lang}/admin/blog`);
    };

    if (isEdit) {
      updateMutation.mutate({ id, data: formData }, { onSuccess: onSuccessCb });
    } else {
      addMutation.mutate(formData as PublicUpdate, { onSuccess: onSuccessCb });
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-8xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Status:
          </span>
          <Badge className="bg-emerald-50 text-emerald-500 border-emerald-100 rounded-lg font-black uppercase text-[8px] tracking-widest px-2 py-0.5">
            Draft
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-navy tracking-tighter uppercase leading-none">
            {isEdit ? "Edit" : "Buat"}{" "}
            <span className="text-primary italic">Artikel.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-widest">
            {isEdit
              ? "Perbarui konten berita Anda"
              : "Tulis berita pemulihan terbaru untuk publik"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Type size={14} className="text-primary" /> Judul Artikel
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul yang menarik..."
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-lg font-black text-navy placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-primary" /> Deskripsi
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Berikan deskripsi singkat isi artikel (akan muncul di feed)..."
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Type size={14} className="text-primary" /> Isi Artikel
                </label>
                <RichTextEditor
                  content={formData.content || ""}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} className="text-primary" /> Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
                {formData.image && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden shadow-inner bg-slate-100 relative">
                    <Image
                      fill
                      src={formData.image}
                      alt="Preview"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  Kategori
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {["Berita", "Pengumuman", "Literasi"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          category: cat as PublicUpdate["category"],
                        })
                      }
                      className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${
                        formData.category === cat
                          ? "bg-navy text-white shadow-lg"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} className="text-primary" /> Tags
                </label>
                <input
                  type="text"
                  placeholder="Aceh, Infrastruktur, Progres (Pisahkan dengan koma)"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                />
              </div>
            </Card>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-600 text-white rounded-[1.5rem] py-8 flex gap-2 font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Save size={20} />{" "}
              {isPending
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Terbitkan Artikel"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
