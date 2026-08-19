import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Save, Link as LinkIcon, FileText } from 'lucide-react';

export default function PublicationForm({ publication, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    venue: '',
    year: new Date().getFullYear(),
    category: 'Journal Articles',
    doi_link: '',
    pdf_link: '',
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    if (publication) {
      setFormData({
        ...publication,
        year: publication.year || new Date().getFullYear(),
        category: publication.category || 'Journal Articles',
        is_published: publication.is_published ?? true,
        is_featured: publication.is_featured ?? false,
      });
    }
  }, [publication]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.authors) {
      toast.error('Title and Authors are required');
      return;
    }
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'authors', label: 'Authors' },
    { id: 'details', label: 'Publication Details' },
    { id: 'links', label: 'Links & Files' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl shadow-xl my-8 animate-scale-in text-slate-800 font-sans">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-semibold text-slate-900">{publication ? 'Modify Publication' : 'Create New Publication'}</h2>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-fedex-purple text-fedex-purple' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Title <span className="text-rose-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Abstract</label>
                  <textarea name="abstract" value={formData.abstract} onChange={handleChange} rows="6" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'authors' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Authors <span className="text-rose-500">*</span></label>
                  <textarea name="authors" value={formData.authors} onChange={handleChange} rows="4" placeholder="e.g. John Doe, Jane Smith, Alice Johnson" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none" required></textarea>
                  <p className="text-xs text-slate-400 mt-1">Separate authors by commas.</p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Venue / Journal</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g. Nature, IEEE Transactions on Supply Chain" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all">
                    <option value="Journal Articles">Journal Articles</option>
                    <option value="Conference Papers">Conference Papers</option>
                    <option value="White Papers">White Papers</option>
                    <option value="Book Chapters">Book Chapters</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> DOI Link</label>
                  <input type="text" name="doi_link" value={formData.doi_link} onChange={handleChange} placeholder="https://doi.org/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-4 h-4" /> PDF Link</label>
                  <input type="text" name="pdf_link" value={formData.pdf_link} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  <p className="text-xs text-slate-400 mt-1">Provide a direct URL to the PDF file.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple bg-white" />
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Published</div>
                    <div className="text-xs text-slate-500">Visible to website visitors</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple bg-white" />
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Featured</div>
                    <div className="text-xs text-slate-500">Highlight this publication specially on the main page</div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all">
            Cancel
          </button>
          <button type="submit" className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-xs gap-1.5 flex items-center">
            <Save className="w-4 h-4" /> Save Publication
          </button>
        </div>
      </form>
    </div>
  );
}
