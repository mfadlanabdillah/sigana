import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Filter, Trash2, X, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import AppLayout from '../components/layout/AppLayout';
import DisasterCard from '../components/disasters/DisasterCard';
import { DisasterBadge, SeverityBadge } from '../components/disasters/DisasterBadge';
import { CardSkeleton } from '../components/ui/Skeleton';
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
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
        ref={ref}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <motion.div
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
              />
            </motion.div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.select
              whileTap={{ scale: 0.98 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
            >
              <option value="all">Semua Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </motion.select>
            <motion.select
              whileTap={{ scale: 0.98 }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
            >
              <option value="all">Semua Jenis</option>
              {Object.entries(disasterTypes).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.emoji} {config.label}
                </option>
              ))}
            </motion.select>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="popLayout">
            {filteredDisasters.map((disaster) => (
              <motion.div
                key={disaster.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                layout
              >
                <DisasterCard
                  disaster={disaster}
                  onClick={() => setSelectedDisaster(disaster)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDisasters.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada laporan yang ditemukan</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedDisaster && (
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
              onClick={() => setSelectedDisaster(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                <h2 className="font-heading font-semibold text-lg">Detail Laporan</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDisaster(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdateStatus(selectedDisaster.id, key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedDisaster.status === key
                            ? config.class + ' text-white'
                            : 'bg-muted hover:bg-accent'
                        }`}
                      >
                        {config.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(selectedDisaster.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
