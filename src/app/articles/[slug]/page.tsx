import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return {};
    return {
        title: article.meta.title,
        description: article.meta.description,
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            <article className="max-w-[1200px] mx-auto px-6 md:px-12 pt-28 pb-20 relative z-10">
                {/* Readability panel — keeps long-form prose legible over the live nebula */}
                <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#05060c]/70 backdrop-blur-md px-6 py-10 md:px-12 md:py-14">
                    <div className="mb-8 animate-fade-in">
                        <Link
                            href="/articles"
                            className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8 group uppercase tracking-widest text-[10px]"
                        >
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Articles
                        </Link>

                        <header className="mb-8">
                            <div className="flex gap-3 mb-6">
                                {article.meta.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 border border-white/10 px-2 py-1 rounded-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="font-serif text-3xl md:text-5xl font-normal mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">
                                {article.meta.title}
                            </h1>
                            <div className="flex items-center gap-4 text-white/40 text-sm font-light tracking-widest uppercase border-t border-white/10 pt-6">
                                <time>{article.meta.date}</time>
                            </div>
                        </header>
                    </div>

                    <div className="prose prose-lg prose-invert w-full max-w-none text-justify prose-headings:font-serif prose-headings:font-normal prose-headings:text-white/90 prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed prose-strong:text-white/90 prose-strong:font-medium prose-a:text-white prose-a:no-underline prose-a:border-b prose-a:border-white/30 hover:prose-a:border-white transition-colors prose-li:text-white/60 prose-img:rounded-xl prose-img:opacity-90 prose-img:border prose-img:border-white/10">
                        {article.content}
                    </div>
                </div>
            </article>
        </div>
    );
}
