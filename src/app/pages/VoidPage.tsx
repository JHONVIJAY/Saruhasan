import { Void } from "../components/Void";
import { YouTubeDownloader } from "../components/YouTubeDownloader";

export function VoidPage() {
  return (
    <main className="relative z-10 w-full pb-0 pt-20">
      <Void />
      <YouTubeDownloader />
    </main>
  );
}
