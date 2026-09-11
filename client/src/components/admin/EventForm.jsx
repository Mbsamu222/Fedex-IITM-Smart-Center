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
    speaker_name: '',
    speaker_designation: '',
    speaker_image: '',
    link: '',
    is_featured: false,
    sort_order: 0
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingSpeaker, setIsUploadingSpeaker] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        speaker_name: event.speaker_name || '',
        speaker_designation: event.speaker_designation || '',
        speaker_image: event.speaker_image || '',
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

    const isSpeaker = field === 'speaker_image';
    if (isSpeaker) {
      setIsUploadingSpeaker(true);
    } else {
      setIsUploading(true);
    }

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
      if (isSpeaker) {
        setIsUploadingSpeaker(false);
      } else {
        setIsUploading(false);
      }
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
    { id: 'speaker', label: 'Key Person / Speaker' },
    { id: 'images', label: 'Images' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl shadow-xl my-8 animate-scale-in text-slate-800 font-sans">
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

            {activeTab === 'speaker' && (
              <div className="space-y-6">
                <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-fedex-purple/10 rounded-xl text-fedex-purple mt-0.5">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Featured Key Person / Speaker (Optional)</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Add the prominent speaker, guest leader, or expert's portrait photo and designation. When added, it will be prominently and elegantly displayed on the event card and event page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Important Person / Speaker Name
                    </label>
                    <input
                      type="text"
                      name="speaker_name"
                      placeholder="e.g. Mr. Kranthi Kiran Chennamsetty / V. Ramaswamy"
                      value={formData.speaker_name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Designation / Organization / Subtitle
                    </label>
                    <input
                      type="text"
                      name="speaker_designation"
                      placeholder="e.g. Enterprise Strategy & Innovation Leader / Ex CEO - Logistics"
                      value={formData.speaker_designation || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Speaker / Important Person Photo
                    </label>
                    {formData.speaker_image ? (
                      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-fedex-purple/30 bg-white shadow-sm shrink-0">
                          <img
                            src={resolveImageUrl(formData.speaker_image)}
                            alt="Speaker"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">
                            {formData.speaker_name || 'Speaker Photo'}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {formData.speaker_designation || 'Image uploaded'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, speaker_image: '' }))}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Remove speaker photo"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-slate-500">
                        {isUploadingSpeaker ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-3 border-fedex-purple/30 border-t-fedex-purple rounded-full animate-spin mb-2"></div>
                            <span className="text-sm font-medium text-slate-700">Uploading speaker photo...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <ImageIcon className="w-9 h-9 mb-2 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 mb-1">
                              Upload Person's Portrait / Photo
                            </span>
                            <span className="text-xs text-slate-400">
                              PNG, JPG, or WEBP (clear square or portrait recommended)
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleUpload(e, 'speaker_image')}
                          disabled={isUploadingSpeaker}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Live Card Preview if speaker added */}
                {(formData.speaker_name || formData.speaker_image || formData.speaker_designation) && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Card Header Appearance Preview
                    </label>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#180733] via-[#2c1356] to-[#0a0318] p-5 text-white shadow-lg border border-slate-700">
                      {formData.image_url && (
                        <img
                          src={resolveImageUrl(formData.image_url)}
                          alt="Event background"
                          className="absolute inset-0 size-full object-cover opacity-40 filter brightness-90 contrast-110 pointer-events-none"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none"></div>

                      <div className="relative z-10 flex items-center gap-4">
                        <div className="size-20 rounded-2xl bg-black/50 border-2 border-accent/80 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-md">
                          {formData.speaker_image ? (
                            <img
                              src={resolveImageUrl(formData.speaker_image)}
                              alt="Speaker preview"
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-base font-bold text-accent">
                              {formData.speaker_name ? formData.speaker_name.slice(0, 2).toUpperCase() : 'VIP'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <span className="inline-block w-fit text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-accent bg-accent/25 border border-accent/30 px-2.5 py-0.5 rounded-md backdrop-blur-md mb-1.5 shadow-sm">
                            Key Speaker
                          </span>
                          <div className="text-base sm:text-lg font-bold text-white drop-shadow-md break-words leading-snug">
                            {formData.speaker_name || 'Speaker Name'}
                          </div>
                          {formData.speaker_designation && (
                            <div className="text-xs sm:text-[13px] text-white/95 drop-shadow-md font-normal mt-1 leading-snug break-words">
                              {formData.speaker_designation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
