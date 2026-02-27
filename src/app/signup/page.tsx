"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({
        text: "สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัคร หรือเข้าสู่ระบบได้เลย 🎉",
        type: "success",
      });
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 bg-mesh p-4">
      <div className="absolute top-4 right-4 animate-fade-in-down">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white/70 dark:bg-zinc-900/80 rounded-3xl shadow-xl p-8 sm:p-10 border border-white/50 dark:border-zinc-800 backdrop-blur-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 dark:text-red-500 mb-2 gradient-text uppercase tracking-tight italic drop-shadow-sm">
            สมัครสมาชิก
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-3 bg-gray-100 dark:bg-zinc-800 inline-block px-3 py-1 rounded-lg">
            สร้างบัญชีเพื่อเริ่มวางแผนการฝึกของคุณ
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-2xl text-sm font-bold shadow-sm border ${message.type === "error" ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30" : "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30"}`}
          >
            {message.type === "error" ? "⚠️ " : "🎉 "}{message.text}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSignUp}>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 focus:border-blue-500 dark:focus:border-red-500 outline-none transition-all shadow-sm bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 font-medium"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 focus:border-blue-500 dark:focus:border-red-500 outline-none transition-all shadow-sm bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 font-medium font-mono"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 focus:border-blue-500 dark:focus:border-red-500 outline-none transition-all shadow-sm bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 font-medium font-mono"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-md dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] disabled:opacity-50 mt-8 uppercase tracking-widest text-sm"
          >
            {loading ? "กำลังลงทะเบียน..." : "สมัครสมาชิก"}
          </button>

          <div className="mt-8 text-center text-sm font-bold text-gray-600 dark:text-zinc-400">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-red-500 hover:text-blue-800 dark:hover:text-red-400 transition-colors ml-1 border-b-2 border-transparent hover:border-current pb-0.5"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
