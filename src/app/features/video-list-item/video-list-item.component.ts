import { Component, input } from "@angular/core";
import type { Media } from "../../../core/state/media.store";

@Component({
  selector: "app-video-list-item",
  imports: [],
  templateUrl: "./video-list-item.component.html",
  styleUrl: "./video-list-item.component.scss",
})
export class VideoListItemComponent {
  readonly video = input.required<Media>();
}
