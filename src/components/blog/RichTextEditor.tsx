import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image, 
  Table,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your blog post..." 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText('**', '**', 'bold text'), label: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*', 'italic text'), label: 'Italic' },
    { icon: Heading1, action: () => insertText('# ', '', 'Heading 1'), label: 'H1' },
    { icon: Heading2, action: () => insertText('## ', '', 'Heading 2'), label: 'H2' },
    { icon: Heading3, action: () => insertText('### ', '', 'Heading 3'), label: 'H3' },
    { icon: List, action: () => insertText('- ', '', 'List item'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. ', '', 'Numbered item'), label: 'Numbered List' },
    { icon: Quote, action: () => insertText('> ', '', 'Quote'), label: 'Quote' },
    { icon: Code, action: () => insertText('`', '`', 'code'), label: 'Inline Code' },
  ];

  const insertLink = () => {
    if (linkUrl && linkText) {
      insertText(`[${linkText}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const insertTable = () => {
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    insertText(tableTemplate);
  };

  const insertCodeBlock = () => {
    insertText('```\n', '\n```', 'code block');
  };

  // Word count calculation
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.max(1, Math.round(wordCount / 250));

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.label}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
            
            <div className="w-px bg-border h-6 mx-1" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(true)}
              title="Insert Link"
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTable}
              title="Insert Table"
              className="h-8 w-8 p-0"
            >
              <Table className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={insertCodeBlock}
              title="Code Block"
              className="h-8 w-8 p-0"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="w-px bg-border h-6 mx-1" />

            <Button
              variant={showPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title="Toggle Preview"
              className="h-8 px-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>

          {/* Link Dialog */}
          {showLinkDialog && (
            <Card className="p-4 bg-muted">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkText">Link Text</Label>
                  <Input
                    id="linkText"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text"
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={insertLink} size="sm">Insert Link</Button>
                <Button variant="outline" onClick={() => setShowLinkDialog(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Editor/Preview Tabs */}
          <Tabs value={showPreview ? "preview" : "editor"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" onClick={() => setShowPreview(false)}>
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[400px] font-mono text-sm resize-none"
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <div 
                className="min-h-[400px] p-4 bg-background border rounded-md prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
              />
            </TabsContent>
          </Tabs>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <div className="flex gap-4">
              <span>{wordCount} words</span>
              <span>{readingTime} min read</span>
            </div>
            <div className="text-xs">
              Supports Markdown formatting
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;