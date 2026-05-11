export function DisasterBadge({ status }) {
  const statusClasses = {
    aktif: 'bg-primary text-primary-foreground',
    siaga: 'bg-warning text-black',
    terkendali: 'bg-success text-white',
    selesai: 'bg-muted text-muted-foreground',
  };
  const statusLabels = {
    aktif: 'Aktif',
    siaga: 'Siaga',
    terkendali: 'Terdangani',
    selesai: 'Selesai',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClasses[status] || 'bg-muted text-muted-foreground'}`}>
      {statusLabels[status] || status}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const severityClasses = {
    ringan: 'bg-[hsl(var(--severity-ringan))] text-white',
    sedang: 'bg-[hsl(var(--severity-sedang))] text-black',
    berat: 'bg-[hsl(var(--severity-berat))] text-white',
    kritis: 'bg-destructive text-white',
  };
  const severityLabels = {
    ringan: 'Ringan',
    sedang: 'Sedang',
    berat: 'Berat',
    kritis: 'Kritis',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityClasses[severity] || 'bg-muted text-muted-foreground'}`}>
      {severityLabels[severity] || severity}
    </span>
  );
}

export function WarningLevelBadge({ level }) {
  const levelClasses = {
    hijau: 'bg-[hsl(var(--warning-hijau))] text-white',
    kuning: 'bg-[hsl(var(--warning-kuning))] text-black',
    oranye: 'bg-[hsl(var(--warning-oranye))] text-white',
    merah: 'bg-destructive text-white',
  };
  const levelLabels = {
    hijau: 'Hijau',
    kuning: 'Kuning',
    oranye: 'Oranye',
    merah: 'Merah',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelClasses[level] || 'bg-muted text-muted-foreground'}`}>
      {levelLabels[level] || level}
    </span>
  );
}

export function AidStatusBadge({ status }) {
  const statusClasses = {
    dibutuhkan: 'bg-destructive text-white',
    dalam_perjalanan: 'bg-warning text-black',
    tiba: 'bg-primary text-primary-foreground',
    terdistribusi: 'bg-success text-white',
  };
  const statusLabels = {
    dibutuhkan: 'Dibutuhkan',
    dalam_perjalanan: 'Dlmn Prjalanan',
    tiba: 'Tiba',
    terdistribusi: 'Terdistribusi',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusClasses[status] || 'bg-muted text-muted-foreground'}`}>
      {statusLabels[status] || status}
    </span>
  );
}
