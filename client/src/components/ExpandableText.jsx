import { useState } from "react";

export default function ExpandableText({ text, limit = 220, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > limit;
  const shown =
    expanded || !needsTruncation ? text : text.slice(0, limit).trimEnd() + "…";

  return (
    <div className={className}>
      <p className="leading-relaxed break-words">{shown}</p>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 font-mono text-xs uppercase tracking-stamp text-oxblood hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
