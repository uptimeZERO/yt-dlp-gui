import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";
import type { Media } from "../state/media.store";

interface YtDlpMediaInspection {
  id?: string;
  webpage_url?: string;
  original_url?: string;
  url?: string;
  title: string;
  description?: string;
  duration?: number;
  view_count?: number;
  upload_date?: string;
  thumbnail?: string;
  thumbnails?: { url?: string }[];
  uploader?: string;
  channel?: string;
  height?: number;
  formats?: { height?: number | null }[];
}

interface YtDlpInspection extends YtDlpMediaInspection {
  entries?: YtDlpMediaInspection[];
}

export interface MediaInspection {
  title: string;
  webpageUrl: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  uploader?: string;
}

export interface YtDlpStatus {
  installed: boolean;
  version?: string;
  path?: string;
  error?: string;
}

@Injectable({
  providedIn: "root",
})
export class YtDlpService {
  normalizeSource(source: string): string {
    return source.trim();
  }

  checkYtDlp(): Promise<YtDlpStatus> {
    return invoke<YtDlpStatus>("check_yt_dlp");
  }

  locateYtDlp(): Promise<YtDlpStatus> {
    return invoke<YtDlpStatus>("locate_yt_dlp");
  }

  async inspectMedia(
    source: string,
    executablePath?: string,
  ): Promise<Media[]> {
    const inspection = await invoke<YtDlpInspection>("inspect_media", {
      source: this.normalizeSource(source),
      executablePath,
    });

    const entries = inspection.entries?.filter(
      (entry): entry is YtDlpMediaInspection => Boolean(entry),
    ) ?? [inspection];

    return entries.map((entry, index) => this.toMedia(entry, index));
  }

  private toMedia(entry: YtDlpMediaInspection, index: number): Media {
    const maxHeight = Math.max(
      entry.height ?? 0,
      ...(entry.formats ?? []).map((format) => format.height ?? 0),
    );

    return {
      id: entry.id ?? `media-${index}`,
      url: entry.webpage_url ?? entry.original_url ?? entry.url ?? "",
      thumbnailUrl: entry.thumbnail ?? this.lastThumbnailUrl(entry) ?? "",
      title: entry.title,
      description: entry.description,
      duration: Math.floor(entry.duration ?? 0),
      channel: entry.channel ?? entry.uploader ?? "",
      views: entry.view_count ?? 0,
      dateUploaded: this.parseUploadDate(entry.upload_date),
      isHD: maxHeight >= 720,
      is2K: maxHeight >= 1440,
      is4K: maxHeight >= 2160,
      selected: true,
    };
  }

  private lastThumbnailUrl(entry: YtDlpMediaInspection): string | undefined {
    const thumbnails = entry.thumbnails ?? [];

    for (let index = thumbnails.length - 1; index >= 0; index -= 1) {
      const thumbnailUrl = thumbnails[index].url;

      if (thumbnailUrl) {
        return thumbnailUrl;
      }
    }

    return undefined;
  }

  private parseUploadDate(uploadDate?: string): Date | undefined {
    if (!uploadDate || !/^\d{8}$/.test(uploadDate)) {
      return undefined;
    }

    const year = Number(uploadDate.slice(0, 4));
    const month = Number(uploadDate.slice(4, 6)) - 1;
    const day = Number(uploadDate.slice(6, 8));

    return new Date(Date.UTC(year, month, day));
  }
}
