import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Импорт стилей редактора для админки
import { Label } from '@/components/ui/label';
import './RichTextEditor.css'; 

const Parchment = Quill.import('parchment');

// =================================================================
// 1. НАСТРОЙКА ВЫРАВНИВАНИЯ (ALIGN) ЧЕРЕЗ STYLE
// =================================================================
// По умолчанию Quill использует классы (ql-align-center).
// Мы заменяем это на inline-стили (style="text-align: center"),
// чтобы верстка работала на фронтенде без лишних CSS файлов.
const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

// =================================================================
// 2. НАСТРОЙКА МЕЖДУСТРОЧНОГО ИНТЕРВАЛА
// =================================================================
const LineHeightStyle = new Parchment.Attributor.Style('line-height', 'line-height', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0']
});
Quill.register(LineHeightStyle, true);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number; 
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  required = false,
}: RichTextEditorProps) {
  
  // Конфигурация панели инструментов
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }], // Заголовки
      ['bold', 'italic', 'underline', 'strike'], // Форматирование текста
      
      [{ 'color': [] }, { 'background': [] }], // Цвет текста и фона
      
      // Выравнивание (теперь работает через style="text-align:...")
      [{ 'align': [] }],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Списки
      
      // Наш кастомный междустрочный интервал
      [{ 'line-height': ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'] }],

      ['link', 'clean'], // Ссылки и очистка формата
    ],
  };

  // Разрешенные форматы (white-list)
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',       // Важно: align должен быть в списке
    'list', 'bullet',
    'line-height', // Важно: line-height должен быть в списке
    'link'
  ];

  return (
    <div className="space-y-2 rich-text-editor-wrapper">
      {label && (
        <Label>
          {label} {required && '*'}
        </Label>
      )}
      <div className="bg-white rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[150px]" 
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Совет: Если выравнивание не обновилось на сайте, выделите текст в редакторе, 
        нажмите кнопку выравнивания еще раз и сохраните пост.
      </p>
    </div>
  );
}