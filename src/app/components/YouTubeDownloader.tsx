import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Download, Loader2, Link as LinkIcon, AlertCircle, Film, Music, User, CheckCircle2, ExternalLink } from 'lucide-react';

export function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [videoInfo, setVideoInfo] = useState<{
    id: string;
    thumbnail: string;
    title: string;
    author: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [showFallback, setShowFallback] = useState(false);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAnalyze = async () => {
    setError('');
    setDownloadStatus('idle');
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError('Invalid YouTube URL. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Video not found');
      }

      setVideoInfo({
        id: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        title: data.title || 'YouTube Video',
        author: data.author_name || 'Unknown Channel'
      });
    } catch (err) {
      console.error(err);
      setVideoInfo({
        id: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        title: 'YouTube Video',
        author: 'Unknown Channel'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (type: 'mp4' | 'mp3') => {
    if (!videoInfo) return;
    
    setIsDownloading(true);
    setError('');
    setShowFallback(false);
    
    try {
      // Primary method: Cobalt API via CORS Proxy
      // We use corsproxy.io to bypass the browser's CORS restrictions
      const apiEndpoint = 'https://api.cobalt.tools/api/json';
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiEndpoint)}`;

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoInfo.id}`,
          vCodec: 'h264',
          vQuality: '720',
          aFormat: 'mp3',
          isAudioOnly: type === 'mp3'
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.status === 'error' || !data.url) {
        throw new Error(data.text || 'Download generation failed');
      }

      // Success: Native download trigger
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `${videoInfo.title}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);

    } catch (err) {
      setError('Primary server busy. Please use the backup link.');
      setShowFallback(true);
      setDownloadStatus('error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-24 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative p-8 md:p-12 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12),transparent_70%)] opacity-100" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] mix-blend-screen" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, 
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                <Youtube className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Video Downloader</h3>
                <p className="text-sm text-white/50 mt-1">Paste a link to save offline</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-white/30">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube link here..."
                className="w-full pl-12 pr-32 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all duration-300"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || isDownloading || !url}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-0 flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {videoInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row gap-8 items-center">
                  {/* Thumbnail */}
                  <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-black relative group/thumb shadow-lg shadow-black/50">
                    <img 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                      <Youtube className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-1 w-full text-center md:text-left">
                    <h4 className="text-xl font-bold text-white mb-2 line-clamp-2" title={videoInfo.title}>
                      {videoInfo.title}
                    </h4>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm mb-6">
                      <User className="w-4 h-4" />
                      <span>{videoInfo.author}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <button
                        onClick={() => handleDownload('mp4')}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4 text-sky-400" />}
                        <span className="font-medium">Video (MP4)</span>
                        {!isDownloading && <Download className="w-4 h-4 opacity-50 group-hover/btn:translate-y-0.5 transition-transform" />}
                      </button>
                      
                      <button
                        onClick={() => handleDownload('mp3')}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4 text-purple-400" />}
                        <span className="font-medium">Audio (MP3)</span>
                        {!isDownloading && <Download className="w-4 h-4 opacity-50 group-hover/btn:translate-y-0.5 transition-transform" />}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {downloadStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 flex items-center gap-2 text-green-400 text-sm justify-center md:justify-start"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Download started!</span>
                        </motion.div>
                      )}

                      {showFallback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 flex flex-col gap-3 items-center md:items-start"
                        >
                           <div className="flex items-center gap-2 text-yellow-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{error}</span>
                           </div>
                           
                           <a 
                             href={`https://ssyoutube.com/watch?v=${videoInfo.id}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm transition-all duration-300 group/link"
                           >
                              <span>Try Backup Server</span>
                              <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                           </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
