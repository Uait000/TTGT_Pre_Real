import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout'; 
import { postsApi, PostCategory } from '@/api/posts'; 
import { BASE_URL } from '@/api/config';
import type { Post as Contest } from '@/api/posts'; 
import { Loader2, FileText, ExternalLink, Trophy } from 'lucide-react';

const getPdfUrl = (fileId: string | undefined): string => {
    if (!fileId) return '#'; 
    const cleanBaseUrl = BASE_URL.endsWith('/api') ? BASE_URL.slice(0, -4) : BASE_URL;
    return `${cleanBaseUrl}/files/${fileId}`;
};

const fetchContests = async () => {
    return await postsApi.getPublicAll({ 
        category: PostCategory.Contests,
        limit: 10000, // Без лимита (почти)
    });
};

const Contests = () => {
    const { data: contests = [], isLoading } = useQuery<Contest[]>({
        queryKey: ['posts', PostCategory.Contests],
        queryFn: fetchContests,
    });

    const renderContestContent = (contest: Contest) => {
        let items: any[] = [];
        
        try {
            const parsed = JSON.parse(contest.body);
            if (Array.isArray(parsed)) {
                items = parsed;
            } else {
                throw new Error("Legacy");
            }
        } catch (e) {
            // Поддержка старых записей
            if (contest.files && contest.files.length > 0) {
                items.push({ type: 'file', name: 'Положение о конкурсе', fileId: contest.files[0]?.id });
            }
            if (contest.files && contest.files.length > 1) {
                items.push({ type: 'file', name: 'Регламент', fileId: contest.files[1]?.id });
            }
        }

        return (
            <div className="space-y-4">
                {items.map((item, idx) => {
                    // Рендеринг ТЕКСТОВОГО БЛОКА
                    if (item.type === 'text') {
                        return (
                            <div 
                                key={idx} 
                                className="prose prose-blue dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: item.textContent }}
                            />
                        );
                    }

                    // Рендеринг КНОПКИ (Файл или Ссылка)
                    const href = item.type === 'link' ? item.linkUrl : getPdfUrl(item.fileId);
                    
                    return (
                        <a
                            key={idx}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                        >
                            <div className={`p-3 rounded-full mr-4 transition-colors ${
                                item.type === 'link' 
                                    ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' 
                                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            }`}>
                                {item.type === 'link' ? <ExternalLink size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                    {item.type === 'link' ? item.linkUrl : 'Нажмите, чтобы открыть документ'}
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    
                    <div className="text-center mb-16">
                        <span className="inline-block p-3 rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-sm">
                            <Trophy size={32} />
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Конкурсы и Мероприятия
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Вся информация о предстоящих и прошедших событиях.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    ) : contests.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
                            <p className="text-gray-500">В данный момент активных конкурсов нет.</p>
                        </div>
                    ) : (
                        <div className="grid gap-10">
                            {contests.map((contest) => (
                                <article 
                                    key={contest.id} 
                                    className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* УБРАНА ДАТА, только заголовок */}
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        {contest.title}
                                    </h3>
                                    
                                    <div className="mt-4">
                                        {renderContestContent(contest)}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Contests;