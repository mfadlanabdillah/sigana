import { useState, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  AlertTriangle,
  Users,
  Building2,
  Heart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import AlertTicker from '../components/dashboard/AlertTicker';
import DonutGauge from '../components/dashboard/DonutGauge';
import DashboardMap from '../components/dashboard/DashboardMap';
import NearbyLocations from '../components/dashboard/NearbyLocations';
import DisasterCard from '../components/disasters/DisasterCard';
import { CardSkeleton, MapSkeleton } from '../components/ui/Skeleton';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { CustomTooltip } from '../components/ui/CustomTooltip';
import {
  mockDisasters,
  mockEvacuationCenters,
  mockAidReports,
  disasterTypes,
} from '../lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);
  const mapRef = useRef(null);
  const nearbyRef = useRef(null);
  const chartsRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });
  const mapInView = useInView(mapRef, { once: true, margin: '-50px' });
  const nearbyInView = useInView(nearbyRef, { once: true, margin: '-50px' });
  const chartsInView = useInView(chartsRef, { once: true, margin: '-50px' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const activeDisasters = mockDisasters.filter((d) => d.status === 'aktif').length;
    const totalAffected = mockDisasters.reduce((sum, d) => sum + d.affected_people, 0);
    const activeCenters = mockEvacuationCenters.filter((c) => c.status === 'aktif').length;
    const aidNeeded = mockAidReports.filter((a) => a.status === 'dibutuhkan').length;

    return { activeDisasters, totalAffected, activeCenters, aidNeeded };
  }, []);

  const disasterDistribution = useMemo(() => {
    const counts = {};
    mockDisasters.forEach((d) => {
      counts[d.disaster_type] = (counts[d.disaster_type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      name: disasterTypes[type]?.label || type,
      value: count,
    }));
  }, []);

  const recentDisasters = useMemo(() => {
    return [...mockDisasters]
      .sort((a, b) => new Date(b.incident_date) - new Date(a.incident_date))
      .slice(0, 5);
  }, []);

  const activeAlerts = mockDisasters.filter((d) => d.status === 'aktif' || d.status === 'siaga');

  const statCards = [
    {
      value: stats.activeDisasters,
      max: 20,
      label: 'Bencana Aktif',
      icon: AlertTriangle,
      subtitle: 'Total aktif & siaga',
      color: 'hsl(0 84% 60%)',
    },
    {
      value: Math.floor(stats.totalAffected / 1000),
      max: 500,
      label: 'Total Terdampak',
      icon: Users,
      subtitle: 'Ribu jiwa',
      color: 'hsl(213 85% 48%)',
      suffix: 'K',
    },
    {
      value: stats.activeCenters,
      max: 20,
      label: 'Posko Aktif',
      icon: Building2,
      subtitle: 'Pengungsian',
      color: 'hsl(142 76% 36%)',
    },
    {
      value: stats.aidNeeded,
      max: 20,
      label: 'Bantuan Dibutuhkan',
      icon: Heart,
      subtitle: 'Jenis bantuan',
      color: 'hsl(38 92% 50%)',
    },
  ];

  return (
    <AppLayout>
      <AlertTicker alerts={activeAlerts} />

      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex justify-center">
              <CardSkeleton />
            </div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-4 flex justify-center"
            >
              <DonutGauge
                value={stat.value}
                max={stat.max}
                label={stat.label}
                icon={stat.icon}
                subtitle={stat.subtitle}
                color={stat.color}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, x: -30 }}
          animate={mapInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-heading font-semibold mb-4">Peta Bencana Jawa Barat</h3>
          {loading ? (
            <MapSkeleton height="350px" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <DashboardMap disasters={mockDisasters} height="350px" />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          ref={nearbyRef}
          initial={{ opacity: 0, x: 30 }}
          animate={nearbyInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-heading font-semibold mb-4">Lokasi Terdekat</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <NearbyLocations
                disasters={mockDisasters}
                centers={mockEvacuationCenters}
                limit={5}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          ref={chartsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-heading font-semibold mb-4">Distribusi Jenis Bencana</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="skeleton w-full h-full rounded-lg" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disasterDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {disasterDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={chartsInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-2"
          >
            {disasterDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-heading font-semibold mb-4">Bencana Terbaru</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {recentDisasters.map((disaster) => (
                <DisasterCard
                  key={disaster.id}
                  disaster={disaster}
                  onClick={() => setSelectedDisaster(disaster)}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
