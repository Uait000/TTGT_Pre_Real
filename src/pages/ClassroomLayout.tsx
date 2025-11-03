import MainLayout from '@/components/MainLayout';
import korpus1Bg from '@/assets/pictures/room/1korpus_1.jpg';
import korpus2Bg from '@/assets/pictures/room/1korpus_2.jpg'; 
import korpus3Bg from '@/assets/pictures/room/3korpus_1.jpg';
import korpus4Bg from '@/assets/pictures/room/4korpus_1.jpg';
import korpus1Floor1Map from '@/assets/pictures/room/1-1.jpg';
import korpus1Floor2Map from '@/assets/pictures/room/1-2.jpg';
import korpus2Floor1Map from '@/assets/pictures/room/2-1.jpg';
import korpus2Floor2Map from '@/assets/pictures/room/2-2.jpg';
import korpus2Floor3Map from '@/assets/pictures/room/2-3.jpg';
import korpus3Floor1Map from '@/assets/pictures/room/1-3.jpg';
import korpus3Floor2Map from '@/assets/pictures/room/3-2.jpg';
import korpus4Floor2Map from '@/assets/pictures/room/2-4.jpg';
import korpus4Floor1Map from '@/assets/pictures/room/1-4.jpg';


const buildings = [
  {
    id: 1,
    name: '1 корпус',
    baseImage: korpus1Bg,
    
    floors: [
      { 
        name: '1 этаж', 
        link: korpus1Floor1Map, 
        
        positionClasses: 'top-1/2 left-0 w-full h-1/2' 
      },
      { 
        name: '2 этаж', 
        link: korpus2Floor1Map, 
        
        positionClasses: 'top-0 left-0 w-full h-1/2' 
      },
    ],
  },
  {
    id: 2,
    name: '2 корпус',
    baseImage: korpus2Bg,
    floors: [
      
      { 
        name: '1 этаж', 
        link: korpus1Floor2Map, 
        positionClasses: 'top-[66.66%] left-0 w-full h-1/3' 
      },
      { 
        name: '2 этаж', 
        link: korpus2Floor2Map, 
        positionClasses: 'top-[33.33%] left-0 w-full h-1/3' 
      },
      { 
        name: '3 этаж', 
        link: korpus3Floor2Map, 
        positionClasses: 'top-0 left-0 w-full h-1/3' 
      },
    ],
  },
  {
    id: 3,
    name: '3 корпус',
    baseImage: korpus3Bg,
    floors: [
      { 
        name: '1 этаж', 
        link: korpus3Floor1Map, 
        positionClasses: 'top-1/2 left-0 w-full h-1/2' 
      },
      { 
        name: '2 этаж', 
        link: korpus2Floor3Map, 
        positionClasses: 'top-0 left-0 w-full h-1/2' 
      },
    ],
  },
  {
    id: 4,
    name: '4 корпус',
    baseImage: korpus4Bg,
    floors: [
      
      { 
        name: '1 этаж', 
        link: korpus4Floor1Map, 
        positionClasses: 'top-1/2 left-0 w-full h-1/2' 
      },
      { 
        name: '2 этаж', 
        link: korpus4Floor2Map, 
        positionClasses: 'top-0 left-0 w-full h-1/2' 
      },
    ],
  },
];



const ClassroomLayout = () => {
  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Размещение учебных аудиторий</h1>
        
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 group"
              >
                <h2 className="text-xl font-semibold text-primary mb-4 text-center">
                  {building.name}
                </h2>
                
                <div className="relative rounded-lg overflow-hidden group-hover:shadow-xl transition-shadow border border-border/20">
                  
                  <img 
                    src={building.baseImage} 
                    alt={building.name}
                    
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {building.floors.map((floor) => (
                    <a
                      key={floor.name}
                      href={floor.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Схема: ${building.name}, ${floor.name}`}
                      
                      className={`
                        absolute ${floor.positionClasses}
                        flex items-center justify-center
                        bg-black/20 opacity-0 group-hover:opacity-100 
                        transition-all duration-300
                        cursor-pointer
                        focus:outline-none focus:ring-4 focus:ring-primary/50
                      `}
                    >
                      <span 
                        className="
                          text-white text-4xl font-extrabold 
                          [text-shadow:_2px_2px_4px_rgb(0_0_0_/_70%)]
                          scale-90 group-hover:scale-100 transition-transform
                        "
                      >
                        {floor.name}
                      </span>
                    </a>
                  ))}
                  
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-muted-foreground text-sm">
                    Наведите и нажмите на нужный этаж
                  </span>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassroomLayout;