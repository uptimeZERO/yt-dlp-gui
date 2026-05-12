import { Component, inject } from "@angular/core";
import { SearchComponent } from "../search/search.component";
import { TitleComponent } from "../title/title.component";
import { DownloadConfigStore } from "../../core/state/download-config.store";

@Component({
  selector: "app-layout",
  imports: [TitleComponent, SearchComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  readonly configStore = inject(DownloadConfigStore);

  handleSearch(source: string): void {
    this.configStore.setSource(source);
  }
}
