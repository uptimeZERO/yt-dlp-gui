import { inject, Injectable, signal } from "@angular/core";
import { YtDlpService, YtDlpStatus } from "../services/yt-dlp.service";

@Injectable({
  providedIn: "root",
})
export class YtDlpStore {
  private readonly ytDlpService = inject(YtDlpService);

  private readonly installedSignal = signal(false);
  private readonly versionSignal = signal<string | undefined>(undefined);
  private readonly executablePathSignal = signal<string | undefined>(undefined);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly installed = this.installedSignal.asReadonly();
  readonly version = this.versionSignal.asReadonly();
  readonly executablePath = this.executablePathSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async checkAvailability(): Promise<void> {
    await this.updateStatus(() => this.ytDlpService.checkYtDlp());
  }

  async locateYtDlp(): Promise<void> {
    await this.updateStatus(() => this.ytDlpService.locateYtDlp());
  }

  private async updateStatus(
    loadStatus: () => Promise<YtDlpStatus>,
  ): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      this.applyStatus(await loadStatus());
    } catch (error) {
      this.installedSignal.set(false);
      this.versionSignal.set(undefined);
      this.errorSignal.set(
        error instanceof Error ? error.message : "Failed to check yt-dlp.",
      );
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private applyStatus(status: YtDlpStatus): void {
    this.installedSignal.set(status.installed);
    this.versionSignal.set(status.version);
    this.executablePathSignal.set(status.installed ? status.path : undefined);
    this.errorSignal.set(status.error ?? null);
  }
}
