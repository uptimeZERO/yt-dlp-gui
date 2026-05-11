import { Component, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-search",
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent {
  readonly submitted = output<string>();

  source = "";

  submit(): void {
    const source = this.source.trim();

    if (!source) {
      return;
    }

    this.submitted.emit(source);
  }
}
