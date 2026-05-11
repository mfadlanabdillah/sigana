import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

  const statusTabs = [
    { key: 'all', label: 'Total', value: summary.total, color: 'text-foreground' },
    { key: 'dibutuhkan', label: 'Dibutuhkan', value: summary.needed, color: 'text-destructive' },
    { key: 'dalam_perjalanan', label: 'Dlmn Prjalanan', value: summary.inTransit, color: 'text-warning' },
    { key: 'tiba', label: 'Tiba', value: summary.arrived, color: 'text-primary' },
    { key: 'terdistribusi', label: 'Terdistribusi', value: summary.distributed, color: 'text-success' },
  ];

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
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {statusTabs.map((tab, index) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(tab.key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                statusFilter === tab.key
                  ? tab.key === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : tab.key === 'dibutuhkan'
                    ? 'bg-destructive text-white border-transparent'
                    : tab.key === 'dalam_perjalanan'
                    ? 'bg-warning text-black border-transparent'
                    : tab.key === 'tiba'
                    ? 'bg-primary text-primary-foreground border-transparent'
                    : 'bg-success text-white border-transparent'
                  : 'bg-card border-border hover:border-primary'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.03 }}
            >
              <p className="text-2xl font-bold">{tab.value}</p>
              <p className="text-sm opacity-80">{tab.label}</p>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Tambah Bantuan
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
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
                <AnimatePresence mode="popLayout">
                  {filteredAid.map((aid, index) => {
                    const typeInfo = aidTypes[aid.aid_type] || { emoji: '📦', label: aid.aid_type };
                    return (
                      <motion.tr
                        key={aid.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <motion.span
                              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            >
                              {typeInfo.emoji}
                            </motion.span>
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
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreate(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                <h2 className="font-heading font-semibold text-lg">Tambah Bantuan</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreate(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bencana</label>
                  <select
                    value={newAid.disaster_id}
                    onChange={(e) => setNewAid({ ...newAid, disaster_id: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
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
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
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
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Satuan</label>
                  <input
                    type="text"
                    value={newAid.unit}
                    onChange={(e) => setNewAid({ ...newAid, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sumber</label>
                  <input
                    type="text"
                    value={newAid.source}
                    onChange={(e) => setNewAid({ ...newAid, source: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tujuan</label>
                  <input
                    type="text"
                    value={newAid.destination}
                    onChange={(e) => setNewAid({ ...newAid, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catatan</label>
                  <textarea
                    value={newAid.notes}
                    onChange={(e) => setNewAid({ ...newAid, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-20 resize-none smooth-input"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Simpan Bantuan
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
