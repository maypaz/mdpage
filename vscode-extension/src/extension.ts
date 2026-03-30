import * as vscode from "vscode";

const MAX_MARKDOWN_CHARS = 500_000;

function getMarkdownToPublish(editor: vscode.TextEditor): string | undefined {
  const doc = editor.document;
  const selection = editor.selection;

  if (!selection.isEmpty) {
    return doc.getText(selection).trim();
  }

  if (doc.languageId === "markdown" || doc.languageId === "mdx") {
    return doc.getText().trim();
  }

  return undefined;
}

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand("mdpage.publish", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      void vscode.window.showErrorMessage("No active editor.");
      return;
    }

    const markdown = getMarkdownToPublish(editor);
    if (!markdown) {
      void vscode.window.showErrorMessage("Select Markdown or open Markdown / MDX file.");
      return;
    }

    if (markdown.length > MAX_MARKDOWN_CHARS) {
      void vscode.window.showErrorMessage("Content too large (max 500KB).");
      return;
    }

    const config = vscode.workspace.getConfiguration("mdpage");
    const baseUrl = normalizeBaseUrl(config.get<string>("baseUrl", "https://md.page"));
    const publishUrl = `${baseUrl}/api/publish`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Publishing to md.page…",
        cancellable: false,
      },
      async () => {
        try {
          const response = await fetch(publishUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "mdpage-vscode/0.1.0",
            },
            body: JSON.stringify({ markdown }),
          });

          const bodyText = await response.text();
          let data: { url?: string; expires_at?: string; error?: string };
          try {
            data = JSON.parse(bodyText) as typeof data;
          } catch {
            void vscode.window.showErrorMessage(`Invalid response from md.page (${response.status}).`);
            return;
          }

          if (!response.ok) {
            if (response.status === 429) {
              void vscode.window.showErrorMessage("Rate limit exceeded (max 60 publishes per hour).");
              return;
            }
            if (response.status === 413) {
              void vscode.window.showErrorMessage("Content too large (max 500KB).");
              return;
            }
            void vscode.window.showErrorMessage(data.error ?? `Publish failed (${response.status}).`);
            return;
          }

          const url = data.url;
          if (!url) {
            void vscode.window.showErrorMessage("No URL in response.");
            return;
          }

          const expiry =
            data.expires_at != null
              ? ` Expires ${new Date(data.expires_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}.`
              : "";

          const choice = await vscode.window.showInformationMessage(
            `Published: ${url}${expiry}`,
            "Open in browser",
            "Copy link",
          );

          if (choice === "Open in browser") {
            await vscode.env.openExternal(vscode.Uri.parse(url));
          } else if (choice === "Copy link") {
            await vscode.env.clipboard.writeText(url);
            void vscode.window.showInformationMessage("Link copied to clipboard.");
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          void vscode.window.showErrorMessage(`Publish failed: ${message}`);
        }
      },
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
