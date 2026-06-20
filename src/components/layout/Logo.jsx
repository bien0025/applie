// Applie brand mark. When the sidebar is COLLAPSED we show the logo image
// (it's a recognizable square in the rail). When it's OPEN we swap to the
// Allura wordmark so the brand reads as text. Either way, just one element.
export default function Logo({ expanded = true }) {
  if (expanded) {
    return (
      <span className="whitespace-nowrap font-display text-4xl leading-none text-primary">
        Applie
      </span>
    );
  }
  return (
    <img
      src="/applie-logo.png"
      alt="Applie"
      className="h-9 w-9 shrink-0 rounded-lg"
    />
  );
}
