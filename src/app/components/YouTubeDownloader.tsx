import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Youtube, 
  Loader2, 
  Play, 
  User,
  Music,
  Film,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { cn } from "../lib/utils";

interface VideoInfo {
  id: string;
  title: string;
  uploader: string;
  uploaderUrl: string;
  thumbnail: string;
  thumbnailHQ: string;
}

// Your Render backend URL
const API_BASE = "https://portfolio-backend-y3fq.onrender.com";

const formatOptions = [
  { value: "video", label: "MP4 Video", icon: Film },
  { value: "audio", label: "MP3 Audio", icon: Music },
];

export function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("video");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const fetchVideoInfo = async () => {
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
    setVideoInfo(null);
    setDownloadUrl(null);

    try {
      const response = await fetch(`${API_BASE}/api/youtube/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/youtube/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          quality: selectedFormat === "audio" ? "audio" : "video",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Download failed");
      }

      setDownloadUrl(data.downloadUrl);
      
      // Open download service in new tab
      window.open(data.downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setVideoInfo(null);
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
            Paste any YouTube URL and download videos or audio.
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
              onKeyDown={(e) => e.key === "Enter" && fetchVideoInfo()}
              placeholder="Paste YouTube URL here..."
              className={cn(
                "w-full px-6 py-5 bg-white/5 border rounded-2xl text-lg",
                "placeholder:text-white/30 focus:outline-none transition-all duration-300",
                error 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-white/30 group-hover:border-white/20"
              )}
            />
            <button
              onClick={fetchVideoInfo}
              disabled={loading}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider",
                "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400",
                "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              {loading && !videoInfo ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Fetch
                </>
              )}
            </button>
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

        {/* Video Preview */}
        <AnimatePresence mode="wait">
          {videoInfo && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to HQ thumbnail if maxres fails
                    (e.target as HTMLImageElement).src = videoInfo.thumbnailHQ;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Back Button */}
                <button
                  onClick={resetForm}
                  className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2">
                  {videoInfo.title}
                </h2>

                <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
                  <User className="w-4 h-4" />
                  <a 
                    href={videoInfo.uploaderUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {videoInfo.uploader}
                  </a>
                </div>

                {/* Format Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-mono uppercase tracking-widest text-white/40 mb-3">
                    Format
                  </label>
                  <div className="flex gap-3">
                    {formatOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedFormat(option.value)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300",
                          selectedFormat === option.value
                            ? "bg-white/10 border-white/30 text-white"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                        )}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold uppercase tracking-wider text-lg",
                    "bg-gradient-to-r from-red-600 via-purple-600 to-red-600",
                    "hover:from-red-500 hover:via-purple-500 hover:to-red-500",
                    "transition-all duration-500",
                    "flex items-center justify-center gap-3",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Download {selectedFormat === "audio" ? "MP3" : "MP4"}
                    </>
                  )}
                </button>

                {/* Download Success */}
                <AnimatePresence>
                  {downloadUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-400 font-semibold">Download Page Opened!</span>
                      </div>
                      <p className="text-white/60 text-sm mb-3">
                        If the download page didn't open, click the button below:
                      </p>
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Download Page
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!videoInfo && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Youtube className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-white/40 text-lg">
              Paste a YouTube URL above to get started
            </p>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/30 text-xs mt-8"
        >
          This tool is for personal use only. Please respect copyright laws
          and YouTube's Terms of Service.
        </motion.p>
      </div>
    </section>
  );
}
