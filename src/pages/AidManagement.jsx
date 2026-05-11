import { useState } from 'react';
import { Plus, X, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { AidStatusBadge } from '../components/disasters/DisasterBadge';
import { aidTypes, aidStatusConfig, mockAidReports, mockDisasters } from '../lib/data';

export default function AidManagement() {
  const [aidReports, setAidReports] = useState(mockAidReports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newAid, setNewAid] = useState({
    disaster_id: '',
    aid_type: 'makanan',
    quantity: '',
    unit: 'paket',
    status: 'dibutuhkan',
    source: '',
    destination: '',
    notes: '',
  });

  const filteredAid = statusFilter === 'all'
    ? aidReports
    : aidReports.filter((a) => a.status === statusFilter);

  const summary = {
    total: aidReports.length,
    needed: aidReports.filter((a) => a.status === 'dibutuhkan').length,
    inTransit: aidReports.filter((a) => a.status === 'dalam_perjalanan').length,
    arrived: aidReports.filter((a) => a.status === 'tiba').length,
    distributed: aidReports.filter((a) => a.status === 'terdistribusi').length,
  };

  const handleCreate = () => {
    if (!newAid.disaster_id || !newAid.quantity) return;
    const disaster = mockDisasters.find((d) => d.id === newAid.disaster_id);
    const aid = {
      id: `A${Date.now()}`,
      ...newAid,
      disaster_title: disaster?.title || '',
      quantity: parseInt(newAid.quantity),
    };
    setAidReports([...aidReports, aid]);
    setShowCreate(false);
    setNewAid({
      disaster_id: '',
      aid_type: 'makanan',
      quantity: '',
      unit: 'paket',
      status: 'dibutuhkan',
      source: '',
      destination: '',
      notes: '',
    });
  };

  return (
    <AppLayout title="Data Bantuan">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary'
            }`}
          >
            <p className="text-2xl font-bold">{summary.total}</p>
            <p className="text-sm opacity-80">Total</p>
          </button>
          <button
            onClick={() => setStatusFilter('dibutuhkan')}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === 'dibutuhkan' ? 'bg-destructive text-white border-transparent' : 'bg-card border-border hover:border-destructive'
            }`}
          >
            <p className="text-2xl font-bold">{summary.needed}</p>
            <p className="text-sm opacity-80">Dibutuhkan</p>
          </button>
          <button
            onClick={() => setStatusFilter('dalam_perjalanan')}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === 'dalam_perjalanan' ? 'bg-warning text-black border-transparent' : 'bg-card border-border hover:border-warning'
            }`}
          >
            <p className="text-2xl font-bold">{summary.inTransit}</p>
            <p className="text-sm opacity-80">Dlmn Prjalanan</p>
          </button>
          <button
            onClick={() => setStatusFilter('tiba')}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === 'tiba' ? 'bg-primary text-primary-foreground border-transparent' : 'bg-card border-border hover:border-primary'
            }`}
          >
            <p className="text-2xl font-bold">{summary.arrived}</p>
            <p className="text-sm opacity-80">Tiba</p>
          </button>
          <button
            onClick={() => setStatusFilter('terdistribusi')}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === 'terdistribusi' ? 'bg-success text-white border-transparent' : 'bg-card border-border hover:border-success'
            }`}
          >
            <p className="text-2xl font-bold">{summary.distributed}</p>
            <p className="text-sm opacity-80">Terdistribusi</p>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Bantuan
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Jenis</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Bencana</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Jumlah</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Tujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAid.map((aid) => {
                  const typeInfo = aidTypes[aid.aid_type] || { emoji: '📦', label: aid.aid_type };
                  return (
                    <tr key={aid.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{typeInfo.emoji}</span>
                          <span className="text-sm">{typeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{aid.disaster_title}</td>
                      <td className="px-4 py-3 text-sm">
                        {aid.quantity.toLocaleString('id-ID')} {aid.unit}
                      </td>
                      <td className="px-4 py-3">
                        <AidStatusBadge status={aid.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{aid.destination}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Tambah Bantuan</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bencana</label>
                <select
                  value={newAid.disaster_id}
                  onChange={(e) => setNewAid({ ...newAid, disaster_id: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Pilih Bencana</option>
                  {mockDisasters.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Bantuan</label>
                  <select
                    value={newAid.aid_type}
                    onChange={(e) => setNewAid({ ...newAid, aid_type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {Object.entries(aidTypes).map(([key, config]) => (
                      <option key={key} value={key}>{config.emoji} {config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={newAid.quantity}
                    onChange={(e) => setNewAid({ ...newAid, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Satuan</label>
                <input
                  type="text"
                  value={newAid.unit}
                  onChange={(e) => setNewAid({ ...newAid, unit: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sumber</label>
                <input
                  type="text"
                  value={newAid.source}
                  onChange={(e) => setNewAid({ ...newAid, source: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tujuan</label>
                <input
                  type="text"
                  value={newAid.destination}
                  onChange={(e) => setNewAid({ ...newAid, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <textarea
                  value={newAid.notes}
                  onChange={(e) => setNewAid({ ...newAid, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-20"
                />
              </div>
              <button
                onClick={handleCreate}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Simpan Bantuan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
