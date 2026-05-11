import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, X, Users, Phone, MapPin, Building2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { centerTypes, centerStatusConfig, mockEvacuationCenters } from '../lib/data';

export default function EvacuationCenters() {
  const [centers, setCenters] = useState(mockEvacuationCenters);
  const [showCreate, setShowCreate] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: '',
    type: 'tempat_pengungsian',
    status: 'aktif',
    location_name: '',
    province: 'Jawa Barat',
    latitude: '',
    longitude: '',
    capacity: '',
    current_occupancy: '',
    contact_person: '',
    contact_phone: '',
    available_supplies: '',
    notes: '',
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const summary = {
    totalCapacity: centers.reduce((sum, c) => sum + c.capacity, 0),
    totalOccupancy: centers.reduce((sum, c) => sum + c.current_occupancy, 0),
    activeCenters: centers.filter((c) => c.status === 'aktif').length,
  };

  const handleCreate = () => {
    if (!newCenter.name || !newCenter.location_name) return;
    const center = {
      id: `E${Date.now()}`,
      ...newCenter,
      latitude: parseFloat(newCenter.latitude) || -6.9,
      longitude: parseFloat(newCenter.longitude) || 107.6,
      capacity: parseInt(newCenter.capacity) || 100,
      current_occupancy: parseInt(newCenter.current_occupancy) || 0,
      available_supplies: newCenter.available_supplies.split(',').map((s) => s.trim()),
      related_disaster_id: '',
    };
    setCenters([...centers, center]);
    setShowCreate(false);
    setNewCenter({
      name: '',
      type: 'tempat_pengungsian',
      status: 'aktif',
      location_name: '',
      province: 'Jawa Barat',
      latitude: '',
      longitude: '',
      capacity: '',
      current_occupancy: '',
      contact_person: '',
      contact_phone: '',
      available_supplies: '',
      notes: '',
    });
  };

  const summaryCards = [
    { label: 'Total Kapasitas', value: summary.totalCapacity, icon: Building2, color: 'text-primary' },
    { label: 'Total Pengungsi', value: summary.totalOccupancy, icon: Users, color: 'text-success' },
    { label: 'Posko Aktif', value: summary.activeCenters, icon: MapPin, color: 'text-warning' },
  ];

  return (
    <AppLayout title="Posko Evakuasi">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {summaryCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)' }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-muted rounded-lg`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
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
            Tambah Posko
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="popLayout">
            {centers.map((center) => {
              const typeInfo = centerTypes[center.type] || { emoji: '🏠', label: center.type };
              const statusInfo = centerStatusConfig[center.status] || { label: center.status };
              const occupancyPercent = Math.round((center.current_occupancy / center.capacity) * 100);
              const isFull = center.status === 'penuh' || occupancyPercent >= 90;

              return (
                <motion.div
                  key={center.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ y: -4, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.3 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl"
                    >
                      {typeInfo.emoji}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{center.name}</h3>
                      <p className="text-xs text-muted-foreground">{typeInfo.label}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {center.location_name}, {center.province}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{center.contact_phone}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Kapasitas</span>
                      <span className={isFull ? 'text-destructive font-medium' : ''}>
                        {center.current_occupancy}/{center.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${
                          isFull ? 'bg-destructive' : occupancyPercent > 70 ? 'bg-warning' : 'bg-success'
                        }`}
                      />
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${statusInfo.class}`}
                  >
                    {statusInfo.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
                <h2 className="font-heading font-semibold text-lg">Tambah Posko Evakuasi</h2>
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
                  <label className="block text-sm font-medium mb-1">Nama Posko</label>
                  <input
                    type="text"
                    value={newCenter.name}
                    onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipe</label>
                    <select
                      value={newCenter.type}
                      onChange={(e) => setNewCenter({ ...newCenter, type: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    >
                      {Object.entries(centerTypes).map(([key, config]) => (
                        <option key={key} value={key}>{config.emoji} {config.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={newCenter.status}
                      onChange={(e) => setNewCenter({ ...newCenter, status: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    >
                      {Object.entries(centerStatusConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kota/Kabupaten</label>
                    <input
                      type="text"
                      value={newCenter.location_name}
                      onChange={(e) => setNewCenter({ ...newCenter, location_name: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Provinsi</label>
                    <select
                      value={newCenter.province}
                      onChange={(e) => setNewCenter({ ...newCenter, province: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    >
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Banten">Banten</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <input
                      type="text"
                      value={newCenter.latitude}
                      onChange={(e) => setNewCenter({ ...newCenter, latitude: e.target.value })}
                      placeholder="-6.9"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <input
                      type="text"
                      value={newCenter.longitude}
                      onChange={(e) => setNewCenter({ ...newCenter, longitude: e.target.value })}
                      placeholder="107.6"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kapasitas</label>
                    <input
                      type="number"
                      value={newCenter.capacity}
                      onChange={(e) => setNewCenter({ ...newCenter, capacity: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pengungsi Saat Ini</label>
                    <input
                      type="number"
                      value={newCenter.current_occupancy}
                      onChange={(e) => setNewCenter({ ...newCenter, current_occupancy: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={newCenter.contact_person}
                      onChange={(e) => setNewCenter({ ...newCenter, contact_person: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No. Telepon</label>
                    <input
                      type="text"
                      value={newCenter.contact_phone}
                      onChange={(e) => setNewCenter({ ...newCenter, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Persediaan (pisah dengan koma)</label>
                  <input
                    type="text"
                    value={newCenter.available_supplies}
                    onChange={(e) => setNewCenter({ ...newCenter, available_supplies: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Simpan Posko
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
