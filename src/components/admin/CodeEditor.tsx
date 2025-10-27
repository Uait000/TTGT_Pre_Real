import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Save,
  Search,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { filesApi } from '@/api/files';
import type { FileInfo } from '@/api/files';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

export default function CodeEditor() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const files = await filesApi.getAll();
      const tree = buildFileTree(files);
      setFileTree(tree);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const buildFileTree = (files: FileInfo[]): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap: { [key: string]: FileNode } = {};

    files.forEach((file) => {
      const parts = file.path.split('/');
      let currentLevel = tree;

      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const folderPath = parts.slice(0, i + 1).join('/');

        if (!folderMap[folderPath]) {
          const folder: FileNode = {
            name: folderName,
            path: folderPath,
            type: 'folder',
            children: [],
          };
          folderMap[folderPath] = folder;
          currentLevel.push(folder);
        }

        currentLevel = folderMap[folderPath].children!;
      }

      currentLevel.push({
        name: file.name,
        path: file.path,
        type: 'file',
      });
    });

    return tree;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = async (file: FileInfo) => {
    setSelectedFile(file);
    try {
      const response = await fetch(file.url);
      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить содержимое файла',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setSaving(true);
    try {
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const file = new File([blob], selectedFile.name, { type: 'text/plain' });

      await filesApi.upload(file, selectedFile.path.split('/').slice(0, -1).join('/'));

      toast({
        title: 'Успешно',
        description: 'Файл сохранен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить файл',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => {
      if (node.type === 'folder') {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <div
              className="flex items-center gap-1 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => toggleFolder(node.path)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`flex items-center gap-2 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm ${
            selectedFile?.path === node.path ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 28}px` }}
          onClick={() => handleFileSelect({ name: node.name, path: node.path, url: '', size: 0, type: 'text/plain' })}
        >
          <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{node.name}</span>
        </div>
      );
    });
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden bg-background">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск файлов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            ФАЙЛЫ САЙТА
          </div>
          {renderFileTree(fileTree)}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 overflow-auto">
                <div className="flex">
                  <div className="w-12 bg-muted/30 border-r border-border flex-shrink-0 select-none">
                    {fileContent.split('\n').map((_, i) => (
                      <div key={i} className="text-xs text-muted-foreground text-right px-2 leading-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="flex-1 min-h-full resize-none border-0 rounded-none font-mono text-sm leading-6"
                    placeholder="Содержимое файла..."
                    style={{ tabSize: 2 }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Выберите файл для редактирования</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
