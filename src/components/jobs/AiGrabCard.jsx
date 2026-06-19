import { Wand2 } from 'lucide-react';

// Dark promo card for the Chrome extension's auto-fill.
// Uses the design system's dark surface (#1C1917) so it stands out in both modes.
export default function AiGrabCard({ onGrab }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#1C1917] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <Wand2 size={20} className="mt-0.5 flex-shrink-0 text-accent" />
        <div>
          <h2 className="text-md font-semibold">Auto-fill with Extension</h2>
          <p className="mt-1 max-w-md text-sm text-[#A8A29E]">
            Browsing a job post? Click the Applie extension to instantly parse
            the details and save it to your pipeline.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onGrab}
        className="flex-shrink-0 rounded bg-white px-4 py-2 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F5F5F4]"
      >
        Simulate AI Grab
      </button>
    </div>
  );
}
