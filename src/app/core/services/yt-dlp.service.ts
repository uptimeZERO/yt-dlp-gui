import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

export interface MediaInspection {
  title: string;
  webpageUrl: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  uploader?: string;
}

@Injectable({
  providedIn: "root",
})
export class YtDlpService {
  normalizeSource(source: string): string {
    return source.trim();
  }

  inspectMedia(source: string): Promise<MediaInspection> {
    return invoke<MediaInspection>("inspect_media", {
      source: this.normalizeSource(source),
    });
  }
}
