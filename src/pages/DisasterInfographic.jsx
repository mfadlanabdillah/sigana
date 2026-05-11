import { useState, useMemo } from 'react';
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
import { mockDisasters, disasterTypes, severityConfig } from '../lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

export default function DisasterInfographic() {
  const [selectedYear, setSelectedYear] = useState(2024);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg">Filter Tahun</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Total Bencana</p>
            <p className="text-3xl font-bold mt-1">{summaryStats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Total Terdampak</p>
            <p className="text-3xl font-bold mt-1">
              {(summaryStats.totalAffected / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Total Korban Jiwa</p>
            <p className="text-3xl font-bold mt-1 text-destructive">
              {summaryStats.totalCasualties}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-heading font-semibold mb-4">Tren Bulanan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(213 85% 48%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(213 85% 48%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
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
                  >
                    {disasterDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-heading font-semibold mb-4">Distribusi per Provinsi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceDistribution} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(213 85% 48%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-heading font-semibold mb-4">Distribusi Severity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityDistribution}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
