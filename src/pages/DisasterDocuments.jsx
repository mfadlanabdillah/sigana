import { useState } from 'react';
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
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Semua Jenis</option>
            {Object.entries(documentTypes).map(([key, config]) => (
              <option key={key} value={key}>
                {config.emoji} {config.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const typeInfo = documentTypes[doc.document_type] || { emoji: '📄', label: doc.document_type };
            const isPdf = doc.file_url.endsWith('.pdf');
            return (
              <div
                key={doc.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-3 bg-muted rounded-lg">
                    {isPdf ? (
                      <FileText className="w-6 h-6 text-destructive" />
                    ) : (
                      <Image className="w-6 h-6 text-primary" />
                    )}
                  </div>
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
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-muted hover:bg-accent rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada dokumen ditemukan</p>
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUpload(false)} />
          <div className="relative bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Upload Dokumen</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Dokumen</label>
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Dokumen</label>
                <select
                  value={newDoc.document_type}
                  onChange={(e) => setNewDoc({ ...newDoc, document_type: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload atau drag file ke sini
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                </div>
              </div>
              <button
                onClick={handleUpload}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Upload Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
