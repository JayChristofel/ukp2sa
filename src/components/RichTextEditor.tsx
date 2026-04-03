"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "./ui";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  children,
  disabled = false,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className={`size-9 rounded-xl transition-all ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary"
        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {children}
  </Button>
);

const VerticalDivider = () => (
  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
);

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Mulai menulis artikel...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary hover:underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg my-6 max-w-full",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isImageMenuOpen, setIsImageMenuOpen] = React.useState(false);
  const imageMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        imageMenuRef.current &&
        !imageMenuRef.current.contains(event.target as Node)
      ) {
        setIsImageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImageUrl = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageMenuOpen(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadFormData = new FormData();
      files.forEach((file) => uploadFormData.append("files", file));
      uploadFormData.append("folder", "cms-content"); // Pisahin folder biar rapi

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) throw new Error("Gagal upload gambar ke CMS!");
      const data = await res.json();

      // Insert semua gambar yang di-upload ke editor
      if (data.urls && data.urls.length > 0) {
        let chain = editor.chain().focus();
        data.urls.forEach((url: string) => {
          chain = chain.setImage({ src: url });
        });
        chain.run();
      }
    } catch (err) {
      alert("Gagal memasukkan gambar ke editor.");
      console.error(err);
    } finally {
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsImageMenuOpen(false);
    }
  };

  return (
    <div className="w-full border-none bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] overflow-hidden group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
      {/* Toolbar */}
      <div className="p-2 border-b border-white dark:border-slate-800 flex flex-wrap items-center gap-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
        </div>

        <VerticalDivider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
          >
            <Heading1 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
          >
            <Heading3 size={18} />
          </ToolbarButton>
        </div>

        <VerticalDivider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          >
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
          >
            <Quote size={18} />
          </ToolbarButton>
        </div>

        <VerticalDivider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
          >
            <AlignCenter size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
          >
            <AlignRight size={18} />
          </ToolbarButton>
        </div>

        <VerticalDivider />

        <div className="flex items-center gap-1 relative" ref={imageMenuRef}>
          <ToolbarButton onClick={addLink} isActive={editor.isActive("link")}>
            <LinkIcon size={18} />
          </ToolbarButton>

          <div className="relative">
            <ToolbarButton
              onClick={() => setIsImageMenuOpen(!isImageMenuOpen)}
              isActive={isImageMenuOpen || editor.isActive("image")}
            >
              <ImageIcon size={18} />
            </ToolbarButton>

            <AnimatePresence>
              {isImageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 min-w-[200px] flex flex-col gap-1"
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-left text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <ImageIcon size={14} className="text-primary" /> Unggah
                    Gambar
                  </button>
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-left text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <LinkIcon size={14} className="text-primary" /> Lewat URL
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={18} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-8 min-h-[400px] cursor-text bg-white dark:bg-slate-900/20">
        <EditorContent editor={editor} />
      </div>

      <div className="px-8 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {editor.storage.characterCount?.words?.() || 0} Words
        </span>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">
          Rich Text Mode
        </span>
      </div>
    </div>
  );
}
