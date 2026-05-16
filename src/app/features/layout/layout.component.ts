import { Component, inject } from "@angular/core";
import { SearchComponent } from "../search/search.component";
import { TitleComponent } from "../title/title.component";
import { DownloadConfigStore } from "../../core/state/download-config.store";
import { VideoListComponent } from "../video-list/video-list.component";
import { MediaStore } from "../../core/state/media.store";

@Component({
  selector: "app-layout",
  imports: [TitleComponent, SearchComponent, VideoListComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  readonly configStore = inject(DownloadConfigStore);
  readonly mediaStore = inject(MediaStore);

  async handleSearch(source: string): Promise<void> {
    const normalizedSource = source.trim();

    this.configStore.setSource(normalizedSource);
    await this.mediaStore.loadFromSource(normalizedSource);
  }
}
