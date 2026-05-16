import { Component, inject } from "@angular/core";
import { MediaStore } from "../../core/state/media.store";
import { VideoListItemComponent } from "./video-list-item/video-list-item.component";

@Component({
  selector: "app-video-list",
  imports: [VideoListItemComponent],
  templateUrl: "./video-list.component.html",
  styleUrl: "./video-list.component.scss",
})
export class VideoListComponent {
  private readonly mediaStore = inject(MediaStore);

  readonly videos = this.mediaStore.videos;
  readonly loading = this.mediaStore.loading;
  readonly error = this.mediaStore.error;
}
