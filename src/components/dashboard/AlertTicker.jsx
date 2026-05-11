export default function AlertTicker({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  const tickerText = alerts
    .map((a) => `🚨 ${a.title} - ${a.location_name}, ${a.province}`)
    .join('    •    ');

  return (
    <div className="bg-destructive text-white py-2 overflow-hidden relative">
      <div className="absolute inset-0 flex items-center">
        <div
          className="whitespace-nowrap animate-marquee"
          style={{ willChange: 'transform' }}
        >
          {tickerText} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {tickerText}
        </div>
      </div>
    </div>
  );
}
