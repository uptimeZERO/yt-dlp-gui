import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates the app shell", () => {
    expect(component).toBeTruthy();
  });

  it("stores a trimmed search source", () => {
    component.handleSearch("  https://example.com/watch?v=123  ");

    expect(component.selectedSource).toBe("https://example.com/watch?v=123");
    expect(component.statusMessage).toBe(
      "Ready to inspect: https://example.com/watch?v=123",
    );
  });
});
