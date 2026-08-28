const WORDS = ["INNOVATION", "ELECTRONICS", "GADGETS", "TECH", "CREATIVITY", "BUILDS"];

function MarqueeItem() {
  return (
    <div className="flex items-center gap-8 whitespace-nowrap px-8 font-display text-[17px] tracking-[0.12em] text-muted">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-8">
          {w}
          <span className="inline-block h-[5px] w-[5px] rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[#1e1e1e] bg-[#0d0d0d] py-[13px]">
      <div className="group flex w-max animate-marquee [animation-play-state:running] hover:[animation-play-state:paused]">
        <MarqueeItem />
        <MarqueeItem />
      </div>
    </div>
  );
}
