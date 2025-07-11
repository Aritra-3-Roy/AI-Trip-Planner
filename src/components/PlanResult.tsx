
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { renderMarkdown } from "@/utils/markdown";
import { Download, Clipboard, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface PlanResultProps {
  markdownContent: string;
}

const PlanResult: React.FC<PlanResultProps> = ({ markdownContent }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The travel plan has been copied to your clipboard."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel-plan.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your travel plan is being downloaded as a markdown file."
    });
  };

  const htmlContent = renderMarkdown(markdownContent);

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 animate-fade-in-up">
      <Card className="rounded-xl overflow-hidden soft-shadow">
        <div className="bg-primary/5 p-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-lg">Your Travel Plan</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div 
            className="markdown-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanResult;
