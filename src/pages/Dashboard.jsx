import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Users,
  Building2,
  Heart,
  TrendingUp,
  Activity,
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
import {
  mockDisasters,
  mockEvacuationCenters,
  mockAidReports,
  disasterTypes,
} from '../lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [selectedDisaster, setSelectedDisaster] = useState(null);

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

  return (
    <AppLayout>
      <AlertTicker alerts={activeAlerts} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex justify-center">
          <DonutGauge
            value={stats.activeDisasters}
            max={20}
            label="Bencana Aktif"
            icon={AlertTriangle}
            subtitle="Total aktif & siaga"
            color="hsl(0 84% 60%)"
          />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex justify-center">
          <DonutGauge
            value={(stats.totalAffected / 1000).toFixed(0)}
            max={500}
            label="Total Terdampak"
            icon={Users}
            subtitle="Ribu jiwa"
            color="hsl(213 85% 48%)"
          />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex justify-center">
          <DonutGauge
            value={stats.activeCenters}
            max={20}
            label="Posko Aktif"
            icon={Building2}
            subtitle="Pengungsian"
            color="hsl(142 76% 36%)"
          />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex justify-center">
          <DonutGauge
            value={stats.aidNeeded}
            max={20}
            label="Bantuan Dibutuhkan"
            icon={Heart}
            subtitle="Jenis bantuan"
            color="hsl(38 92% 50%)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-heading font-semibold mb-4">Peta Bencana Jawa Barat</h3>
          <DashboardMap disasters={mockDisasters} height="350px" />
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-heading font-semibold mb-4">Lokasi Terdekat</h3>
          <NearbyLocations
            disasters={mockDisasters}
            centers={mockEvacuationCenters}
            limit={5}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-heading font-semibold mb-4">Distribusi Jenis Bencana</h3>
          <div className="h-64">
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
                >
                  {disasterDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {disasterDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
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
          <h3 className="font-heading font-semibold mb-4">Bencana Terbaru</h3>
          <div className="space-y-3">
            {recentDisasters.map((disaster) => (
              <DisasterCard
                key={disaster.id}
                disaster={disaster}
                onClick={() => setSelectedDisaster(disaster)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
