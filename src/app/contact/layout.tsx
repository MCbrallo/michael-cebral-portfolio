import type { Metadata } from "next";

/** The contact page is a client component, so its metadata lives here. */
export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Michael Cebral about science communication, outreach and Earth observation work.",
    alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
