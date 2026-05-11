import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
    color: 'text-[hsl(var(--disaster-banjir))]',
    bgColor: 'bg-[hsl(var(--disaster-banjir)/0.1)]',
    title: 'Banjir',
    before: [
      'Periksa dan bersihkan selokan dan drainase di sekitar rumah',
      'Siapkan kantong pasir untuk menghalangi air masuk',
      'Pindahkan barang-barang berharga ke tempat yang lebih tinggi',
      'Siapkan tas darurat dengan obat-obatan dan kebutuhan pokok',
      'Ketahui lokasi tanah tinggi dan rute evakuasi',
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
    color: 'text-[hsl(var(--disaster-gempa))]',
    bgColor: 'bg-[hsl(var(--disaster-gempa)/0.1)]',
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
      'Tetap Away dari bangunan dan saluran listrik',
    ],
    after: [
      'Periksa diri sendiri dan orang sekitar untuk luka',
      'Waspadai gempa susulan dan aftershocks potensial',
      'Periksa infrastruktur kritis untuk kerusakan',
      'Hindari memasuki bangunan yang mungkin tidak aman',
      'Dengarkan informasi dari sumber resmi',
    ],
  },
  tanah_longsor: {
    icon: Mountain,
    color: 'text-[hsl(var(--disaster-longsor))]',
    bgColor: 'bg-[hsl(var(--disaster-longsor)/0.1)]',
    title: 'Tanah Longsor',
    before: [
      'Perhatikan tanda-tanda tanah longsor di sekitar',
      'Jangan tinggal di lereng yang curam atau dekat tebing',
      'Pasang sistem drainase yang baik di properti',
      'Tanam vegetasi untuk menahan tanah',
      'Ketahui tanda-tanda: retakan di tanah, pohon miring',
    ],
    during: [
      'Segera evacuate ke arah yang lebih tinggi',
      'Jangan mendekati atau berjalan di bawah lereng',
      'Jika di dalam bangunan, segera keluar',
      'Stay alert untuk suara gemuruh yang mungkin menunjukkan longsor',
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
    color: 'text-[hsl(var(--disaster-tsunami))]',
    bgColor: 'bg-[hsl(var(--disaster-tsunami)/0.1)]',
    title: 'Tsunami',
    before: [
      'Ketahui tanda-tanda: gempa, perilaku laut yang aneh',
      'Pelajari rute evacuation ke dataran tinggi',
      'Simpan dokumen penting di tempat yang aman dan portabel',
      'Pasang alarm tsunami jika tinggal di coastal area',
      'Ikuti latihan evacuation secara berkala',
    ],
    during: [
      'Jika di coastal area dan merasakan gempa kuat, segera evacuate',
      'Head to high ground immediately - minimal 30 meter elevasi',
      'Jangan menunggu untuk instruksi resmi',
      'Stay away from the beach sampai officials memberikan all-clear',
      'Go on foot if possible - hindari jalan yang mungkin rusak',
    ],
    after: [
      'Kembali ke area hanya setelah diumumkan aman',
      'Hindari mengemudi di daerah pesisir',
      'Perhatikan tanda-tanda kontaminasi air',
      'Bantu救援 korban dengan mengikuti protokol keselamatan',
      'Dokumentasikan kerusakan untuk klaim asuransi',
    ],
  },
  gunung_berapi: {
    icon: Mountain,
    color: 'text-[hsl(var(--disaster-gunung))]',
    bgColor: 'bg-[hsl(var(--disaster-gunung)/0.1)]',
    title: 'Gunung Berapi',
    before: [
      'Ketahui zona bahaya vulkanik di area Anda',
      'Siapkan masker dan kacamata pelindung',
      'Pahami sistem pengumuman darurat setempat',
      'Siapkan tas darurat dengan kebutuhan 72 jam',
      'Simpan persediaan darurat makanan dan air',
    ],
    during: [
      'Evacuate immediately when officials order',
      'Avoid valleys and low-lying areas',
      'Protect yourself from ash and volcanic debris',
      'Stay indoors until ash settles',
      'Ikuti saluran informasi resmi',
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
    color: 'text-[hsl(var(--disaster-kebakaran))]',
    bgColor: 'bg-[hsl(var(--disaster-kebakaran)/0.1)]',
    title: 'Kebakaran',
    before: [
      'Pasang smoke detector dan fire extinguisher',
      'Buat dan praktikkan fire escape plan',
      'Jaga kebersihan area dari material mudah terbakar',
      'Simpan dokumen penting di tempat yang fireproof',
      'Ketahui cara mematikan gas dan listrik',
    ],
    during: [
      'Get out immediately - jangan mengambil barang',
      'Stay low to avoid smoke inhalation',
      'Feel doors sebelum membuka - jika panas, gunakan jalan alternatif',
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const disaster = disasterRecommendations[selectedDisaster];
  const IconComponent = disaster.icon;

  return (
    <AppLayout title="Rekomendasi Kesiapsiagaan">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <h3 className="font-heading font-semibold mb-4">Pilih Jenis Bencana</h3>
            <div className="space-y-2">
              {Object.entries(disasterRecommendations).map(([key, data]) => {
                const Icon = data.icon;
                const isSelected = selectedDisaster === key;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDisaster(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? '' : data.color}`} />
                    <span className="text-sm font-medium">{data.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          <motion.div
            key={selectedDisaster}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
                className={`p-4 ${disaster.bgColor} rounded-xl`}
              >
                <IconComponent className={`w-8 h-8 ${disaster.color}`} />
              </motion.div>
              <div>
                <h2 className="font-heading font-bold text-2xl">{disaster.title}</h2>
                <p className="text-muted-foreground">Panduan Kesiapsiagaan Bencana</p>
              </div>
            </motion.div>

            <div className="space-y-3">
              {['before', 'during', 'after'].map((section, sectionIndex) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + sectionIndex * 0.05 }}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                    onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 transition-colors"
                  >
                    <span className="font-medium capitalize">
                      {section === 'before' ? 'Sebelum' : section === 'during' ? 'Saat Terjadi' : 'Sesudah'}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSection === section ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {expandedSection === section && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {disaster[section].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className={`w-5 h-5 ${disaster.color} flex-shrink-0 mt-0.5`} />
                              <span className="text-sm">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <Phone className="w-6 h-6 text-primary" />
              <h3 className="font-heading font-semibold text-lg">Kontak Darurat</h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={contact.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm font-medium">{contact.name}</span>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={`tel:${contact.phone.replace(/-/g, '')}`}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {contact.phone}
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
