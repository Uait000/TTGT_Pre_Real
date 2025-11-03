import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';


import imgAbakumova from '@/assets/pictures/pride/01_Abakumova.jpg';
import imgAkimov from '@/assets/pictures/pride/02_Akimov.jpg';
import imgAntonova from '@/assets/pictures/pride/03_Antonova.jpg';
import imgAstashov from '@/assets/pictures/pride/04_Astashhov.jpg';
import imgAfinogenov from '@/assets/pictures/pride/05_Afinogenov.jpg';
import imgBelevcev from '@/assets/pictures/pride/06_Belevcev.jpg';
import imgBogacheva from '@/assets/pictures/pride/07_Bogacheva.jpg';
import imgBondarenko from '@/assets/pictures/pride/08_Bondarenko.jpg';
import imgBohmat from '@/assets/pictures/pride/09_Bohmat.jpg';
import imgHash02 from '@/assets/pictures/pride/0b51ce7e3bbe5fd600a7f23e25c9990b.jpg';
import imgHash03 from '@/assets/pictures/pride/1dce2cb6945103ca81ee13ce6028c38e.jpg';
import imgHash04 from '@/assets/pictures/pride/2d1bfc57a990b54c34b745bcda9daba3.jpg';
import imgHash05 from '@/assets/pictures/pride/6da40ff72df1d46f5c07e66ee569bf0d.jpg';
import imgHash06 from '@/assets/pictures/pride/6e7ecfa5e3ed46e874f73f8d457e27ef.jpg';
import imgHash07 from '@/assets/pictures/pride/15a947a794d2bb63259a5df677d0d5f2.jpg';
import imgHash08 from '@/assets/pictures/pride/24ca24c25931fef07535cc1897974afd.jpg';
import imgHash09 from '@/assets/pictures/pride/47abc9be78edf98ce460fc71bf26d10d.jpg';
import imgHash10 from '@/assets/pictures/pride/97d989c57c5ccc73794819dbf9914867.jpg';
import imgHash11 from '@/assets/pictures/pride/3541b2ca700bcce6ea3eb4eb637acfcf.jpg';
import imgHash12 from '@/assets/pictures/pride/8923ed6b5adc09ece5c2386b98f4a727.jpg';
import imgHash13 from '@/assets/pictures/pride/9238ceef8ecabb1e069a42bd878560a1.jpg';
import imgHash14 from '@/assets/pictures/pride/91125e56f4ef91fb14e76d6091894a53.jpg';
import imgHash15 from '@/assets/pictures/pride/0143365a6d8cb25a0b45d2f1b57fd00e.jpg';
import imgHash16 from '@/assets/pictures/pride/942514dd188ceabdbcba0c817b8c10ad.jpg';
import imgHash17 from '@/assets/pictures/pride/a4bba46f652d448156d59586f7ff706c.jpg';
import imgHash18 from '@/assets/pictures/pride/a362bfe7799152b2c6f7919a5188617f.jpg';
import imgHash19 from '@/assets/pictures/pride/b2a4fca2266db9e7ad763d6acaac78e9.jpg';
import imgHash20 from '@/assets/pictures/pride/b24eb4678124d530bd9713431c7a2848.jpg';
import imgHash21 from '@/assets/pictures/pride/b2601963d23a955e0c80cfdc76459672.jpg';
import imgHash22 from '@/assets/pictures/pride/c75f22a3c33413d8b1e4e660bdcef145.jpg';
import imgHash23 from '@/assets/pictures/pride/cbbc47ecd454fbdbd8f0301b6a8c29bd.jpg';
import imgHash24 from '@/assets/pictures/pride/e25e3a93436287964889833b088b7c97.jpg';
import imgHash25 from '@/assets/pictures/pride/edd3fd6cac17885dd9178514283e75c1.jpg';
import imgHash26 from '@/assets/pictures/pride/1fceb42d981ff632413250517392e27a.jpg';
import imgHash27 from '@/assets/pictures/pride/2f46c4ebed94dbe1d23656807d46b643.jpg';
import imgHash28 from '@/assets/pictures/pride/4c408440b98591cd8b348b33a158627e.jpg';
import imgHash29 from '@/assets/pictures/pride/4c408440b98591cd8b348b33a158627e.jpg';
import imgHash30 from '@/assets/pictures/pride/6f82e85d1943346ef3b0789defc6b3de.jpg';
import imgHash31 from '@/assets/pictures/pride/6f82e85d1943346ef3b0789defc6b3de.jpg';
import imgHash32 from '@/assets/pictures/pride/84eeb9168f3a64a9b50d5cdd42ec4c99.jpg';
import imgHash33 from '@/assets/pictures/pride/84eeb9168f3a64a9b50d5cdd42ec4c99.jpg';
import imgHash34 from '@/assets/pictures/pride/8157d930a7a97a9242e3db50d67daaa5.jpg';
import imgHash35 from '@/assets/pictures/pride/51882e223414d7626a0c2ebb03a204ae.jpg';
import imgHash36 from '@/assets/pictures/pride/225565fb7c8a2346d07efd95c03fe151.jpg';
import imgHash37 from '@/assets/pictures/pride/ad4d2f3ae673adcc1bdc504e5747b965.jpg';
import imgHash38 from '@/assets/pictures/pride/b0a0ac2eaa1be4f5f21b13ccea346889.jpg';
import imgHash39 from '@/assets/pictures/pride/bcb51203d9cb74cf685d991ed6329b32.jpg';
import imgHash40 from '@/assets/pictures/pride/c70d3a0bdd0af18010d786a3444df76e.jpg';
import imgHash41 from '@/assets/pictures/pride/cd7a249187bcda40e110237dac715aa2.jpg';
import imgHash42 from '@/assets/pictures/pride/d3ff292d2033c74889a1f0fc69d54dbb.jpg';
import imgHash43 from '@/assets/pictures/pride/d5c20a60610979713d1caf28c2a81517.jpg';
import imgHash44 from '@/assets/pictures//pride/d218221cbd1379f814f1d096d8b8611f.jpg';
import imgHash45 from '@/assets/pictures/pride/df943dca11d46644b60a37c31ad0f498.jpg';
import imgHash46 from '@/assets/pictures/pride/e4383bf580ff0305159cfd1928b3ef5a.jpg';
import imgHash47 from '@/assets/pictures/pride/ede79a7f28f409aa8304bc6c6c73c071.jpg';
import imgHash48 from '@/assets/pictures/pride/f37c9e8e43eb97e10802b55be21f7add.jpg';
import imgHash49 from '@/assets/pictures/pride/0acc6626763f0373713d423b468ec8dc.jpg';
import imgHash50 from '@/assets/pictures/pride/0fe70d9afd0ccc9a9ef8e620c88dac71.jpg';
import imgHash51 from '@/assets/pictures/pride/56c5dc37b1056eb7ac9c9c34f58a3189.jpg';
import imgHash52 from '@/assets/pictures/pride/872980b078f5275a91e63b400409b498.jpg';
import imgHash53 from '@/assets/pictures/pride/a09d447ce1462fe54f84fed667ee9394.jpg';

const allStudents = [
  { name: 'Абакумова Василиса', image: imgAbakumova },
  { name: 'Асташов Алексей', image: imgAstashov },
  { name: 'Богачева Виктория', image: imgBogacheva },
  { name: 'Акимов Илья', image: imgAkimov },
  { name: 'Афиногенов Артём', image: imgAfinogenov },
  { name: 'Бондаренко Софья', image: imgBondarenko },
  { name: 'Антонова Анастасия', image: imgAntonova },
  { name: 'Белевцев Даниил', image: imgBelevcev },
  { name: 'Бохмат Варвара', image: imgBohmat },
  { name: 'Студент', image: imgHash02 },
  { name: 'Студент', image: imgHash03 },
  { name: 'Студент', image: imgHash04 },
  { name: 'Студент', image: imgHash05 },
  { name: 'Студент', image: imgHash06 },
  { name: 'Студент', image: imgHash07 },
  { name: 'Студент', image: imgHash08 },
  { name: 'Студент', image: imgHash09 },
  { name: 'Студент', image: imgHash10 },
  { name: 'Студент', image: imgHash11 },
  { name: 'Студент', image: imgHash12 },
  { name: 'Студент', image: imgHash13 },
  { name: 'Студент', image: imgHash14 },
  { name: 'Студент', image: imgHash15 },
  { name: 'Студент', image: imgHash16 },
  { name: 'Студент', image: imgHash17 },
  { name: 'Студент', image: imgHash18 },
  { name: 'Студент', image: imgHash19 },
  { name: 'Студент', image: imgHash20 },
  { name: 'Студент', image: imgHash21 },
  { name: 'Студент', image: imgHash22 },
  { name: 'Студент', image: imgHash23 },
  { name: 'Студент', image: imgHash24 },
  { name: 'Студент', image: imgHash25 },
  { name: 'Студент', image: imgHash26 },
  { name: 'Студент', image: imgHash27 },
  { name: 'Студент', image: imgHash28 },
  { name: 'Студент', image: imgHash29 },
  { name: 'Студент', image: imgHash30 },
  { name: 'Студент', image: imgHash31 },
  { name: 'Студент', image: imgHash32 },
  { name: 'Студент', image: imgHash33 },
  { name: 'Студент', image: imgHash34 },
  { name: 'Студент', image: imgHash35 },
  { name: 'Студент', image: imgHash36 },
  { name: 'Студент', image: imgHash37 },
  { name: 'Студент', image: imgHash38 },
  { name: 'Студент', image: imgHash39 },
  { name: 'Студент', image: imgHash40 },
  { name: 'Студент', image: imgHash41 },
  { name: 'Студент', image: imgHash42 },
  { name: 'Студент', image: imgHash43 },
  { name: 'Студент', image: imgHash44 },
  { name: 'Студент', image: imgHash45 },
  { name: 'Студент', image: imgHash46 },
  { name: 'Студент', image: imgHash47 },
  { name: 'Студент', image: imgHash48 },
  { name: 'Студент', image: imgHash49 },
  { name: 'Студент', image: imgHash50 },
  { name: 'Студент', image: imgHash51 },,
  { name: 'Студент', image: imgHash52 },
  { name: 'Студент', image: imgHash53 },
];


const STUDENTS_PER_PAGE = 9; 


const Pride = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalStudents = allStudents.length;
  const totalPages = Math.ceil(totalStudents / STUDENTS_PER_PAGE);

  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
  const endIndex = startIndex + STUDENTS_PER_PAGE;
  const currentStudents = allStudents.slice(startIndex, endIndex);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          
          {currentStudents.map((student, index) => (
            <div
              key={index}
              className="rounded-xl shadow-lg border-2 border-transparent group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50 overflow-hidden"
            >
              <img
                src={student.image}
                alt={student.name} 
                className="w-full h-auto bg-gray-100" 
              />

            </div>
          ))}


        </div>


        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
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