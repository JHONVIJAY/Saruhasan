import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Youtube, 
  Loader2, 
  Play, 
  Music,
  Film,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { cn } from "../lib/utils";

// Using Cobalt API - a free, open-source video downloading service
const COBALT_API = "https://api.cobalt.tools";

const formatOptions = [
  { value: "720", label: "720p Video", icon: Film },
  { value: "480", label: "480p Video", icon: Film },
  { value: "360", label: "360p Video", icon: Film },
  { value: "audio", label: "Audio Only", icon: Music },
];

export function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("720");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const response = await fetch(`${COBALT_API}/`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          downloadMode: selectedFormat === "audio" ? "audio" : "auto",
          videoQuality: selectedFormat === "audio" ? "1080" : selectedFormat,
          audioFormat: "mp3",
          filenameStyle: "pretty",
        }),
      });

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.error?.code || "Download failed. Try a different video.");
      }

      if (data.status === "redirect" || data.status === "tunnel") {
        setDownloadUrl(data.url);
        // Open download in new tab
        window.open(data.url, "_blank");
      } else if (data.status === "picker") {
        // Multiple options available, use first one
        if (data.picker && data.picker.length > 0) {
          setDownloadUrl(data.picker[0].url);
          window.open(data.picker[0].url, "_blank");
        }
      } else {
        throw new Error("Unexpected response. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setError(null);
    setDownloadUrl(null);
    inputRef.current?.focus();
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
            <Youtube className="w-5 h-5 text-red-500" />
            <span className="font-mono text-xs uppercase tracking-widest text-red-400">
              Video Downloader
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">YouTube</span> Videos
          </h1>
          
          <p className="text-white/50 max-w-xl mx-auto">
            Paste any YouTube URL and download videos or audio instantly.
            Fast, free, and no registration required.
          </p>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              placeholder="Paste YouTube URL here..."
              className={cn(
                "w-full px-6 py-5 bg-white/5 border rounded-2xl text-lg",
                "placeholder:text-white/30 focus:outline-none transition-all duration-300",
                error 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-white/30 group-hover:border-white/20"
              )}
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Format Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="block text-sm font-mono uppercase tracking-widest text-white/40 mb-4 text-center">
            Select Format
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFormat(option.value)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-4 rounded-xl border transition-all duration-300",
                  selectedFormat === option.value
                    ? "bg-gradient-to-r from-red-500/20 to-purple-500/20 border-red-500/50 text-white"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/10"
                )}
              >
                <option.icon className="w-5 h-5" />
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleDownload}
            disabled={loading || !url.trim()}
            className={cn(
              "w-full py-5 rounded-2xl font-bold uppercase tracking-wider text-lg",
              "bg-gradient-to-r from-red-600 via-purple-600 to-red-600",
              "hover:from-red-500 hover:via-purple-500 hover:to-red-500",
              "transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-3",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            style={{ backgroundSize: "200% 100%" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Now
              </>
            )}
          </button>
        </motion.div>

        {/* Download Success */}
        <AnimatePresence>
          {downloadUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-green-400 font-semibold">Download Ready!</span>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Your download should have started. If not, click the button below:
              </p>
              <div className="flex gap-3">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Download
                </a>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  New Download
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !downloadUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/30">
              Enter a YouTube URL above to start downloading
            </p>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/20 text-xs mt-12 max-w-md mx-auto"
        >
          This tool is for personal use only. Please respect copyright laws
          and YouTube's Terms of Service. Powered by Cobalt.
        </motion.p>
      </div>
    </section>
  );
}
