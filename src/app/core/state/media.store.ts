import { computed, inject, Injectable, signal } from "@angular/core";
import { YtDlpService } from "../services/yt-dlp.service";
import { YtDlpStore } from "./yt-dlp.store";

export interface Media {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  duration: number;
  channel: string;
  views: number;
  dateUploaded?: Date;
  isHD: boolean;
  is2K: boolean;
  is4K: boolean;
  selected: boolean;
}

@Injectable({
  providedIn: "root",
})
export class MediaStore {
  private readonly ytDlpService = inject(YtDlpService);
  private readonly ytDlpStore = inject(YtDlpStore);

  private readonly videosSignal = signal<Media[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly videos = this.videosSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly selectedVideos = computed(() =>
    this.videosSignal().filter((video) => video.selected),
  );

  readonly hasVideos = computed(() => this.videosSignal().length > 0);

  async loadFromSource(source: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const videos = await this.ytDlpService.inspectMedia(
        source,
        this.ytDlpStore.executablePath(),
      );
      this.videosSignal.set(videos);
    } catch (error) {
      this.videosSignal.set([]);
      this.errorSignal.set(
        error instanceof Error ? error.message : "Failed to inspect media.",
      );
    } finally {
      this.loadingSignal.set(false);
    }
  }

  toggleSelected(id: string): void {
    this.videosSignal.update((videos) =>
      videos.map((video) =>
        video.id === id ? { ...video, selected: !video.selected } : video,
      ),
    );
  }

  setSelected(id: string, selected: boolean): void {
    this.videosSignal.update((videos) =>
      videos.map((video) => (video.id === id ? { ...video, selected } : video)),
    );
  }

  clear(): void {
    this.videosSignal.set([]);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }
}
