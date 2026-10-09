import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExpandableText({ text, limit = 220, className = "" }) {
  const { t } = useTranslation();
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
          {expanded ? t("common.showLess") : t("common.showMore")}
        </button>
      )}
    </div>
  );
}
