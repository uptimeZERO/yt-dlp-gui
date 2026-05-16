import { Component, inject } from "@angular/core";
import { SearchComponent } from "../search/search.component";
import { TitleComponent } from "../title/title.component";
import { DownloadConfigStore } from "../../core/state/download-config.store";
import { MediaStore } from "../../core/state/media.store";
import { VideoListItemComponent } from "../video-list/video-list-item/video-list-item.component";

@Component({
  selector: "app-layout",
  imports: [TitleComponent, SearchComponent, VideoListItemComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  readonly configStore = inject(DownloadConfigStore);
  readonly mediaStore = inject(MediaStore);
  readonly videos = this.mediaStore.videos;
  readonly loading = this.mediaStore.loading;
  readonly error = this.mediaStore.error;

  async handleSearch(source: string): Promise<void> {
    const normalizedSource = source.trim();

    this.configStore.setSource(normalizedSource);
    await this.mediaStore.loadFromSource(normalizedSource);
  }
}
