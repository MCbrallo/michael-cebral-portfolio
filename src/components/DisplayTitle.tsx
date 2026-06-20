/**
 * Shared display title used across tabs (Projects, Contact, CV, About).
 * Renders on a single line: the leading words as a shimmering fill and the
 * final word as an outline, echoing the home marquee for one consistent
 * typographic system. Pass `split={false}` to render the whole title filled
 * (useful for short titles or questions where an outlined last token reads odd).
 */
export function DisplayTitle({
    text,
    className = "",
    split = true,
}: {
    text: string;
    className?: string;
    split?: boolean;
}) {
    const words = (text || "").trim().split(/\s+/);
    const last = words.pop() || "";
    const head = words.join(" ");
    const base = `font-serif font-bold leading-[1.02] tracking-tight text-[clamp(38px,6.4vw,82px)] pb-1 ${className}`;

    if (!split || !head) {
        return (
            <h1 className={base}>
                <span className="title-shimmer">{text}</span>
            </h1>
        );
    }

    return (
        <h1 className={base}>
            <span className="title-shimmer">{head} </span>
            <span className="outline-word">{last}</span>
        </h1>
    );
}
