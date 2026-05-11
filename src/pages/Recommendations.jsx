import { useState } from 'react';
import {
  Droplets,
  Activity,
  Mountain,
  Waves,
  Flame,
  Wind,
  Sun,
  AlertTriangle,
  Phone,
  ChevronDown,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const disasterRecommendations = {
  banjir: {
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Banjir',
    before: [
      'Periksa dan bersihkan selokan dan drainase di sekitar rumah',
      'Siapkan kantong pasir untuk menghalangi air masuk',
      'Pindahkan barang-barang berharga ke tempat yang lebih tinggi',
      'Siapkan tas darurat dengan obat-obatan dan kebutuhan pokok',
      'Know the location of high ground and evacuation routes',
    ],
    during: [
      'Segera evacuate ke tempat yang lebih tinggi',
      'Jangan berjalan atau berkendara melalui genangan air',
      'Hindari kontak dengan air banjir yang mungkin terkontaminasi',
      'Ikuti instruksi evacuation dari pihak berwenang',
      'Matikan listrik jika air mulai masuk ke rumah',
    ],
    after: [
      'Periksa kerusakan rumah sebelum kembali masuk',
      'Jangan gunakan air dari sumur sebelum diuji keamanannya',
      'Bersihkan rumah dengan hati-hati dan gunakan APD',
      'Dokumentasikan kerusakan untuk klaim asuransi',
      'Hubungi bantuan untuk kebutuhan dasar hidup',
    ],
  },
  gempa_bumi: {
    icon: Activity,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    title: 'Gempa Bumi',
    before: [
      'Kuatkan struktur bangunan dan furnitur berat',
      'Letakkan benda berat di bagian bawah rak',
      'Tandai area berkumpul yang aman di luar ruangan',
      'Siapkan tas darurat dan persediaan penting',
      'Latih diri untuk mengenali tanda-tanda gempa',
    ],
    during: [
      'Drop, Cover, and Hold On - lindungi diri di bawah meja',
      'Jauhi jendela dan benda yang dapat jatuh',
      'Jika di luar, segera menuju area terbuka yang aman',
      'Jangan gunakan lift, gunakan tangga darurat',
      'Stay away from buildings and utility lines',
    ],
    after: [
      'Periksa diri sendiri dan orang sekitar untuk luka',
      'Waspadai gempa susulan dan potential aftershocks',
      'Periksa infrastruktur kritis untuk kerusakan',
      'Hindari memasuki bangunan yang mungkin tidak aman',
      'Dengarkan informasi dari sumber resmi',
    ],
  },
  tanah_longsor: {
    icon: Mountain,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
    title: 'Tanah Longsor',
    before: [
      'Perhatikan tanda-tanda tanah longsor di sekitar',
      'Jangan tinggal di lereng yang curam atau dekat tebing',
      'Pasang sistem drainase yang baik di properti',
      'Tanam vegetation untuk menahan tanah',
      'Know the warning signs: cracks in ground, tilting trees',
    ],
    during: [
      'Segera evacuate ke arah yang lebih tinggi',
      'Jangan mendekati atau berjalan di bawah lereng',
      'Jika di dalam bangunan, segera keluar',
      'Stay alert for loud noises that may indicate landslide',
      'Jauhi sungai dan daerah aliran debris',
    ],
    after: [
      'Jangan kembali ke area sebelum dinyatakan aman',
      'Waspadai bahaya sekunder seperti genangan air',
      'Periksa struktur bangunan sebelum masuk',
      'Dokumentasikan kerusakan untuk klaim',
      'Hubungi authorities untuk bantuan',
    ],
  },
  tsunami: {
    icon: Waves,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    title: 'Tsunami',
    before: [
      'Know the warning signs: earthquake, unusual sea behavior',
      'Pelajari rute evacuation ke dataran tinggi',
      'Simpan document penting di tempat yang aman dan portabel',
      'Pasang alarm tsunami jika tinggal di coastal area',
      'Ikuti latihan evacuation secara berkala',
    ],
    during: [
      'Jika di coastal area dan merasakan gempa kuat, segera evacuate',
      'Head to high ground immediately - at least 30 meters elevation',
      'Jangan menunggu untuk instruksi resmi',
      'Stay away from the beach until officials give all-clear',
      'Go on foot if possible - avoid roads that may be damaged',
    ],
    after: [
      'Kembali ke area hanya setelah官方宣布安全',
      'Hindari mengemudi di daerah pesisir',
      'Perhatikan tanda-tanda contamination air',
      'Bantu救援 korban dengan mengikuti protokol keselamatan',
      'Dokumentasikan kerusakan untuk klaim asuransi',
    ],
  },
  gunung_berapi: {
    icon: Mountain,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    title: 'Gunung Berapi',
    before: [
      'Know the volcanic hazard zones in your area',
      'Siapkan masker dan kacamata pelindung',
      'Pahami sistem pengumuman darurat setempat',
      'Siapkan tas darurat dengan kebutuhan 72 jam',
      'Keep emergency supplies of food and water',
    ],
    during: [
      'Evacuate immediately when officials order',
      'Avoid valleys and low-lying areas',
      'Protect yourself from ash and volcanic debris',
      'Stay indoors until ash settles',
      'Follow official information channels',
    ],
    after: [
      'Bersihkan abu vulkanik dengan hati-hati',
      'Jangan operasikan ventilasi atau AC yang menyedot udara luar',
      'Periksa struktur bangunan sebelum masuk',
      'Hindari mengemudi - abu dapat merusak kendaraan',
      'Continue to monitor official announcements',
    ],
  },
  kebakaran: {
    icon: Flame,
    color: 'text-red-600',
    bgColor: 'bg-red-600/10',
    title: 'Kebakaran',
    before: [
      'Pasang smoke detector dan fire extinguisher',
      'Buat dan praktikkan fire escape plan',
      'Jaga kebersihan area dari material mudah terbakar',
      'Simpan dokumen penting di tempat yang fireproof',
      'Know how to turn off gas and electricity',
    ],
    during: [
      'Get out immediately - do not collect belongings',
      'Stay low to avoid smoke inhalation',
      'Feel doors before opening - if hot, use alternate exit',
      "Don't use elevators, take stairs",
      'If trapped, seal doors and windows, signal for help',
    ],
    after: [
      'Jangan memasuki bangunan sebelum dinyatakan aman',
      'Periksa luka dan cari bantuan medis jika needed',
      'Dokumentasikan kerusakan untuk klaim asuransi',
      'Hubungi keluarga untuk memberi tahu status',
      'Waspadai potential hot spots yang masih menyala',
    ],
  },
};

const emergencyContacts = [
  { name: 'BPBD Jawa Barat', phone: '022-1234-5678' },
  { name: 'Basarnas Bandung', phone: '021-1234-5678' },
  { name: 'BMKG Bandung', phone: '022-4567-8901' },
  { name: 'PMI Jawa Barat', phone: '021-7890-1234' },
  { name: 'Polisi', phone: '110' },
  { name: 'Pemadam Kebakaran', phone: '113' },
  { name: 'Ambulans', phone: '118' },
];

export default function Recommendations() {
  const [selectedDisaster, setSelectedDisaster] = useState('banjir');
  const [expandedSection, setExpandedSection] = useState('before');

  const disaster = disasterRecommendations[selectedDisaster];
  const IconComponent = disaster.icon;

  return (
    <AppLayout title="Rekomendasi Kesiapsiagaan">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-heading font-semibold mb-4">Pilih Jenis Bencana</h3>
            <div className="space-y-2">
              {Object.entries(disasterRecommendations).map(([key, data]) => {
                const Icon = data.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDisaster(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedDisaster === key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedDisaster === key ? '' : data.color}`} />
                    <span className="text-sm font-medium">{data.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 ${disaster.bgColor} rounded-xl`}>
                <IconComponent className={`w-8 h-8 ${disaster.color}`} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl">{disaster.title}</h2>
                <p className="text-muted-foreground">Panduan Kesiapsiagaan Bencana</p>
              </div>
            </div>

            <div className="space-y-3">
              {['before', 'during', 'after'].map((section) => (
                <div key={section} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium capitalize">
                      {section === 'before' ? 'Sebelum' : section === 'during' ? 'Saat Terjadi' : 'Sesudah'}
                    </span>
                    {expandedSection === section ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  {expandedSection === section && (
                    <div className="p-4 space-y-3">
                      {disaster[section].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 ${disaster.color} flex-shrink-0 mt-0.5`} />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-primary" />
              <h3 className="font-heading font-semibold text-lg">Kontak Darurat</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm font-medium">{contact.name}</span>
                  <a
                    href={`tel:${contact.phone.replace(/-/g, '')}`}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
