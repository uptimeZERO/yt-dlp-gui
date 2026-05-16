import { Component, inject, OnInit } from "@angular/core";
import { YtDlpStore } from "../../core/state/yt-dlp.store";

@Component({
  selector: "app-title",
  imports: [],
  templateUrl: "./title.component.html",
  styleUrl: "./title.component.scss",
})
export class TitleComponent implements OnInit {
  readonly ytDlpStore = inject(YtDlpStore);

  ngOnInit(): void {
    void this.ytDlpStore.checkAvailability();
  }

  locateYtDlp(): void {
    void this.ytDlpStore.locateYtDlp();
  }
}
