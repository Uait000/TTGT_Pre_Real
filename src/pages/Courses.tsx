import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, FileText, ArrowRight } from 'lucide-react';


import rasp from '@/assets/file/kurs/Kal_Grafik_ODPO_25_26.pdf';
import perh from '@/assets/file/kurs/Perehen_i_stoim_obuch_celevikov_2024_2025.pdf';
import p1 from '@/assets/file/kurs/pravila_priema_DPO_26.03.2021.pdf';
import p2 from '@/assets/file/kurs/pol_formi_sroki_kontrolya_DPO_26.03.2021.pdf';
import p3 from '@/assets/file/kurs/pol_o_poriadke_perevod_i_dr_DPO_26.03.2021.pdf';
import p4 from '@/assets/file/kurs/pol_o_poriadke_oforml_otnoshen_ODPO_26.03.2021.pdf';
import stiom from '@/assets/file/kurs/Stiom_Uslug_Predpr_2023.pdf';
import stiomU from '@/assets/file/kurs/Stiom_Uslug_student_03.09.2024.pdf';
import nesov from '@/assets/file/kurs/Dog_kursy_nesov.pdf';
import sov from '@/assets/file/kurs/Dog_kursy_sov.pdf';
import mat from '@/assets/file/kurs/Dog_kursy_MatKap_Fed.pdf';
import vodn from '@/assets/file/kurs/Dog_vodit_nesov.pdf';
import vods from '@/assets/file/kurs/Dog_vodit_sov.pdf';
import vodmst from '@/assets/file/kurs/Dog_vodit_MatKap_Fed.pdf';

import zav1 from '@/assets/file/kurs/zayvl_st.pdf';
import zav2 from '@/assets/file/kurs/zayv-fl.pdf';




const courseItems = [
  { id: 1, name: 'Расписание', image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg', url: rasp },
  { id: 2, name: 'Документы', image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', modalId: 'documents' },
  { id: 3, name: 'Объявление', image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', modalId: 'announcement' },
  { id: 4, name: 'Дистанционное обучение', image: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg', url: 'http://дистанционное24.рф/' },
  { id: 5, name: 'Об отделении дополнительного профессионального образования', image: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg', modalId: 'about' },
  { id: 6, name: 'Контакты', image: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg', modalId: 'contacts' },
  { id: 7, name: 'Программы профессионального обучения', image: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg', modalId: 'programs' },
  { id: 8, name: 'Стоимость услуг', image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', modalId: 'programs' }, // Тот же modalId, что и у "Программ"
  { id: 9, name: 'Заявление', image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', modalId: 'application' },
  { id: 10, name: 'Договор на обучение', image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', modalId: 'contract' }
];


const DocLink = ({ href = "#", children }: { href?: string, children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-primary hover:underline group"
  >
    <FileText className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
    <span>{children}</span>
  </a>
);


const getModalContent = (modalId: string) => {
  switch (modalId) {
    case 'documents':
      return {
        title: 'Документы',
        content: (
          <div className="space-y-3">
            <DocLink href={p1}>Правила приема обучающихся на обучение по программам дополнительного профессионального образования</DocLink>
            <DocLink href={p2}>Положение о формах, периодичности и порядке текущего контроля успеваемости...</DocLink>
            <DocLink href={p3}>Положение о порядке и основаниях перевода, отчисления и восстановления обучающихся...</DocLink>
            <DocLink href={p4}>Положение о порядке оформления возникновения, изменения и прекращения отношений...</DocLink>
          </div>
        )
      };
    case 'announcement':
      return {
        title: 'Объявление',
        content: <p className="text-muted-foreground">Здесь будет текст объявления...</p>
      };
    case 'about':
      return {
        title: 'Об отделении дополнительного профессионального образования',
        content: (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>В процессе трудовой деятельности у каждого человека наступает момент, когда имеющиеся знания и навыки оказываются недостаточными, необходимо совершенствовать имеющиеся профессиональные знания, чтобы быть конкурентоспособным на рынке труда. Чтобы получить желаемую должность или не потерять уже имеющуюся, приходится повышать квалификацию, получать дополнительное профессиональное образование. Кроме того, постоянно изменяющийся рынок трудовых ресурсов может потребовать от специалиста смены профессии.</p>
            <p>Тихорецкий техникум железнодорожного транспорта - филиал РГУПС имеет большой опыт работы в области предоставления образовательных услуг организациям Северо-Кавказской железной дороги, Центрам занятости населения Краснодарского края, предприятиям города и района, учебным заведениям и частным лицам.</p>
            <p>Техникум осуществляет свою деятельность на основании Устава федерального государственного образовательного учреждения высшего образования «Ростовский государственный университет путей сообщения», лицензии на право осуществления образовательной деятельности в сфере профессионального образования Серия 90Л01 №0009156 от 26.04.2016 года. Занятия ведут высококвалифицированные преподаватели соответствующие требованиям профессионального стандарта "Педагог профессионального обучения, профессионального образования и дополнительного профессионального образования", имеющие многолетний опыт работы по преподаваемым дисциплинам, большой стаж производственной деятельности. На занятиях используется мультимедийное оборудование, интерактивные доски, обучающе-тестирующие программы, постоянно обновляется программное обеспечение.</p>
            <p>Отделение профессионального обучения и дополнительного профессионального образования техникума реализует следующие профессиональные образовательные программы:</p>
            <ul className="list-disc list-inside pl-4">
              <li>профессиональное обучение (подготовка, переподготовка и повышение квалификации по рабочим профессиям);</li>
              <li>дополнительные профессиональные образовательные программы (повышение квалификации и переподготовка).</li>
            </ul>
            <p>Цель таких освоения таких образовательных программ - в совершенствовании профессиональных знаний и навыков, повышении деловых качеств специалистов, либо в переподготовке, после которой они смогут занять место в новой сфере деятельности.</p>
            <p>Для лиц, ранее не имевших профессию рабочего, предлагаем пройти профессиональное обучение по программам профессиональной подготовки по профессиям рабочих.</p>
            <p>Для лиц, уже имеющих профессию рабочего, в целях получения новой профессии рабочего с учетом потребностей производства, вида профессиональной деятельности предлагаем пройти профессиональное обучение по программам переподготовки рабочих.</p>
          </div>
        )
      };
    case 'contacts':
      return {
        title: 'Контакты',
        content: (
          <div className="space-y-2">
            <p>3521120 г.Тихорецк, ул.Красноармейская 57.</p>
            <p>За справками обращаться в ОДПО: кабинет 106А,</p>
            <p>телефон: <a href="tel:+78619662003,135" className="text-primary hover:underline">+7 (86196) 6-20-03 доб.135</a></p>
            <p>Почта: <a href="mailto:odpo@ttgt.org" className="text-primary hover:underline">odpo@ttgt.org</a></p>
          </div>
        )
      };
    case 'programs':
      return {
        title: 'Программы профессионального обучения и стоимость услуг',
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Стоимость услуг</h4>
              <DocLink href={stiom}>Подготовка, переподготовка и повышение квалификации рабочих, руководителей и специалистов</DocLink>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Для слушателей ОДПО (студентов ТТЖТ - филиала РГУПС)</h4>
              <DocLink href={stiomU}>Стоимость обучения</DocLink>
            </div>
          </div>
        )
      };
    case 'application':
      return {
        title: 'Заявление',
        content: (
          <div className="space-y-3">
            <DocLink href={zav1}>ЗАЯВЛЕНИЕ НА КУРСЫ ОДПО (студент)</DocLink>
            <DocLink href={zav2}>ЗАЯВЛЕНИЕ НА КУРСЫ ОДПО (физические лица)</DocLink>
          </div>
        )
      };
    case 'contract':
      return {
        title: 'Договор на обучение',
        content: (
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-lg mb-3">Образцы договоров на образование по дополнительным программам:</h4>
              <div className="space-y-3">
                <DocLink href={nesov}>Договор на курсы (несовершеннолетние)</DocLink>
                <DocLink href={sov}>Договор на курсы (совершеннолетние)</DocLink>
                <DocLink href={mat}>Договор на курсы (оплата за счет материнского капитала федеральный)</DocLink>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Образцы договоров на подготовку водителей:</h4>
              <div className="space-y-3">
                <DocLink href={vodn}>Договор (несовершеннолетние)</DocLink>
                <DocLink href={vods}>Договор (совершеннолетние)</DocLink>
                <DocLink href={vodmst}>Договор (оплата за счет материнского капитала федеральный)</DocLink>
              </div>
            </div>
          </div>
        )
      };
    default:
      return { title: 'Ошибка', content: <p>Контент не найден.</p> };
  }
};



const Courses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', content: <></> });

  
  const handleItemClick = (item: typeof courseItems[0]) => {
    if (item.url) {
      
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.modalId) {
      
      const content = getModalContent(item.modalId);
      setModalData(content);
      setModalOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Курсы</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseItems.slice(0, 9).map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group text-left"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-4 text-center text-sm leading-tight group-hover:text-primary transition-colors h-8"> {/* Добавил h-8 для выравнивания */}
                  {item.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                  {item.url ? (
                    <>
                      <span className="text-sm font-medium">Перейти</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Открыть</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="w-full">
            <button
              onClick={() => handleItemClick(courseItems[9])}
              className="block w-full bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="aspect-square bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg overflow-hidden">
                  <img 
                    src={courseItems[9].image} 
                    alt={courseItems[9].name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="lg:col-span-2 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {courseItems[9].name}
                  </h3>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                    <span className="font-medium">Открыть</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
            <a
              href={perh}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Целевая подготовка студентов
                </h3>
                <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                  <span className="font-medium">Подробнее</span>
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{modalData.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 pr-3">
            {modalData.content}
          </div>
        </DialogContent>
      </Dialog>
      
    </MainLayout>
  );
};

export default Courses;