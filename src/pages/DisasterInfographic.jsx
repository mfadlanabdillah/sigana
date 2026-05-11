import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
  LineChart,
  Line,
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { CustomTooltip } from '../components/ui/CustomTooltip';
import { mockDisasters, disasterTypes, severityConfig } from '../lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

export default function DisasterInfographic() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const summaryStats = useMemo(() => {
    const yearDisasters = mockDisasters.filter(
      (d) => new Date(d.incident_date).getFullYear() === selectedYear
    );
    return {
      total: yearDisasters.length,
      totalAffected: yearDisasters.reduce((sum, d) => sum + d.affected_people, 0),
      totalCasualties: yearDisasters.reduce((sum, d) => sum + d.casualties, 0),
    };
  }, [selectedYear]);

  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const counts = new Array(12).fill(0);
    mockDisasters.forEach((d) => {
      const month = new Date(d.incident_date).getMonth();
      counts[month]++;
    });
    return months.map((name, index) => ({ name, count: counts[index] }));
  }, []);

  const disasterDistribution = useMemo(() => {
    const counts = {};
    mockDisasters.forEach((d) => {
      counts[d.disaster_type] = (counts[d.disaster_type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      name: disasterTypes[type]?.label || type,
      value: count,
      emoji: disasterTypes[type]?.emoji,
    }));
  }, []);

  const provinceDistribution = useMemo(() => {
    const counts = {};
    mockDisasters.forEach((d) => {
      counts[d.province] = (counts[d.province] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, []);

  const severityDistribution = useMemo(() => {
    const counts = { ringan: 0, sedang: 0, berat: 0, kritis: 0 };
    mockDisasters.forEach((d) => {
      counts[d.severity]++;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name: severityConfig[name]?.label || name,
      count,
    }));
  }, []);

  return (
    <AppLayout title="Infografis Bencana">
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
          className="flex items-center justify-between"
        >
          <h2 className="font-heading font-semibold text-lg">Filter Tahun</h2>
          <motion.select
            whileTap={{ scale: 0.98 }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </motion.select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Bencana', value: summaryStats.total, prefix: '' },
            { label: 'Total Terdampak', value: Math.floor(summaryStats.totalAffected / 1000), suffix: 'K' },
            { label: 'Total Korban Jiwa', value: summaryStats.totalCasualties, prefix: '' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)' }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Tren Bulanan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(213 85% 48%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(213 85% 48%)' }}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Distribusi Jenis Bencana</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disasterDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {disasterDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Distribusi per Provinsi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceDistribution} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="hsl(213 85% 48%)" radius={[0, 4, 4, 0]} animationBegin={0} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold mb-4">Distribusi Severity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityDistribution}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1000}>
                    {severityDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#10B981', '#F59E0B', '#F97316', '#EF4444'][index]}
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
