"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Straight to the content, in whichever language the reader chose. */
export function SkipLink() {
    const { t } = useLanguage();
    return (
        <a href="#contenido" className="saltar">
            {t.common.skip}
        </a>
    );
}
