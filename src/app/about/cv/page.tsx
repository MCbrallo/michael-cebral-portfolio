import { CVSection } from "@/components/CVSection";

export default function CVPage() {
    return (
        <div className="min-h-screen pb-20 bg-white">
            <div className="max-w-5xl mx-auto px-8 md:px-12 pt-12 mb-0 opacity-0 animate-in fade-in duration-700 slide-in-from-bottom-2">
                <h2 className="font-sans text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
                    Curriculum Vitae
                </h2>
            </div>
            <CVSection />
        </div>
    );
}
