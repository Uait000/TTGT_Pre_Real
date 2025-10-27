import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';

interface SimpleTextPageProps {
  title: string;
  content?: React.ReactNode;
}

const SimpleTextPage = ({ title, content }: SimpleTextPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">{title}</h1>
              
              {content || (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                  <p className="text-foreground leading-relaxed text-center">
                    Содержимое страницы будет добавлено позже.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default SimpleTextPage;