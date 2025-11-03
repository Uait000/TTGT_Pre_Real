// src/pages/ClassroomLayout.tsx

import MainLayout from '@/components/MainLayout'; // Импортируем компонент макета
// Удалены: import Header, Sidebar, SidebarCards, InfoBlocks

const ClassroomLayout = () => {
    const buildings = [
        { id: 1, name: '1 корпус', image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg', url: '#' },
        { id: 2, name: '2 корпус', image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg', url: '#' },
        { id: 3, name: '3 корпус', image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', url: '#' },
        { id: 4, name: '4 корпус', image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', url: '#' }
    ];

    return (
        // Оборачиваем уникальный контент в MainLayout
        <MainLayout>
            {/* MainLayout уже добавит: ContactStrip, InfoBlocks и обернет контент в container mx-auto. 
               Нам нужно только содержимое, которое раньше было внутри <main>.
            */}
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Размещение учебных аудиторий</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {buildings.map((building) => (
                            <a
                                key={building.id}
                                href={building.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                            >
                                <h2 className="text-xl font-semibold text-primary mb-4 text-center group-hover:text-primary-hover transition-colors">
                                    {building.name}
                                </h2>
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                                    <img 
                                        src={building.image} 
                                        alt={building.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                                        Нажмите для просмотра планировки
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ClassroomLayout;