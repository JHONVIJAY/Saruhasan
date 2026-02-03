import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Instagram, 
  Loader2, 
  Play, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Image,
  Film
} from "lucide-react";
import { cn } from "../lib/utils";

interface PostInfo {
  id: string;
  title: string;
  thumbnail: string | null;
  type: string;
}

interface DownloadResult {
  success: boolean;
  downloadUrl: string;
  type: string;
  allMedia?: string[];
}

// Your Render backend URL
const API_BASE = "https://portfolio-backend-y3fq.onrender.com";

export function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidInstagramUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv|stories)\/.+/;
    return regex.test(url);
  };

  const fetchPostInfo = async () => {
    if (!url.trim()) {
      setError("Please enter an Instagram URL");
      return;
    }

    if (!isValidInstagramUrl(url)) {
      setError("Please enter a valid Instagram URL (post, reel, or story)");
      return;
    }

    setLoading(true);
    setError(null);
    setPostInfo(null);
    setDownloadResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/instagram/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch post info");
      }

      setPostInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!postInfo) return;

    setDownloading(true);
    setError(null);
    setDownloadResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/instagram/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Download failed");
      }

      if (data.success && data.downloadUrl) {
        setDownloadResult(data);
        // Trigger download
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("No download link received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setPostInfo(null);
    setError(null);
    setDownloadResult(null);
    inputRef.current?.focus();
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 px-4 py-2 rounded-full mb-6">
            <Instagram className="w-5 h-5 text-pink-500" />
            <span className="font-mono text-xs uppercase tracking-widest text-pink-400">
              Instagram Downloader
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">Instagram</span> Content
          </h1>
          
          <p className="text-white/50 max-w-xl mx-auto">
            Download reels, posts, and stories from Instagram.
            Fast, free, and no login required.
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
              onKeyDown={(e) => e.key === "Enter" && fetchPostInfo()}
              placeholder="Paste Instagram URL here..."
              className={cn(
                "w-full px-6 py-5 bg-white/5 border rounded-2xl text-lg",
                "placeholder:text-white/30 focus:outline-none transition-all duration-300",
                error 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-white/30 group-hover:border-white/20"
              )}
            />
            <button
              onClick={fetchPostInfo}
              disabled={loading}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider",
                "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500",
                "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              {loading && !postInfo ? (
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

        {/* Post Preview */}
        <AnimatePresence mode="wait">
          {postInfo && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square max-h-[400px]">
                {postInfo.thumbnail ? (
                  <img
                    src={postInfo.thumbnail}
                    alt={postInfo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    {postInfo.type === 'video' ? (
                      <Film className="w-24 h-24 text-white/20" />
                    ) : (
                      <Image className="w-24 h-24 text-white/20" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Back Button */}
                <button
                  onClick={resetForm}
                  className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Type Badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded-lg flex items-center gap-2">
                  {postInfo.type === 'video' ? (
                    <Film className="w-4 h-4 text-pink-400" />
                  ) : (
                    <Image className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="text-sm font-mono capitalize">{postInfo.type}</span>
                </div>
              </div>

              {/* Post Info */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  {postInfo.title}
                </h2>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold uppercase tracking-wider text-lg",
                    "bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600",
                    "hover:from-pink-500 hover:via-purple-500 hover:to-orange-500",
                    "transition-all duration-500",
                    "flex items-center justify-center gap-3",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Getting Download Link...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Download {postInfo.type === 'video' ? 'Video' : 'Image'}
                    </>
                  )}
                </button>

                {/* Download Success */}
                <AnimatePresence>
                  {downloadResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-400 font-semibold">Download Started!</span>
                      </div>
                      <p className="text-white/60 text-sm mb-3">
                        If download didn't start, click the button below:
                      </p>
                      <a
                        href={downloadResult.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Download
                      </a>

                      {/* Show all media for carousel posts */}
                      {downloadResult.allMedia && downloadResult.allMedia.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-white/60 text-sm mb-2">
                            This post has {downloadResult.allMedia.length} items:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {downloadResult.allMedia.map((mediaUrl, index) => (
                              <a
                                key={index}
                                href={mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                              >
                                Item {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!postInfo && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center">
              <Instagram className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-white/40 text-lg">
              Paste an Instagram URL above to get started
            </p>
            <p className="text-white/30 text-sm mt-2">
              Supports reels, posts, and stories
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
          This tool is for personal use only. Please respect content creators
          and Instagram's Terms of Service.
        </motion.p>
      </div>
    </section>
  );
}
