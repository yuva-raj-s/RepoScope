import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { notify } from "@/lib/notification";

type Provider = "gemini" | "openai" | "claude" | "cohere";

interface ProviderInfo {
  name: string;
  url: string;
  keyName: string;
  instructions: string;
}

const providers: Record<Provider, ProviderInfo> = {
  gemini: {
    name: "Google Gemini",
    url: "https://aistudio.google.com/app/apikeys",
    keyName: "GEMINI_API_KEY",
    instructions: "1. Visit Google AI Studio\n2. Click 'Get API Key'\n3. Create a new API key\n4. Copy and paste it here",
  },
  openai: {
    name: "OpenAI",
    url: "https://platform.openai.com/api-keys",
    keyName: "OPENAI_API_KEY",
    instructions: "1. Visit OpenAI Platform\n2. Navigate to API keys\n3. Create a new secret key\n4. Copy and paste it here",
  },
  claude: {
    name: "Anthropic Claude",
    url: "https://console.anthropic.com/",
    keyName: "CLAUDE_API_KEY",
    instructions: "1. Visit Anthropic Console\n2. Go to API keys section\n3. Create a new key\n4. Copy and paste it here",
  },
  cohere: {
    name: "Cohere",
    url: "https://dashboard.cohere.com/api-keys",
    keyName: "COHERE_API_KEY",
    instructions: "1. Visit Cohere Dashboard\n2. Navigate to API keys\n3. Create a new key\n4. Copy and paste it here",
  },
};

interface ApiSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: Provider, apiKey: string) => void;
}

export function ApiSetupModal({ open, onOpenChange, onSave }: ApiSetupModalProps) {
  const [provider, setProvider] = useState<Provider>("gemini");
  const [apiKey, setApiKey] = useState("");

  const providerInfo = providers[provider];

  const handleSave = () => {
    if (!apiKey.trim()) {
      notify.warning({
        title: "Please enter your API key",
        description: "API key cannot be empty",
      });
      return;
    }
    if (apiKey.length < 10) {
      notify.warning({
        title: "API key seems too short",
        description: "Please verify your API key is correct",
      });
      return;
    }
    onSave(provider, apiKey);
    setApiKey("");
    notify.success({
      title: "API configured successfully!",
      description: `Ready to analyze repositories with ${provider}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-chart-3" />
            Configure AI Provider
          </DialogTitle>
          <DialogDescription>
            Set up your own API key to avoid rate limits. Choose your preferred AI provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as Provider)}>
              <SelectTrigger id="provider" className="bg-gradient-to-r from-card to-card border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini (Recommended)</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="cohere">Cohere</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-card/50 border-primary/20">
              <p className="text-sm font-mono whitespace-pre-line text-muted-foreground leading-relaxed">
                {providerInfo.instructions}
              </p>
            </Card>

            <div className="space-y-3 flex flex-col justify-center">
              <a
                href={providerInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover-elevate transition-all text-sm font-medium"
              >
                Get {providerInfo.name} API Key
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser. It's never sent to our servers.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <Input
              id="apikey"
              type="password"
              placeholder={`Paste your ${providerInfo.name} API key here`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm bg-gradient-to-r from-card to-card border-primary/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Later
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1"
            >
              Save API Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
