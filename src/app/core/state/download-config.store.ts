import { computed, Injectable, signal } from "@angular/core";

export interface DownloadConfig {
  source: string;
  format: "video" | "audio";
  outputTemplate: string;
  writeThumbnail: boolean;
  embedMetadata: boolean;
  extraArgs: string[];
}

const initialConfig: DownloadConfig = {
  source: "",
  format: "video",
  outputTemplate: "",
  writeThumbnail: false,
  embedMetadata: true,
  extraArgs: [],
};

@Injectable({
  providedIn: "root",
})
export class DownloadConfigStore {
  private readonly config = signal<DownloadConfig>(initialConfig);

  readonly value = this.config.asReadonly();

  readonly commandArgs = computed(() => {
    const config = this.config();

    return [
      config.source,
      config.format === "audio" ? "--extract-audio" : null,
      config.writeThumbnail ? "--write-thumbnail" : null,
      config.embedMetadata ? "--embed-metadata" : null,
      config.outputTemplate ? `--output=${config.outputTemplate}` : null,
      ...config.extraArgs,
    ].filter((arg): arg is string => arg !== null);
  });

  patchConfig(patch: Partial<DownloadConfig>): void {
    this.config.update((current) => ({
      ...current,
      ...patch,
    }));
  }

  setSource(source: string): void {
    this.patchConfig({ source });
  }

  reset(): void {
    this.config.set(initialConfig);
  }
}
