import { statusConfig, severityConfig } from '../../lib/data';

export function DisasterBadge({ status }) {
  const config = statusConfig[status] || { label: status, class: 'bg-muted' };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${config.class}`}>
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const config = severityConfig[severity] || { label: severity, class: 'bg-muted' };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}

export function WarningLevelBadge({ level }) {
  const levelColors = {
    hijau: 'bg-green-500 text-white',
    kuning: 'bg-yellow-500 text-black',
    oranye: 'bg-orange-500 text-white',
    merah: 'bg-destructive text-white',
  };
  const levelLabels = {
    hijau: 'Hijau',
    kuning: 'Kuning',
    oranye: 'Oranye',
    merah: 'Merah',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[level] || 'bg-muted'}`}>
      {levelLabels[level] || level}
    </span>
  );
}

export function AidStatusBadge({ status }) {
  const statusConfig = {
    dibutuhkan: 'bg-destructive text-white',
    dalam_perjalanan: 'bg-warning text-black',
    tiba: 'bg-primary text-white',
    terdistribusi: 'bg-success text-white',
  };
  const statusLabels = {
    dibutuhkan: 'Dibutuhkan',
    dalam_perjalanan: 'Dlmn Prjalanan',
    tiba: 'Tiba',
    terdistribusi: 'Terdistribusi',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig[status] || 'bg-muted'}`}>
      {statusLabels[status] || status}
    </span>
  );
}
