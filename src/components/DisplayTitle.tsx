/**
 * Shared display title used across tabs (Projects, Contact, CV, About).
 * Renders the leading words as a shimmering fill and the final word as an
 * outline, echoing the home marquee for one consistent typographic system.
 */
export function DisplayTitle({ text, className = "" }: { text: string; className?: string }) {
    const words = (text || "").trim().split(/\s+/);
    const last = words.pop() || "";
    const head = words.join(" ");
    return (
        <h1
            className={`font-serif font-bold leading-[0.95] tracking-tight text-[clamp(46px,9vw,110px)] pb-1 ${className}`}
        >
            {head && <span className="block title-shimmer">{head}</span>}
            <span className="block outline-word">{last}</span>
        </h1>
    );
}
