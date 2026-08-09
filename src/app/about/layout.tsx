import type { Metadata } from "next";

/**
 * /about is a client component and cannot export metadata itself, so it comes
 * from here. Without it the page inherited the site default and four separate
 * pages went to search engines claiming to be the same thing.
 */
export const metadata: Metadata = {
    // The template has to be restated here. A plain string title in a layout
    // clears the one inherited from the root for everything below it, which
    // is why /about/cv came out titled just "CV".
    title: { default: "About", template: "%s | Michael Cebral" },
    description:
        "Michael Cebral, science communicator working between biotechnology and space. From Lugo and Santiago de Compostela to UCL, Karolinska, the International Space University and ESTEC.",
    alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
