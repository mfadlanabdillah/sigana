import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import DisasterMap from './pages/DisasterMap';
import DisasterReports from './pages/DisasterReports';
import EarlyWarning from './pages/EarlyWarning';
import DisasterInfographic from './pages/DisasterInfographic';
import EvacuationCenters from './pages/EvacuationCenters';
import AidManagement from './pages/AidManagement';
import Analytics from './pages/Analytics';
import DisasterDocuments from './pages/DisasterDocuments';
import ReportForm from './pages/ReportForm';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/peta" element={<DisasterMap />} />
          <Route path="/laporan" element={<DisasterReports />} />
          <Route path="/peringatan-dini" element={<EarlyWarning />} />
          <Route path="/infografis" element={<DisasterInfographic />} />
          <Route path="/evakuasi" element={<EvacuationCenters />} />
          <Route path="/bantuan" element={<AidManagement />} />
          <Route path="/analisis" element={<Analytics />} />
          <Route path="/dokumen" element={<DisasterDocuments />} />
          <Route path="/buat-laporan" element={<ReportForm />} />
          <Route path="/rekomendasi" element={<Recommendations />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
