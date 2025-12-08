import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from 'lucide-react';
import { postsApi, Post, PostCategory, BackendFile } from '@/api/posts';
import { BASE_URL } from '@/api/config';

const STUDENTS_PER_PAGE = 9; 

const Pride = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // Теперь храним не посты, а сразу файлы (картинки)
  const [allImages, setAllImages] = useState<BackendFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getPublicAll({ category: PostCategory.Pride, limit: 200 });
            
            // ЛОГИКА ИЗМЕНЕНА:
            // Мы проходим по всем постам и собираем ВСЕ файлы из них в один плоский список
            const extractedImages: BackendFile[] = [];
            
            data.forEach(post => {
                if (post.files && post.files.length > 0) {
                    // Добавляем все файлы из текущего поста в общий массив
                    post.files.forEach(file => {
                        extractedImages.push(file);
                    });
                }
            });

            // Если нужно, можно перевернуть массив, чтобы новые были сверху, 
            // но обычно файлы внутри поста уже в нужном порядке.
            // extractedImages.reverse(); 

            setAllImages(extractedImages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchStudents();
  }, []);

  const getImageUrl = (file: any) => {
      if (!file) return '';
      if (file.url) {
           if (file.url.startsWith('http')) return file.url;
           return `${BASE_URL}${file.url}`;
      }
      if (file.id) {
          return `${BASE_URL}/files/${file.id}`;
      }
      return '';
  };

  // Пагинация теперь работает на основе количества КАРТИНОК, а не постов
  const totalStudents = allImages.length;
  const totalPages = Math.ceil(totalStudents / STUDENTS_PER_PAGE);

  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
  const endIndex = startIndex + STUDENTS_PER_PAGE;
  const currentImages = allImages.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 
    const halfWay = Math.ceil(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWay + 1);
    let endPage = Math.min(totalPages, currentPage + maxPagesToShow - halfWay);

    if (currentPage < halfWay) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage > totalPages - halfWay) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 2) {
      pages.push(1, '...');
    } else if (startPage === 2) {
      pages.push(1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...', totalPages);
    } else if (endPage === totalPages - 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (loading) {
      return <MainLayout><div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">
          Наша гордость
        </h1>

        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-8">
          <p className="text-center text-foreground leading-relaxed">
            Доска почета - место, где мы с гордостью представляем наших
            лучших студентов, которые своими
            достижениями прославляют наш техникум.
          </p>
        </div>

        {allImages.length === 0 ? (
             <div className="text-center py-10 text-gray-500">Фотографии еще не загружены</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start">
            
            {currentImages.map((file) => (
                <div
                // Используем ID файла как ключ, так как он уникален
                key={file.id}
                className="relative rounded-xl shadow-sm border border-border overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white"
                >
                    <img
                        src={getImageUrl(file)}
                        alt={file.name} // Используем имя файла как alt текст
                        className="w-full h-auto block object-contain"
                        onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-student.jpg'}
                    />
                </div>
            ))}

            </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap gap-y-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Pride;