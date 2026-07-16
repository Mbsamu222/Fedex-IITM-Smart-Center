import React, { useState, useEffect } from 'react';
import { adminApi, resolveImageUrl } from '../../services/api';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, Plus, Image as ImageIcon, Save, Trash2 } from 'lucide-react';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

export default function EventForm({ event, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    event_type: 'event',
    start_date: '',
    end_date: '',
    time: '',
    location: '',
    image_url: '',
    link: '',
    is_featured: false,
    sort_order: 0
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_date: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : ''
      });
    }
  }, [event]);

  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas conversion failed'));
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Compressing & uploading image...');
    try {
      const compressedBlob = await compressImage(file, 1200, 1200, 0.82);
      const uploadData = new FormData();
      uploadData.append('image', compressedBlob, file.name.replace(/\.[^/.]+$/, "") + ".jpg");
      
      const res = await adminApi.uploadImage(uploadData);
      setFormData(prev => ({ ...prev, [field]: res.data.url }));
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image: ' + (err.response?.data?.message || err.message), { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (parseInt(value) || 0) : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and Description are required');
      return;
    }
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'details', label: 'Details' },
    { id: 'images', label: 'Images' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-xl my-8 animate-scale-in text-slate-800 font-sans">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-semibold text-slate-900">{event ? 'Modify Event' : 'Create New Event'}</h2>
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
                className={`px-4 py-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'border-fedex-purple text-fedex-purple' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Title <span className="text-rose-500">*</span></label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Auto-generated if left empty" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Event Type</label>
                    <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all">
                      <option value="event">Event</option>
                      <option value="Industry Focused Learning">Industry Focused Learning</option>
                      <option value="Startup Bootcamp">Startup Bootcamp</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Short Description <span className="text-rose-500">*</span></label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"></textarea>
                    <p className="text-xs text-slate-500">A brief summary shown on event cards.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Content</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-200 [&_.ql-container]:min-h-[160px] sm:[&_.ql-container]:min-h-[220px] lg:[&_.ql-container]:min-h-[300px] [&_.ql-container]:text-base">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.content} 
                      onChange={handleContentChange} 
                      modules={quillModules}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
                    <input type="text" name="time" placeholder="e.g. 3:00 PM" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Venue</label>
                    <input type="text" name="location" placeholder="e.g. Room 101, DoMS IIT Madras" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Registration URL (Optional)</label>
                    <input type="url" name="link" placeholder="https://..." value={formData.link} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-5">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Event Image</label>
                  {formData.image_url ? (
                    <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                      <img src={resolveImageUrl(formData.image_url)} alt="Event" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, image_url: ''}))} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-slate-500">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-3 border-fedex-purple/30 border-t-fedex-purple rounded-full animate-spin mb-2"></div>
                          <span className="text-sm font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-10 h-10 mb-2 text-slate-400" />
                          <span className="text-sm font-medium text-slate-600 mb-1">Click to upload image</span>
                          <span className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max 5MB)</span>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'image_url')} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5">
                <div className="space-y-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-fedex-purple transition-all">
                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 bg-white text-fedex-purple focus:ring-fedex-purple" />
                    <div>
                      <span className="block text-slate-700 font-bold text-sm">Featured Event</span>
                      <span className="block text-slate-500 text-xs mt-0.5">Highlight this event on the homepage and main event feeds.</span>
                    </div>
                  </label>
                  <div className="space-y-2 max-w-xs">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                    <p className="text-xs text-slate-500">Lower numbers appear first.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-sm font-semibold transition-all">
            Cancel
          </button>
          <button type="submit" className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-sm gap-2 flex items-center">
            <Save className="w-4 h-4" /> Save Event
          </button>
        </div>
      </form>
    </div>
  );
}
