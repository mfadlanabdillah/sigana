import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Upload, Search, Trash2, Download, FileText, X, Image } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { documentTypes, mockDocuments } from '../lib/data';

export default function DisasterDocuments() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    document_type: 'laporan_kejadian',
    province: 'Jawa Barat',
    year: new Date().getFullYear(),
    description: '',
    file: null,
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    if (!newDoc.title) return;
    const doc = {
      id: `DOC${Date.now()}`,
      ...newDoc,
      file_url: 'https://example.com/uploaded-doc.pdf',
      uploaded_by: 'Admin',
      related_disaster: '',
    };
    setDocuments([doc, ...documents]);
    setShowUpload(false);
    setNewDoc({
      title: '',
      document_type: 'laporan_kejadian',
      province: 'Jawa Barat',
      year: new Date().getFullYear(),
      description: '',
      file: null,
    });
  };

  const handleDelete = (id) => {
    if (confirm('Hapus dokumen ini?')) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  return (
    <AppLayout title="Dokumen Kebencanaan">
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
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
            />
          </div>
          <motion.select
            whileTap={{ scale: 0.98 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
          >
            <option value="all">Semua Jenis</option>
            {Object.entries(documentTypes).map(([key, config]) => (
              <option key={key} value={key}>
                {config.emoji} {config.label}
              </option>
            ))}
          </motion.select>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-shadow"
          >
            <Upload className="w-4 h-4" />
            Upload
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
            {filteredDocuments.map((doc) => {
              const typeInfo = documentTypes[doc.document_type] || { emoji: '📄', label: doc.document_type };
              const isPdf = doc.file_url.endsWith('.pdf');
              return (
                <motion.div
                  key={doc.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ y: -4, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className="p-3 bg-muted rounded-lg"
                    >
                      {isPdf ? (
                        <FileText className="w-6 h-6 text-destructive" />
                      ) : (
                        <Image className="w-6 h-6 text-primary" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                      <p className="text-xs text-muted-foreground">{typeInfo.label}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{doc.province}</span>
                    <span>{doc.year}</span>
                  </div>

                  <div className="flex gap-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-muted hover:bg-accent rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada dokumen ditemukan</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showUpload && (
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
              onClick={() => setShowUpload(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                <h2 className="font-heading font-semibold text-lg">Upload Dokumen</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul Dokumen</label>
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Dokumen</label>
                  <select
                    value={newDoc.document_type}
                    onChange={(e) => setNewDoc({ ...newDoc, document_type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                  >
                    {Object.entries(documentTypes).map(([key, config]) => (
                      <option key={key} value={key}>{config.emoji} {config.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Provinsi</label>
                    <select
                      value={newDoc.province}
                      onChange={(e) => setNewDoc({ ...newDoc, province: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    >
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Banten">Banten</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tahun</label>
                    <input
                      type="number"
                      value={newDoc.year}
                      onChange={(e) => setNewDoc({ ...newDoc, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring smooth-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    value={newDoc.description}
                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-20 resize-none smooth-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File</label>
                  <motion.div
                    whileHover={{ borderColor: 'hsl(var(--primary))' }}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk upload atau drag file ke sini
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Upload Dokumen
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
