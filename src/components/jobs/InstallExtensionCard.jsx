import { Puzzle, ExternalLink } from 'lucide-react';

// TODO: replace with your published Chrome Web Store URL after publishing.
//       Until then, this links to the Chrome Web Store homepage.
const EXTENSION_URL = 'https://chrome.google.com/webstore/category/extensions';

// Dark promo card for the Applie Chrome extension. Uses the design system's
// dark surface (#1C1917) so it stands out on the page.
export default function InstallExtensionCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#1C1917] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <Puzzle size={20} className="mt-0.5 flex-shrink-0 text-accent" />
        <div>
          <h2 className="text-md font-semibold">Auto-fill with Extension</h2>
          <p className="mt-1 max-w-md text-sm text-[#A8A29E]">
            Install the Applie Chrome extension to save any job listing to your
            pipeline in one click.
          </p>
        </div>
      </div>

      <a
        href={EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-shrink-0 items-center gap-2 rounded bg-white px-4 py-2 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F5F5F4]"
      >
        Get the Extension
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
