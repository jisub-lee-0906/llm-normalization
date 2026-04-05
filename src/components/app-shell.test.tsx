import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { copyToClipboardMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/utils/clipboard", () => ({
  copyToClipboard: copyToClipboardMock,
}));

import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  beforeEach(() => {
    copyToClipboardMock.mockClear();

    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  });

  it("updates normalized output after paste", async () => {
    const user = userEvent.setup();

    render(<AppShell />);

    await user.type(
      screen.getByPlaceholderText(/여기에 붙여넣으세요/i),
      "## Heading\n\n**bold** text[1]",
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/정리 결과가 여기에 표시됩니다./i)).toHaveValue(
        "Heading\n\nbold text",
      );
      expect(screen.getByText(/Removed from source/i)).toBeInTheDocument();
    });
  });

  it("copies normalized output", async () => {
    const user = userEvent.setup();

    render(<AppShell />);

    await user.type(screen.getByPlaceholderText(/여기에 붙여넣으세요/i), "Text[1]");
    const copyButton = await screen.findByRole("button", { name: "복사" });

    await waitFor(() => {
      expect(copyButton).toBeEnabled();
      expect(screen.getByPlaceholderText(/정리 결과가 여기에 표시됩니다./i)).toHaveValue("Text");
    });

    await user.click(copyButton);

    expect(copyToClipboardMock).toHaveBeenCalledWith("Text");
  });
});
