import { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import AppLayout from '../components/layout/AppLayout';
import DisasterCard from '../components/disasters/DisasterCard';
import { DisasterBadge, SeverityBadge } from '../components/disasters/DisasterBadge';
import {
  mockDisasters,
  disasterTypes,
  statusConfig,
  severityConfig,
} from '../lib/data';

export default function DisasterReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [disasters, setDisasters] = useState(mockDisasters);

  const filteredDisasters = useMemo(() => {
    return disasters.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesType = typeFilter === 'all' || d.disaster_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [disasters, searchQuery, statusFilter, typeFilter]);

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus laporan ini?')) {
      setDisasters(disasters.filter((d) => d.id !== id));
      setSelectedDisaster(null);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setDisasters(
      disasters.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (selectedDisaster?.id === id) {
      setSelectedDisaster({ ...selectedDisaster, status: newStatus });
    }
  };

  return (
    <AppLayout title="Laporan Bencana">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Semua Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Semua Jenis</option>
              {Object.entries(disasterTypes).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.emoji} {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDisasters.map((disaster) => (
            <DisasterCard
              key={disaster.id}
              disaster={disaster}
              onClick={() => setSelectedDisaster(disaster)}
            />
          ))}
        </div>

        {filteredDisasters.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada laporan yang ditemukan</p>
          </div>
        )}
      </div>

      {selectedDisaster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedDisaster(null)}
          />
          <div className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Detail Laporan</h2>
              <button
                onClick={() => setSelectedDisaster(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">
                  {disasterTypes[selectedDisaster.disaster_type]?.emoji}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedDisaster.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDisaster.location_name}, {selectedDisaster.province}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <DisasterBadge status={selectedDisaster.status} />
                <SeverityBadge severity={selectedDisaster.severity} />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Deskripsi</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDisaster.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Terdampak</p>
                  <p className="font-semibold">
                    {selectedDisaster.affected_people.toLocaleString('id-ID')} jiwa
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah Korban</p>
                  <p className="font-semibold">{selectedDisaster.casualties} orang</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Luka-luka</p>
                  <p className="font-semibold">{selectedDisaster.injured} orang</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mengungsi</p>
                  <p className="font-semibold">{selectedDisaster.displaced} orang</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tanggal Kejadian</p>
                  <p>{new Date(selectedDisaster.incident_date).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dilaporkan oleh</p>
                  <p>{selectedDisaster.reported_by}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <div className="flex gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleUpdateStatus(selectedDisaster.id, key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedDisaster.status === key
                          ? config.class + ' text-white'
                          : 'bg-muted hover:bg-accent'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => handleDelete(selectedDisaster.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
