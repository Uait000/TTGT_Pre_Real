import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Contest } from '@/api/config';

interface ContestCardProps {
  contest: Contest;
}

export default function ContestCard({ contest }: ContestCardProps) {
  const [showSubdocs, setShowSubdocs] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {contest.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={contest.image_url}
            alt={contest.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{contest.title}</CardTitle>
        {contest.description && (
          <p className="text-sm text-muted-foreground mt-2">{contest.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {contest.pdf_files && contest.pdf_files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Основные документы:</p>
            {contest.pdf_files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm font-medium truncate">{file.title}</span>
                <Download className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        )}

        {contest.subdocuments && contest.subdocuments.length > 0 && (
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubdocs(!showSubdocs)}
              className="w-full justify-between"
            >
              <span className="text-sm font-medium">
                Дополнительные документы ({contest.subdocuments.length})
              </span>
              {showSubdocs ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showSubdocs && (
              <div className="space-y-2 mt-2">
                {contest.subdocuments.map((subdoc) => (
                  <a
                    key={subdoc.id}
                    href={subdoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group text-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{subdoc.title}</span>
                    <Download className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
