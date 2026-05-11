import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { CustomTooltip } from '../components/ui/CustomTooltip';
import {
  mockDisasters,
  mockAidReports,
  disasterTypes,
  severityConfig,
} from '../lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const summary = useMemo(() => {
    return {
      totalDisasters: mockDisasters.length,
      totalAffected: mockDisasters.reduce((sum, d) => sum + d.affected_people, 0),
      totalCasualties: mockDisasters.reduce((sum, d) => sum + d.casualties, 0),
      totalAid: mockAidReports.length,
    };
  }, []);

  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const counts = new Array(12).fill(0);
    mockDisasters.forEach((d) => {
      const month = new Date(d.incident_date).getMonth();
      counts[month]++;
    });
    return months.map((name, index) => ({ name, bencana: counts[index] }));
  }, []);

  const provinceData = useMemo(() => {
    const counts = {};
    mockDisasters.forEach((d) => {
      counts[d.province] = (counts[d.province] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const disasterTypeData = useMemo(() => {
    const counts = {};
    mockDisasters.forEach((d) => {
      counts[d.disaster_type] = (counts[d.disaster_type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, value]) => ({
      name: disasterTypes[type]?.label || type,
      value,
    }));
  }, []);

  const severityData = useMemo(() => {
    const counts = { ringan: 0, sedang: 0, berat: 0, kritis: 0 };
    mockDisasters.forEach((d) => {
      counts[d.severity]++;
    });
    return Object.entries(counts).map(([key, value]) => ({
      subject: severityConfig[key]?.label || key,
      value,
    }));
  }, []);

  const aidPrediction = useMemo(() => {
    const needed = mockAidReports.filter((a) => a.status === 'dibutuhkan').length;
    const available = mockAidReports.filter((a) => a.status === 'tiba' || a.status === 'terdistribusi').length;
    return [
      { name: 'Kebutuhan', value: needed + 15 },
      { name: 'Stok', value: available },
    ];
  }, []);

  const statCards = [
    { label: 'Total Bencana', value: summary.totalDisasters, suffix: '' },
    { label: 'Total Terdampak', value: Math.floor(summary.totalAffected / 1000), suffix: 'K' },
    { label: 'Total Korban', value: summary.totalCasualties, suffix: '' },
    { label: 'Total Bantuan', value: summary.totalAid, suffix: '' },
  ];

  return (
    <AppLayout title="Analisis Data">
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)' }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Tren Bencana Bulanan</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorBencana" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(213 85% 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(213 85% 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="bencana"
                    stroke="hsl(213 85% 48%)"
                    strokeWidth={2}
                    fill="url(#colorBencana)"
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Perbandingan Provinsi</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="hsl(213 85% 48%)" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Distribusi Jenis Bencana</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disasterTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ strokeWidth: 1 }}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {disasterTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Distribusi Severity</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={severityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fontSize: 11 }} />
                  <Radar
                    name="Jumlah"
                    dataKey="value"
                    stroke="hsl(213 85% 48%)"
                    fill="hsl(213 85% 48%)"
                    fillOpacity={0.3}
                    animationBegin={0}
                    animationDuration={1200}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4 lg:col-span-2"
          >
            <h3 className="font-heading font-semibold mb-4">Prediksi Kebutuhan vs Stok Bantuan</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aidPrediction}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1000}>
                    {aidPrediction.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? 'hsl(0 84% 60%)' : 'hsl(142 76% 36%)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
