import { TestBed } from "@angular/core/testing";

import { YtDlpService } from "./yt-dlp.service";

describe("YtDlpService", () => {
  let service: YtDlpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YtDlpService);
  });

  it("normalizes media sources", () => {
    expect(service.normalizeSource("  https://example.com/video  ")).toBe(
      "https://example.com/video",
    );
  });
});
