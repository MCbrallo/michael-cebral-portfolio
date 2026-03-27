import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { MantisVisionSimulator } from '@/components/articles/MantisVisionSimulator';

const contentDir = path.join(process.cwd(), 'src/content/articles');

export interface ArticleMeta {
    title: string;
    date: string;
    description: string;
    tags: string[];
    slug: string;
}

export async function getArticleBySlug(slug: string) {
    const fileName = slug + '.mdx';
    const filePath = path.join(contentDir, fileName);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');



    const { frontmatter, content } = await compileMDX<ArticleMeta>({
        source,
        options: { parseFrontmatter: true },
        components: { MantisVisionSimulator },
    });

    return {
        meta: { ...frontmatter, slug },
        content,
    };
}

export async function getAllArticles() {
    if (!fs.existsSync(contentDir)) return [];

    const files = fs.readdirSync(contentDir);
    const articles = await Promise.all(
        files.map(async (file) => {
            const slug = file.replace(/\.mdx$/, '');
            const article = await getArticleBySlug(slug);
            return article?.meta;
        })
    );

    return articles
        .filter((a): a is ArticleMeta => !!a)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
