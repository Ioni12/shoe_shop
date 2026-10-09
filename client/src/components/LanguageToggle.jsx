import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const next = i18n.language === "sq" ? "en" : "sq";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t("nav.switchLanguage")}
      className="font-mono text-xs uppercase tracking-stamp border border-stone-line px-2.5 py-1 text-stone hover:text-brass hover:border-brass transition-colors duration-300"
    >
      {next.toUpperCase()}
    </button>
  );
}
