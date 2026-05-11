import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, X } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { WarningLevelBadge } from '../components/disasters/DisasterBadge';
import {
  mockEarlyWarnings,
  disasterTypes,
  warningLevels,
} from '../lib/data';

const COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];

export default function EarlyWarning() {
  const [warnings, setWarnings] = useState(mockEarlyWarnings);
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newWarning, setNewWarning] = useState({
    title: '',
    warning_level: 'kuning',
    disaster_type: 'banjir',
    affected_regions: '',
    description: '',
    recommendation: '',
    source: '',
    valid_until: '',
  });

  const filteredWarnings = useMemo(() => {
    return levelFilter === 'all'
      ? warnings
      : warnings.filter((w) => w.warning_level === levelFilter);
  }, [warnings, levelFilter]);

  const summaryByLevel = useMemo(() => {
    const counts = { hijau: 0, kuning: 0, oranye: 0, merah: 0 };
    warnings.forEach((w) => {
      if (w.is_active) counts[w.warning_level]++;
    });
    return counts;
  }, [warnings]);

  const handleCreate = () => {
    if (!newWarning.title) return;
    const warning = {
      id: `W${Date.now()}`,
      ...newWarning,
      affected_regions: newWarning.affected_regions.split(',').map((r) => r.trim()),
      valid_until: new Date(newWarning.valid_until).toISOString(),
      is_active: true,
    };
    setWarnings([warning, ...warnings]);
    setShowCreate(false);
    setNewWarning({
      title: '',
      warning_level: 'kuning',
      disaster_type: 'banjir',
      affected_regions: '',
      description: '',
      recommendation: '',
      source: '',
      valid_until: '',
    });
  };

  const handleDelete = (id) => {
    if (confirm('Hapus peringatan ini?')) {
      setWarnings(warnings.filter((w) => w.id !== id));
    }
  };

  return (
    <AppLayout title="Peringatan Dini">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(warningLevels).map(([level, config]) => (
            <button
              key={level}
              onClick={() => setLevelFilter(levelFilter === level ? 'all' : level)}
              className={`p-4 rounded-xl border transition-all ${
                levelFilter === level
                  ? `${config.class} text-white border-transparent`
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              <div className="text-2xl font-bold">{summaryByLevel[level]}</div>
              <div className="text-sm opacity-80">{config.label}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Peringatan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWarnings.map((warning) => (
            <div
              key={warning.id}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <WarningLevelBadge level={warning.warning_level} />
                  <span className="text-xl">
                    {disasterTypes[warning.disaster_type]?.emoji}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(warning.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold mb-1">{warning.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {warning.description}
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Wilayah: {warning.affected_regions.join(', ')}</p>
                <p>Berlaku hingga: {new Date(warning.valid_until).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredWarnings.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada peringatan ditemukan</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Buat Peringatan Dini</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  value={newWarning.title}
                  onChange={(e) => setNewWarning({ ...newWarning, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select
                    value={newWarning.warning_level}
                    onChange={(e) => setNewWarning({ ...newWarning, warning_level: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {Object.entries(warningLevels).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Bencana</label>
                  <select
                    value={newWarning.disaster_type}
                    onChange={(e) => setNewWarning({ ...newWarning, disaster_type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {Object.entries(disasterTypes).map(([key, config]) => (
                      <option key={key} value={key}>{config.emoji} {config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wilayah (pisah dengan koma)</label>
                <input
                  type="text"
                  value={newWarning.affected_regions}
                  onChange={(e) => setNewWarning({ ...newWarning, affected_regions: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={newWarning.description}
                  onChange={(e) => setNewWarning({ ...newWarning, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rekomendasi</label>
                <textarea
                  value={newWarning.recommendation}
                  onChange={(e) => setNewWarning({ ...newWarning, recommendation: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sumber</label>
                  <input
                    type="text"
                    value={newWarning.source}
                    onChange={(e) => setNewWarning({ ...newWarning, source: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Berlaku Hingga</label>
                  <input
                    type="datetime-local"
                    value={newWarning.valid_until}
                    onChange={(e) => setNewWarning({ ...newWarning, valid_until: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Simpan Peringatan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
