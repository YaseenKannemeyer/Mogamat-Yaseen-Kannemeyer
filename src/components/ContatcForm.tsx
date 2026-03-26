"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "../lib/utils";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Code,
  Minus,
} from "lucide-react";
import { IconMail, IconSend } from "@tabler/icons-react";

// ── Toolbar ──────────────────────────────────────────────────────────────────

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "rounded p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700",
      active
        ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
        : "text-neutral-600 dark:text-neutral-400",
    )}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />
);

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-neutral-200 bg-transparent px-2 py-1.5 dark:border-neutral-700">
      {" "}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline Code"
      >
        <Code size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        active={false}
        title="Horizontal Rule"
      >
        <Minus size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={setLink}
        active={editor.isActive("link")}
        title="Link"
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        active={false}
        title="Undo"
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        active={false}
        title="Redo"
      >
        <Redo size={15} />
      </ToolbarButton>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const htmlToPlainText = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// ── Main Component ────────────────────────────────────────────────────────────

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [sent, setSent] = useState<"idle" | "sending" | "error" | "done">(
    "idle",
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your message…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[140px] px-3 py-2.5 focus:outline-none",
      },
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const messageHtml = editor.getHTML();
    const messagePlain = htmlToPlainText(messageHtml);

    setSent("sending");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          messageHtml,
          messagePlain,
        }),
      });

      if (!res.ok) throw new Error("Send failed");

      setSent("done");
      setTimeout(() => {
        setSent("idle");
        setName("");
        setEmail("");
        setSubject("");
        editor.commands.clearContent();
      }, 3000);
    } catch {
      setSent("error");
      setTimeout(() => setSent("idle"), 3000);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-lg rounded-none p-4 md:rounded-2xl md:p-8">
      {" "}
      {/* Header */}
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Get in touch
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
        Fill out the form below and your message will be sent straight to my
        inbox.
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSend}>
        {/* Name row */}
        <div className="flex flex-col gap-4 md:flex-row">
          <LabelInputContainer>
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="replyEmail">Your email</Label>
            <Input
              id="replyEmail"
              placeholder="jane@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
        </div>

        {/* Subject */}
        <LabelInputContainer>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="What's this about?"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </LabelInputContainer>

        {/* Rich-text editor */}
        <LabelInputContainer>
          <Label>Message</Label>
          <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} className="bg-transparent" />
          </div>
        </LabelInputContainer>

        {/* Submit */}
        <button
          type="submit"
          disabled={sent === "sending" || sent === "done"}
          className={cn(
            "group/btn relative flex h-11 w-full items-center justify-center gap-2 rounded-md font-medium text-black transition-all",
            sent === "done"
              ? "bg-green-600"
              : sent === "error"
                ? "bg-red-600"
                : "bg-linear-to-br from-black to-neutral-600 dark:from-zinc-800 dark:to-zinc-900",
            "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
          )}
        >
          {sent === "done" ? (
            <>✓ Sent!</>
          ) : sent === "error" ? (
            <>✗ Something went wrong</>
          ) : sent === "sending" ? (
            <>Sending…</>
          ) : (
            <>
              <IconSend size={16} />
              Send message
            </>
          )}
          <BottomGradient />
        </button>

        {/* Divider */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* Send-to indicator */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <IconMail size={16} className="text-blue-500" />
          <span>Delivered via Resend</span>
        </div>
      </form>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1.5", className)}>
    {children}
  </div>
);
