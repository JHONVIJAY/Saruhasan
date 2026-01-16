import { Void } from "../components/Void";
import { SEO } from "../components/SEO";

export function VoidPage() {
  return (
    <>
      <SEO 
        title="The Void - Film Gallery | Saruhasan Sankar"
        description="Explore my personal collection of films that moved me, stories that resonated, and cinematic experiences I keep coming back to."
      />
      <div className="relative z-10 w-full pb-0 pt-20">
        <Void />
      </div>
    </>
  );
}