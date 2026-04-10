"use client";

import { useState } from "react";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Settings2,
  Check,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "./language-selector";
import { ToneSelector } from "./tone-selector";
import { PlatformCheckboxes } from "./platform-checkboxes";
import type {
  Language,
  Platform,
  Tone,
  InstagramFormat,
  CopyModel,
  ImageModel,
  HashtagDensity,
  CopyLength,
  ImageDimensionPreset,
  ImageDimensions,
} from "@/lib/types";
import { IMAGE_SIZE_OPTIONS } from "@/lib/client-types";
import { useTranslation } from "@/contexts/language-context";

type GenerationMode = "gemini" | "canva";
type TemplateType = "post" | "story" | "carousel" | "reel";

interface ContentGeneratorProps {
  platforms: Platform[];
  onPlatformToggle: (p: Platform) => void;
  instagramFormat: InstagramFormat;
  onFormatChange: (f: InstagramFormat) => void;
  carouselSlides: number;
  onSlidesChange: (n: number) => void;
  slideDescriptions: string[];
  onSlideDescriptionChange: (index: number, value: string) => void;
  tone: Tone;
  onToneChange: (v: Tone) => void;
  language: Language;
  onLanguageChange: (v: Language) => void;
  topic: string;
  onTopicChange: (v: string) => void;
  enableVariants: boolean;
  onVariantsChange: (v: boolean) => void;
  generateImagesTogether: boolean;
  onGenerateImagesToggle: (v: boolean) => void;
  // Advanced settings
  copyModel: CopyModel;
  onCopyModelChange: (v: CopyModel) => void;
  imageModel: ImageModel;
  onImageModelChange: (v: ImageModel) => void;
  temperature: number;
  onTemperatureChange: (v: number) => void;
  hashtagDensity: HashtagDensity;
  onHashtagDensityChange: (v: HashtagDensity) => void;
  copyLength: CopyLength;
  onCopyLengthChange: (v: CopyLength) => void;
  maxImages: number;
  onMaxImagesChange: (v: number) => void;
  imageDimensionPreset: ImageDimensionPreset;
  onImageDimensionPresetChange: (v: ImageDimensionPreset) => void;
  customDimensions: ImageDimensions;
  onCustomDimensionsChange: (v: ImageDimensions) => void;
  // Actions
  onGenerate: () => void;
  isAnyLoading: boolean;
  canGenerate: boolean;
  onBack: () => void;
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<T, string>;
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            value === opt
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
              : "bg-indigo-50 text-indigo-700 hover:text-indigo-900"
          }`}
        >
          {labels?.[opt] ?? opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}

function TemplateCard({
  type,
  label,
  selected,
  onToggle,
}: {
  type: TemplateType;
  label: string;
  selected: boolean;
  onToggle: (t: TemplateType) => void;
}) {
  return (
    <button
      onClick={() => onToggle(type)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
        selected
          ? "border-violet-500 bg-violet-50"
          : "border-gray-200 bg-white hover:border-violet-300"
      }`}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          selected
            ? "border-violet-500 bg-violet-500"
            : "border-gray-300 bg-white"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={`text-sm font-medium ${
          selected ? "text-violet-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function getSlidePlaceholder(index: number, total: number): string {
  if (index === 0) return "Hook / title slide (e.g. eye-catching question)";
  if (index === total - 1) return "CTA / closing slide (e.g. call to action)";
  return `Key point ${index} (e.g. feature, benefit, stat)`;
}

export function ContentGenerator({
  platforms,
  onPlatformToggle,
  instagramFormat,
  onFormatChange,
  carouselSlides,
  onSlidesChange,
  slideDescriptions,
  onSlideDescriptionChange,
  tone,
  onToneChange,
  language,
  onLanguageChange,
  topic,
  onTopicChange,
  enableVariants,
  onVariantsChange,
  generateImagesTogether,
  onGenerateImagesToggle,
  copyModel,
  onCopyModelChange,
  imageModel,
  onImageModelChange,
  temperature,
  onTemperatureChange,
  hashtagDensity,
  onHashtagDensityChange,
  copyLength,
  onCopyLengthChange,
  maxImages,
  onMaxImagesChange,
  imageDimensionPreset,
  onImageDimensionPresetChange,
  customDimensions,
  onCustomDimensionsChange,
  onGenerate,
  isAnyLoading,
  canGenerate,
  onBack,
}: ContentGeneratorProps) {
  const { t } = useTranslation();
  const showInstagramFormat = platforms.includes("instagram");
  const showCarouselDescriptions =
    showInstagramFormat && instagramFormat === "carousel";

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [genMode, setGenMode] = useState<GenerationMode>("gemini");
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateType[]>([
    "post",
  ]);
  const [imgSize, setImgSize] = useState<string>("auto");
  const [extraInfo, setExtraInfo] = useState<string>("");
  const [numPosts, setNumPosts] = useState<number>(1);

  const toggleTemplate = (type: TemplateType) => {
    setSelectedTemplates((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const generateButtonText = () => {
    const postWord = numPosts === 1 ? "contenuto" : "contenuti";
    if (genMode === "gemini") {
      return `Genera ${numPosts} ${postWord} con Gemini Pro`;
    } else {
      return `Genera ${numPosts} ${postWord} da Template`;
    }
  };

  return (
    <div className="rounded-xl border border-card-border bg-surface p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("contentGenerator.heading")}
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("contentGenerator.backButton")}
        </button>
      </div>

      {/* Generation Mode Selector */}
      <div className="space-y-3">
        <Label className="text-xs text-text-secondary">ModalitÃ  Generazione</Label>
        <div className="flex gap-3">
          <button
            onClick={() => setGenMode("gemini")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
              genMode === "gemini"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
            }`}
          >
            Genera con AI â Gemini 2.5 Pro
          </button>
          <button
            onClick={() => setGenMode("canva")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
              genMode === "canva"
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
            }`}
          >
            Template Canva â Brand Kit + Template
          </button>
        </div>
      </div>

      {/* Mode-specific info banner */}
      {genMode === "gemini" && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            Gemini 2.5 Pro genera testi + grafiche insieme. Il Brand Kit Canva
            del cliente viene usato come riferimento stilistico.
          </p>
        </div>
      )}

      {genMode === "canva" && (
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <p className="text-sm text-purple-800">
            Seleziona i template Canva da utilizzare per le tue grafiche.
            Combina testi generati con AI e template professionali.
          </p>
        </div>
      )}

      {/* Topic */}
      <div className="space-y-1.5">
        <Label className="text-xs text-text-secondary">
          {t("contentGenerator.topicLabel")}
        </Label>
        <Textarea
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder={t("contentGenerator.topicPlaceholder")}
          rows={3}
          className="bg-input-bg border-input-border text-text-primary placeholder:text-text-muted focus-visible:ring-input-focus/30 focus-visible:border-input-focus resize-y"
        />
      </div>

      {/* Platforms */}
      <PlatformCheckboxes selected={platforms} onToggle={onPlatformToggle} />

      {/* Instagram format toggle */}
      {showInstagramFormat && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">
              {t("contentGenerator.instagramFormatLabel")}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={instagramFormat === "carousel" ? "default" : "outline"}
                size="sm"
                onClick={() => onFormatChange("carousel")}
                className={
                  instagramFormat === "carousel"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
                    : "border-input-border text-text-secondary hover:bg-input-bg hover:text-text-primary"
                }
              >
                {t("contentGenerator.carousel")}
              </Button>
              <Button
                variant={instagramFormat === "single" ? "default" : "outline"}
                size="sm"
                onClick={() => onFormatChange("single")}
                className={
                  instagramFormat === "single"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
                    : "border-input-border text-text-secondary hover:bg-input-bg hover:text-text-primary"
                }
              >
                {t("contentGenerator.singlePost")}
              </Button>
            </div>
          </div>

          {/* Carousel slide count */}
          {instagramFormat === "carousel" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.numberOfSlides")} ({carouselSlides})
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">3</span>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={carouselSlides}
                  onChange={(e) => onSlidesChange(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 h-1.5 cursor-pointer"
                />
                <span className="text-xs text-text-muted">10</span>
              </div>
            </div>
          )}

          {/* Carousel slide descriptions */}
          {showCarouselDescriptions && (
            <div className="space-y-2">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.slideDescriptionsLabel")}
              </Label>
              <div className="space-y-1.5">
                {Array.from({ length: carouselSlides }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-text-muted w-5 text-right shrink-0">
                      {i + 1}
                    </span>
                    <Input
                      value={(slideDescriptions && slideDescriptions[i]) ?? ""}
                      onChange={(e) =>
                        onSlideDescriptionChange(i, e.target.value)
                      }
                      placeholder={getSlidePlaceholder(i, carouselSlides)}
                      className="h-8 text-xs bg-input-bg border-input-border text-text-primary placeholder:text-text-muted focus-visible:ring-input-focus/30 focus-visible:border-input-focus"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-muted">
                {t("contentGenerator.slideDescriptionsHint")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tone & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LanguageSelector value={language} onChange={onLanguageChange} />
        <ToneSelector value={tone} onChange={onToneChange} />
      </div>

      {/* Checkboxes row */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enableVariants}
            onChange={(e) => onVariantsChange(e.target.checked)}
            className="size-4 rounded border-input-border accent-indigo-600"
          />
          <span className="text-sm text-text-secondary">
            {t("contentGenerator.generateVariants")}
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={generateImagesTogether}
            onChange={(e) => onGenerateImagesToggle(e.target.checked)}
            className="size-4 rounded border-input-border accent-indigo-600"
          />
          <span className="text-sm text-text-secondary">
            {t("contentGenerator.generateImagesTogether")}
          </span>
          <span className="text-[11px] text-text-muted">
            {t("contentGenerator.generateImagesTogetherHint")}
          </span>
        </label>
      </div>

      {/* Gemini mode: Image size presets */}
      {genMode === "gemini" && (
        <div className="space-y-2">
          <Label className="text-xs text-text-secondary">
            Dimensioni Immagine
          </Label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "auto", label: "Auto" },
              { value: "1080x1080", label: "1080Ã1080" },
              { value: "1080x1350", label: "1080Ã1350" },
              { value: "1080x1920", label: "1080Ã1920" },
              { value: "1200x675", label: "1200Ã675" },
              { value: "1200x630", label: "1200Ã630" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setImgSize(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                  imgSize === opt.value
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Canva mode: Template selection */}
      {genMode === "canva" && (
        <div className="space-y-3">
          <Label className="text-xs text-text-secondary">
            Scegli Template Canva
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <TemplateCard
              type="post"
              label="Post Feed"
              selected={selectedTemplates.includes("post")}
              onToggle={toggleTemplate}
            />
            <TemplateCard
              type="story"
              label="Story"
              selected={selectedTemplates.includes("story")}
              onToggle={toggleTemplate}
            />
            <TemplateCard
              type="carousel"
              label="Carosello"
              selected={selectedTemplates.includes("carousel")}
              onToggle={toggleTemplate}
            />
            <TemplateCard
              type="reel"
              label="Reel Cover"
              selected={selectedTemplates.includes("reel")}
              onToggle={toggleTemplate}
            />
          </div>
        </div>
      )}

      {/* Quanti contenuti */}
      <div className="space-y-1.5">
        <Label className="text-xs text-text-secondary">
          Quanti contenuti desideri generare?
        </Label>
        <Input
          type="number"
          min={1}
          max={20}
          value={numPosts}
          onChange={(e) => setNumPosts(Math.max(1, Number(e.target.value)))}
          placeholder="Numero di contenuti"
          className="bg-input-bg border-input-border text-text-primary placeholder:text-text-muted focus-visible:ring-input-focus/30 focus-visible:border-input-focus"
        />
      </div>

      {/* Informazioni aggiuntive */}
      <div className="space-y-1.5">
        <Label className="text-xs text-text-secondary">
          Informazioni aggiuntive
        </Label>
        <Textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="Aggiungi dettagli specifici, vincoli, o istruzioni speciali..."
          rows={2}
          className="bg-input-bg border-input-border text-text-primary placeholder:text-text-muted focus-visible:ring-input-focus/30 focus-visible:border-input-focus resize-y"
        />
      </div>

      {/* Advanced Settings (collapsible) */}
      <div className="border border-card-border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors bg-indigo-50"
        >
          {showAdvanced ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          <Settings2 className="size-3.5" />
          {t("contentGenerator.advancedSettings")}
        </button>
        {showAdvanced && (
          <div className="border-t border-card-border bg-surface p-4 space-y-4">
            {/* Copy Model */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.copyModelLabel")}
              </Label>
              <ToggleGroup
                options={["base", "fast", "pro"] as CopyModel[]}
                value={copyModel}
                onChange={onCopyModelChange}
                labels={{ base: "Base", fast: "Fast", pro: "Pro" }}
              />
              <p className="text-[11px] text-text-muted">
                {copyModel === "base" &&
                  t("contentGenerator.copyModelBaseDesc")}
                {copyModel === "fast" &&
                  t("contentGenerator.copyModelFastDesc")}
                {copyModel === "pro" && t("contentGenerator.copyModelProDesc")}
              </p>
            </div>

            {/* Image Model */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.imageModelLabel")}
              </Label>
              <ToggleGroup
                options={["fast", "pro"] as ImageModel[]}
                value={imageModel}
                onChange={onImageModelChange}
                labels={{ fast: "Fast", pro: "Pro" }}
              />
              <p className="text-[11px] text-text-muted">
                {imageModel === "fast" &&
                  t("contentGenerator.imageModelFastDesc")}
                {imageModel === "pro" &&
                  t("contentGenerator.imageModelProDesc")}
              </p>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.creativityLabel")} (
                {temperature.toFixed(1)})
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-text-muted">
                  {t("contentGenerator.precise")}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => onTemperatureChange(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 h-1.5 cursor-pointer"
                />
                <span className="text-[11px] text-text-muted">
                  {t("contentGenerator.creative")}
                </span>
              </div>
            </div>

            {/* Copy Length */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.copyLengthLabel")}
              </Label>
              <ToggleGroup
                options={["short", "medium", "long"] as CopyLength[]}
                value={copyLength}
                onChange={onCopyLengthChange}
                labels={{ short: "Short", medium: "Medium", long: "Long" }}
              />
            </div>

            {/* Hashtag Density */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.hashtagCountLabel")}
              </Label>
              <ToggleGroup
                options={["few", "medium", "many"] as HashtagDensity[]}
                value={hashtagDensity}
                onChange={onHashtagDensityChange}
                labels={{
                  few: "Few (3)",
                  medium: "Medium (5)",
                  many: "Many (8)",
                }}
              />
            </div>

            {/* Max Images (non-carousel) */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.imagesPerPlatform")} ({maxImages})
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-text-muted">1</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={maxImages}
                  onChange={(e) => onMaxImagesChange(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 h-1.5 cursor-pointer"
                />
                <span className="text-[11px] text-text-muted">4</span>
              </div>
              <p className="text-[11px] text-text-muted">
                {t("contentGenerator.imagesPerPlatformHint")}
              </p>
            </div>

            {/* Image Dimensions */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">
                {t("contentGenerator.imageDimensionsLabel")}
              </Label>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { value: "auto", label: t("contentGenerator.dimAuto") },
                    { value: "1080x1080", label: "1080Ã1080" },
                    { value: "1080x1350", label: "1080Ã1350" },
                    { value: "1080x1920", label: "1080Ã1920" },
                    { value: "1200x675", label: "1200Ã675" },
                    { value: "1200x630", label: "1200Ã630" },
                    {
                      value: "custom",
                      label: t("contentGenerator.dimCustom"),
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      onImageDimensionPresetChange(
                        opt.value as ImageDimensionPreset
                      )
                    }
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                      imageDimensionPreset === opt.value
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                        : "bg-indigo-50 text-indigo-700 hover:text-indigo-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-text-muted">
                {imageDimensionPreset === "auto" &&
                  t("contentGenerator.dimAutoHint")}
                {imageDimensionPreset === "1080x1080" &&
                  "Instagram Square"}
                {imageDimensionPreset === "1080x1350" &&
                  "Instagram Portrait (4:5)"}
                {imageDimensionPreset === "1080x1920" &&
                  "Instagram Story / Reel (9:16)"}
                {imageDimensionPreset === "1200x675" &&
                  "Twitter / X (16:9)"}
                {imageDimensionPreset === "1200x630" &&
                  "Facebook / LinkedIn / OG (1.91:1)"}
              </p>
              {imageDimensionPreset === "custom" && (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={100}
                    max={4096}
                    value={customDimensions.width}
                    onChange={(e) =>
                      onCustomDimensionsChange({
                        ...customDimensions,
                        width: Number(e.target.value),
                      })
                    }
                    className="w-20 h-7 text-xs"
                    placeholder="W"
                  />
                  <span className="text-xs text-text-muted">Ã</span>
                  <Input
                    type="number"
                    min={100}
                    max={4096}
                    value={customDimensions.height}
                    onChange={(e) =>
                      onCustomDimensionsChange({
                        ...customDimensions,
                        height: Number(e.target.value),
                      })
                    }
                    className="w-20 h-7 text-xs"
                    placeholder="H"
                  />
                  <span className="text-[11px] text-text-muted">px</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`w-full text-white hover:opacity-90 disabled:opacity-40 ${
          genMode === "gemini"
            ? "bg-gradient-to-r from-blue-500 to-purple-600"
            : "bg-gradient-to-r from-purple-500 to-pink-600"
        }`}
      >
        {isAnyLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("contentGenerator.generatingLoadingText")}
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            {generateButtonText()}
          </>
        )}
      </Button>
    </div>
  );
}
