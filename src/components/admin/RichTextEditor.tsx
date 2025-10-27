import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
  rows = 8,
}: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && '*'}
        </Label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Сейчас используется простой текстовый редактор. Поддержка форматирования будет добавлена
        позже.
      </p>
    </div>
  );
}
