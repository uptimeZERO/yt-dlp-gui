import { Component, inject } from "@angular/core";

import { SearchComponent } from "./features/search/search.component";
import { YtDlpService } from "./core/services/yt-dlp.service";

@Component({
  selector: "app-root",
  imports: [SearchComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  private readonly ytDlpService = inject(YtDlpService);

  selectedSource = "";
  statusMessage = "Paste a video, playlist, or channel URL to get started.";

  handleSearch(source: string): void {
    this.selectedSource = this.ytDlpService.normalizeSource(source);
    this.statusMessage = `Ready to inspect: ${this.selectedSource}`;
  }
}
