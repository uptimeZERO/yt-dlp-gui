import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchComponent } from "./search.component";

describe("SearchComponent", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates the search form", () => {
    expect(component).toBeTruthy();
  });

  it("emits a trimmed source when submitted", () => {
    const submittedSpy = jest.fn();
    component.submitted.subscribe(submittedSpy);
    component.source = "  https://example.com/video  ";

    component.submit();

    expect(submittedSpy).toHaveBeenCalledWith("https://example.com/video");
  });

  it("does not emit for a blank source", () => {
    const submittedSpy = jest.fn();
    component.submitted.subscribe(submittedSpy);
    component.source = "   ";

    component.submit();

    expect(submittedSpy).not.toHaveBeenCalled();
  });
});
