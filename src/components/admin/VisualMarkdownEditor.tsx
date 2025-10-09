import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from "lucide-react";

interface VisualMarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

interface ImageData {
  id: string;
  src: string;
  alt: string;
  width: number;
  position: 'left' | 'right' | 'center' | 'none';
}

const parseMarkdownImages = (markdown: string): ImageData[] => {
  const images: ImageData[] = [];
  const regex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"(left|right|center|none)")?\)/gim;
  let match;
  let index = 0;
  while ((match = regex.exec(markdown)) !== null) {
    images.push({
      id: `img-${index++}`,
      src: match[2],
      alt: match[1],
      width: 300,
      position: (match[3] as any) || 'none'
    });
  }
  return images;
};

const buildMarkdownFromImages = (images: ImageData[], textContent: string): string => {
  let result = textContent;
  images.forEach(img => {
    const posStr = img.position !== 'none' ? ` "${img.position}"` : '';
    const mdImage = `![${img.alt}](${img.src}${posStr})`;
    result = `${mdImage}\n\n${result}`;
  });
  return result;
};

const VisualMarkdownEditor: React.FC<VisualMarkdownEditorProps> = ({ value, onChange }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [textContent, setTextContent] = useState("");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const imgs = parseMarkdownImages(value);
    setImages(imgs);
    const cleanText = value.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gim, '').trim();
    setTextContent(cleanText);
  }, [value]);

  const updateMarkdown = (newImages: ImageData[], newText: string) => {
    const md = buildMarkdownFromImages(newImages, newText);
    onChange(md);
  };

  const handleImageResize = (id: string, newWidth: number) => {
    const updated = images.map(img => 
      img.id === id ? { ...img, width: Math.max(100, Math.min(800, newWidth)) } : img
    );
    setImages(updated);
    updateMarkdown(updated, textContent);
  };

  const handleImagePosition = (id: string, position: ImageData['position']) => {
    const updated = images.map(img => 
      img.id === id ? { ...img, position } : img
    );
    setImages(updated);
    updateMarkdown(updated, textContent);
  };

  const handleImageDelete = (id: string) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    updateMarkdown(updated, textContent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextContent(newText);
    updateMarkdown(images, newText);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    setSelectedImageId(id);
  };

  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
      <div className="min-h-[500px] p-4 relative">
        {/* Images */}
        {images.map((img) => {
          const isSelected = selectedImageId === img.id;
          let positionClass = '';
          let containerStyle: React.CSSProperties = { width: img.width };

          if (img.position === 'left') {
            positionClass = 'float-left mr-4 mb-4';
          } else if (img.position === 'right') {
            positionClass = 'float-right ml-4 mb-4';
          } else if (img.position === 'center') {
            positionClass = 'mx-auto block';
            containerStyle = { ...containerStyle, marginLeft: 'auto', marginRight: 'auto' };
          }

          return (
            <div
              key={img.id}
              className={`relative group cursor-move ${positionClass}`}
              style={containerStyle}
              onMouseDown={(e) => handleMouseDown(e, img.id)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto rounded-lg shadow-md"
                draggable={false}
              />
              
              {isSelected && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
              )}
              
              <div
                className="resize-handle absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startWidth = img.width;
                  
                  const handleResize = (moveEvent: MouseEvent) => {
                    const delta = moveEvent.clientX - startX;
                    handleImageResize(img.id, startWidth + delta);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              
              <div className="absolute top-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 rounded p-1 backdrop-blur-sm">
                <Button
                  size="sm"
                  variant={img.position === 'left' ? 'default' : 'ghost'}
                  className="h-7 w-7 p-0"
                  onClick={() => handleImagePosition(img.id, 'left')}
                  title="Float Left"
                >
                  <AlignLeft className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={img.position === 'center' ? 'default' : 'ghost'}
                  className="h-7 w-7 p-0"
                  onClick={() => handleImagePosition(img.id, 'center')}
                  title="Center"
                >
                  <AlignCenter className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={img.position === 'right' ? 'default' : 'ghost'}
                  className="h-7 w-7 p-0"
                  onClick={() => handleImagePosition(img.id, 'right')}
                  title="Float Right"
                >
                  <AlignRight className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 ml-auto hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleImageDelete(img.id)}
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}

        <textarea
          ref={textareaRef}
          value={textContent}
          onChange={handleTextChange}
          placeholder="Write your story here... Images will float around your text."
          className="w-full min-h-[400px] bg-transparent border-none outline-none resize-none text-lg leading-relaxed p-0"
          style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
        />
      </div>
      
      <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30 flex items-center justify-between">
        <span>Visual mode: Hover image for toolbar, drag corner to resize, text wraps automatically</span>
        {selectedImageId && (
          <span className="text-primary font-medium">Image selected</span>
        )}
      </div>
    </div>
  );
};

export default VisualMarkdownEditor;
