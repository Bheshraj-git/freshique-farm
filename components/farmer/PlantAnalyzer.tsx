"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf,
    Upload,
    Loader2,
    AlertTriangle,
    Heart,
    ClipboardList,
    FileSearch,
    Lightbulb,
    ShieldCheck,
    X,
    Globe,
    Sparkles,
    Stethoscope,
    TrendingUp,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface AnalysisResult {
    plantType: string;
    disease: string;
    confidence: number;
    summary: string;
    symptoms: string[];
    causes: string[];
    severity: "low" | "medium" | "high" | "critical";
    suggestions: string[];
    prevention: string[];
    healthy: boolean;
}

type TabKey = "summary" | "details" | "advice";
type Lang = "en" | "gu";

const MAX_FILE_SIZE_MB = 5;
const SESSION_KEY = "freshique_plant_analyzer";

/* ─── Helpers ─── */
function getConfidenceMeta(confidence: number) {
    if (confidence >= 80)
        return { color: "bg-brand-500", label: "High Confidence" };
    if (confidence >= 50)
        return { color: "bg-accent-500", label: "Medium Confidence" };
    return { color: "bg-danger-600", label: "Low Confidence" };
}

function getSeverityMeta(severity: string) {
    const map: Record<string, { color: string; label: string }> = {
        low: { color: "bg-brand-500 text-white", label: "Low" },
        medium: { color: "bg-accent-500 text-white", label: "Medium" },
        high: { color: "bg-danger-600 text-white", label: "High" },
        critical: { color: "bg-danger-600 text-white", label: "Critical" },
    };
    return map[severity?.toLowerCase()] ?? { color: "bg-ink-300 text-ink-700", label: "N/A" };
}

async function translateText(text: string): Promise<string> {
    if (!text) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data?.[0]?.map((s: [string]) => s[0]).join("") ?? text;
    } catch {
        return text;
    }
}

async function translateArray(items: string[]): Promise<string[]> {
    if (!items?.length) return [];
    const joined = items.join(" ||| ");
    const translated = await translateText(joined);
    return translated.split("|||").map((s: string) => s.trim());
}

/* ─── Component ─── */
export default function PlantAnalyzer() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageB64, setImageB64] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [translated, setTranslated] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("summary");
    const [lang, setLang] = useState<Lang>("en");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hydrate from sessionStorage
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                const { imageB64: b64, result: r, tab, lang: l, translated: tr } = JSON.parse(saved);
                if (b64) {
                    setImageB64(b64);
                    setPreviewUrl(`data:image/jpeg;base64,${b64}`);
                }
                if (r) setResult(r);
                if (tr) setTranslated(tr);
                if (tab) setActiveTab(tab);
                if (l) setLang(l);
            }
        } catch {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }, []);

    // Persist to sessionStorage
    useEffect(() => {
        try {
            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify({ imageB64, result, tab: activeTab, lang, translated })
            );
        } catch { /* quota exceeded, ignore */ }
    }, [imageB64, result, activeTab, lang, translated]);

    // Revoke object URLs on cleanup
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /* ── Image handlers ── */
    const handleImageSelect = useCallback((file: File) => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Image size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            setImageB64(base64);
            setPreviewUrl(URL.createObjectURL(file));
            setImageFile(file);
            setResult(null);
            setTranslated(null);
            setLang("en");
            setError(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleImageSelect(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f?.type.startsWith("image/")) handleImageSelect(f);
        else setError("Please drop a valid image file.");
    };

    /* ── Analysis ── */
    const startAnalysis = async () => {
        if (!imageFile || !imageB64) return;
        setAnalyzing(true);
        setError(null);
        try {
            const res = await fetch("/api/analyze-plant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64: imageB64,
                    mimeType: imageFile.type,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed.");
            setResult(data);
            setTranslated(null);
            setLang("en");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed.");
        } finally {
            setAnalyzing(false);
        }
    };

    /* ── Translation ── */
    const translateToGujarati = async (r: AnalysisResult) => {
        setTranslating(true);
        try {
            const [summary, disease, plantType, symptoms, causes, suggestions, prevention] =
                await Promise.all([
                    translateText(r.summary),
                    translateText(r.disease),
                    translateText(r.plantType),
                    translateArray(r.symptoms),
                    translateArray(r.causes),
                    translateArray(r.suggestions),
                    translateArray(r.prevention),
                ]);
            setTranslated({
                ...r,
                plantType,
                disease,
                summary,
                symptoms,
                causes,
                suggestions,
                prevention,
            });
            setLang("gu");
        } catch {
            setError("Translation failed. Showing English results.");
            setLang("en");
        } finally {
            setTranslating(false);
        }
    };

    /* ── Clear ── */
    const clearAll = () => {
        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setImageB64(null);
        setImageFile(null);
        setResult(null);
        setTranslated(null);
        setError(null);
        setActiveTab("summary");
        setLang("en");
        sessionStorage.removeItem(SESSION_KEY);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const display = lang === "gu" && translated ? translated : result;
    const hasResult = !!display;

    const tabs: { key: TabKey; icon: typeof ClipboardList; label: string }[] = [
        { key: "summary", icon: FileSearch, label: lang === "en" ? "Summary" : "સારાંશ" },
        { key: "details", icon: Stethoscope, label: lang === "en" ? "Symptoms & Causes" : "લક્ષણો અને કારણો" },
        { key: "advice", icon: Lightbulb, label: lang === "en" ? "Suggestions & Prevention" : "સૂચનો અને નિવારણ" },
    ];

    const confidenceMeta = hasResult ? getConfidenceMeta(display!.confidence) : null;
    const severityMeta = hasResult ? getSeverityMeta(display!.severity) : null;

    return (
        <div className="space-y-6">
            {/* ─── Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-ink-900 flex items-center gap-2">
                        <div className="grid place-items-center h-10 w-10 rounded-xl bg-brand-100 text-brand-700">
                            <Leaf className="h-5 w-5" />
                        </div>
                        AI Plant Doctor
                    </h1>
                    <p className="text-sm text-ink-500 mt-1 max-w-lg">
                        Upload a clear image of your plant's leaf or crop for expert AI
                        analysis and practical advice in seconds.
                    </p>
                </div>

                {/* Language toggle */}
                {hasResult && (
                    <div className="flex items-center gap-1 p-1 bg-brand-100 rounded-xl">
                        {(
                            [
                                { key: "en" as Lang, label: "English" },
                                { key: "gu" as Lang, label: "ગુજરાતી" },
                            ] as const
                        ).map((l) => (
                            <button
                                key={l.key}
                                disabled={translating || (l.key === "gu" && !result)}
                                onClick={() => {
                                    if (l.key === "gu" && lang === "en" && result)
                                        translateToGujarati(result);
                                    else if (l.key === "en") setLang("en");
                                }}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    lang === l.key
                                        ? "bg-white text-brand-700 shadow-sm"
                                        : "text-brand-600 hover:text-brand-800",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <Globe className="h-3 w-3" />
                                {l.label}
                                {translating && l.key === "gu" && (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Main Card ─── */}
            <div className="bg-white rounded-2xl shadow-card border border-brand-100/50 overflow-hidden">
                <div className="p-5 sm:p-8 space-y-8">
                    {/* ── Upload Section ── */}
                    <section>
                        <h2 className="text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-brand-600" />
                            {previewUrl ? "Review Image" : "Upload Plant Photo"}
                        </h2>

                        <div
                            className={cn(
                                "relative w-full h-56 sm:h-72 border-2 rounded-2xl overflow-hidden transition-all group",
                                previewUrl
                                    ? "border-brand-400 bg-white"
                                    : "border-dashed border-brand-300 bg-brand-50 hover:bg-brand-100/60 cursor-pointer"
                            )}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Selected plant for analysis"
                                    className="w-full h-full object-contain p-3"
                                />
                            ) : (
                                <label
                                    htmlFor="plant-image-upload"
                                    className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                                >
                                    <div className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-100 text-brand-600 mb-3">
                                        <Upload className="h-8 w-8" />
                                    </div>
                                    <p className="text-sm font-bold text-ink-700">
                                        Tap or Drag Photo Here
                                    </p>
                                    <p className="text-xs text-ink-500 mt-1">
                                        Best results from clear, close-up images. (Max {MAX_FILE_SIZE_MB}MB)
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        id="plant-image-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={analyzing}
                                    />
                                </label>
                            )}

                            {/* Analyzing overlay */}
                            <AnimatePresence>
                                {analyzing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 backdrop-blur-sm"
                                    >
                                        <div className="text-center">
                                            <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto mb-2" />
                                            <p className="text-brand-700 font-bold text-sm">
                                                Analyzing your plant…
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action buttons */}
                        {previewUrl && (
                            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                                <button
                                    onClick={startAnalysis}
                                    disabled={analyzing || hasResult}
                                    className={cn(
                                        "flex-1 max-w-sm mx-auto flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-float text-sm",
                                        hasResult
                                            ? "bg-brand-200 text-brand-700 cursor-default"
                                            : "bg-brand-600 hover:bg-brand-700 text-white disabled:bg-brand-300"
                                    )}
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {hasResult ? "Analysis Complete" : analyzing ? "Analyzing…" : "Start AI Analysis"}
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="flex items-center justify-center gap-1.5 px-5 py-3 bg-danger-600/10 hover:bg-danger-600/20 text-danger-600 font-bold rounded-xl transition-all text-sm"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Clear
                                </button>
                            </div>
                        )}

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mt-4 p-4 bg-danger-600/5 border border-danger-600/20 rounded-xl flex items-start gap-2 text-sm text-danger-600"
                                >
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Error</p>
                                        <p>{error}</p>
                                    </div>
                                    <button onClick={() => setError(null)} className="ml-auto shrink-0">
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* ── Results Section ── */}
                    <section className="border-t border-brand-100 pt-6 space-y-5">
                        <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-brand-600" />
                            {lang === "en" ? "Analysis Results" : "વિશ્લેષણ પરિણામો"}
                        </h2>

                        {hasResult && display ? (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-5"
                            >
                                {/* Status banner */}
                                <div
                                    className={cn(
                                        "p-5 rounded-2xl border-l-4 shadow-soft",
                                        display.healthy
                                            ? "border-brand-500 bg-brand-50/60"
                                            : "border-danger-600 bg-danger-600/5"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <h3 className="text-lg font-extrabold text-ink-900 flex items-center gap-2">
                                            {display.healthy ? (
                                                <Heart className="h-5 w-5 text-brand-500" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-danger-600" />
                                            )}
                                            {display.disease || (lang === "en" ? "Healthy Plant" : "તંદુરસ્ત છોડ")}
                                        </h3>
                                        {confidenceMeta && (
                                            <span
                                                className={cn(
                                                    "px-3 py-1 text-[10px] font-bold rounded-full text-white shadow-sm",
                                                    confidenceMeta.color
                                                )}
                                            >
                                                {confidenceMeta.label}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-ink-500 mb-3">
                                        <span className="font-bold">
                                            {lang === "en" ? "Plant Type:" : "છોડનો પ્રકાર:"}
                                        </span>{" "}
                                        {display.plantType || (lang === "en" ? "Unspecified" : "અનિશ્ચિત")}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs">
                                        <span className="font-bold text-ink-700 flex items-center gap-1">
                                            {lang === "en" ? "Confidence:" : "વિશ્વાસ:"}
                                            {confidenceMeta && (
                                                <span
                                                    className={cn(
                                                        "ml-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold",
                                                        confidenceMeta.color
                                                    )}
                                                >
                                                    {display.confidence}%
                                                </span>
                                            )}
                                        </span>
                                        <span className="font-bold text-ink-700 flex items-center gap-1">
                                            {lang === "en" ? "Severity:" : "ગંભીરતા:"}
                                            {severityMeta && (
                                                <span
                                                    className={cn(
                                                        "ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                                        severityMeta.color
                                                    )}
                                                >
                                                    {severityMeta.label}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Confidence bar */}
                                    <div className="w-full bg-ink-300/30 rounded-full h-1.5 mt-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${display.confidence}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={cn("h-1.5 rounded-full", confidenceMeta?.color)}
                                        />
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="bg-brand-50/50 rounded-xl p-1 border border-brand-100/50">
                                    <nav className="flex overflow-x-auto gap-1">
                                        {tabs.map((t) => {
                                            const Icon = t.icon;
                                            return (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setActiveTab(t.key)}
                                                    className={cn(
                                                        "shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all",
                                                        activeTab === t.key
                                                            ? "bg-brand-600 text-white shadow-sm"
                                                            : "text-ink-500 hover:bg-brand-100"
                                                    )}
                                                >
                                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                                    {t.label}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {/* Tab content */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === "summary" && (
                                            <div className="p-5 bg-white rounded-xl shadow-soft border border-brand-100/40">
                                                <h4 className="font-bold text-sm mb-2 text-ink-900 flex items-center gap-1.5">
                                                    <FileSearch className="h-4 w-4 text-brand-600" />
                                                    {lang === "en" ? "Overview" : "ઝાંખી"}
                                                </h4>
                                                <p className="text-sm text-ink-700 leading-relaxed">
                                                    {display.summary}
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === "details" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200/60 shadow-soft">
                                                    <h4 className="font-bold text-sm mb-3 text-blue-800 flex items-center gap-1.5">
                                                        <Stethoscope className="h-4 w-4" />
                                                        {lang === "en" ? "Symptoms" : "લક્ષણો"}
                                                    </h4>
                                                    <ul className="space-y-2 text-ink-700 list-disc list-inside ml-2 text-sm">
                                                        {display.symptoms?.length > 0
                                                            ? display.symptoms.map((s, i) => <li key={i}>{s}</li>)
                                                            : (
                                                                <li className="text-ink-500">
                                                                    {lang === "en"
                                                                        ? "No specific symptoms listed."
                                                                        : "કોઈ ચોક્કસ લક્ષણો સૂચિબદ્ધ નથી."}
                                                                </li>
                                                            )}
                                                    </ul>
                                                </div>
                                                <div className="p-5 bg-amber-50 rounded-xl border border-amber-200/60 shadow-soft">
                                                    <h4 className="font-bold text-sm mb-3 text-amber-800 flex items-center gap-1.5">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        {lang === "en" ? "Causes" : "કારણો"}
                                                    </h4>
                                                    <ul className="space-y-2 text-ink-700 list-disc list-inside ml-2 text-sm">
                                                        {display.causes?.length > 0
                                                            ? display.causes.map((c, i) => <li key={i}>{c}</li>)
                                                            : (
                                                                <li className="text-ink-500">
                                                                    {lang === "en"
                                                                        ? "No specific causes listed."
                                                                        : "કોઈ ચોક્કસ કારણો સૂચિબદ્ધ નથી."}
                                                                </li>
                                                            )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "advice" && (
                                            <div className="space-y-4">
                                                <div className="p-5 bg-brand-50/60 rounded-xl border border-brand-200/60 shadow-soft">
                                                    <h4 className="font-bold text-sm mb-3 text-brand-800 flex items-center gap-1.5">
                                                        <Lightbulb className="h-4 w-4" />
                                                        {lang === "en" ? "Treatment Suggestions" : "સારવાર સૂચનો"}
                                                    </h4>
                                                    <ol className="space-y-2 text-ink-700 list-decimal list-inside ml-2 text-sm">
                                                        {display.suggestions?.length > 0
                                                            ? display.suggestions.map((s, i) => (
                                                                <li key={i} className="font-medium">
                                                                    {s}
                                                                </li>
                                                            ))
                                                            : (
                                                                <li className="text-ink-500">
                                                                    {lang === "en"
                                                                        ? "No specific suggestions provided."
                                                                        : "કોઈ ચોક્કસ સૂચનો પ્રદાન કરવામાં આવ્યા નથી."}
                                                                </li>
                                                            )}
                                                    </ol>
                                                </div>
                                                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200/60 shadow-soft">
                                                    <h4 className="font-bold text-sm mb-3 text-indigo-800 flex items-center gap-1.5">
                                                        <ShieldCheck className="h-4 w-4" />
                                                        {lang === "en" ? "Prevention Tips" : "નિવારણ ટિપ્સ"}
                                                    </h4>
                                                    <ul className="space-y-2 text-ink-700 list-disc list-inside ml-2 text-sm">
                                                        {display.prevention?.length > 0
                                                            ? display.prevention.map((p, i) => <li key={i}>{p}</li>)
                                                            : (
                                                                <li className="text-ink-500">
                                                                    {lang === "en"
                                                                        ? "No specific prevention tips listed."
                                                                        : "કોઈ ચોક્કસ નિવારણ ટિપ્સ સૂચિબદ્ધ નથી."}
                                                                </li>
                                                            )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            /* Empty state */
                            <div className="p-10 flex flex-col items-center justify-center text-ink-300 rounded-2xl bg-brand-50/40 border border-dashed border-brand-200">
                                <Leaf className="h-14 w-14 mx-auto mb-4 text-brand-200" />
                                <p className="text-base font-bold text-ink-500">
                                    Your results will appear here.
                                </p>
                                <p className="text-sm mt-1 text-ink-500">
                                    Upload an image and press &apos;Start AI Analysis&apos;.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer disclaimer */}
                <div className="px-5 py-3 bg-brand-50/50 border-t border-brand-100/40 text-center text-xs text-ink-500">
                    <strong>Disclaimer:</strong> This tool provides AI-driven preliminary
                    analysis. Always consult a local agricultural expert for critical
                    decisions.
                </div>
            </div>
        </div>
    );
}
