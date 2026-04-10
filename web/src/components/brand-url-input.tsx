"use client";

import { Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "./error-display";
import { useTranslation } from "@/contexts/language-context";

interface BrandUrlInputProps {
  url: string;
  onUrlChange: (v: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: { code: string; message: string } | null;
}

export function BrandUrlInput({
  url,
  onUrlChange,
  onAnalyze,
  isLoading,
  error,
}: BrandUrlInputProps) {
  const { t } = useTranslation();
  const canAnalyze = url.trim().length > 0 && !isLoading;

  return (
    <div className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo/10">
          <Globe className="size-4 text-indigo" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">
          {t('brandUrlInput.heading')}
        </h2>
      </div>

      <p className="text-sm text-text-secondary">
        {t('brandUrlInput.description')}
      </p>

      <Input
        type="url"
        placeholder={t('brandUrlInput.urlPlaceholder')}
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canAnalyze) onAnalyze();
        }}
        className="bg-input-bg border-input-border text-text-primary placeholder:text-text-muted focus-visible:ring-indigo/30 focus-visible:border-indigo"
      />

      <Button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        className="w-full bg-gradient-to-r from-indigo to-violet text-white hover:opacity-90 disabled:opacity-40 shadow-md shadow-indigo/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('brandUrlInput.analyzingLoadingText')}
          </>
        ) : (
          t('brandUrlInput.analyzeButton')
        )}
      </Button>

      {error && <ErrorDisplay code={error.code} message={error.message} />}
    </div>
  );
}
