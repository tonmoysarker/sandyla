"use client";

export function GiscusComments({ repo, category }: { repo: string; category: string }) {
  return (
    <div
      ref={(node) => {
        if (!node || node.childElementCount > 0) return;
        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.setAttribute("data-repo", repo);
        script.setAttribute("data-category", category);
        script.setAttribute("data-mapping", "pathname");
        script.setAttribute("data-theme", "noborder_dark");
        node.appendChild(script);
      }}
    />
  );
}
