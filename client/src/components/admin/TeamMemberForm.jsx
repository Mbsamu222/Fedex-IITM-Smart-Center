import React, { useState, useEffect } from 'react';
import { adminApi, resolveImageUrl } from '../../services/api';
import toast from 'react-hot-toast';
import { X, Image as ImageIcon, Trash2, Users } from 'lucide-react';

const TEAM_CATEGORIES = [
  { value: 'advisory', label: 'Advisory Board' },
  { value: 'executive', label: 'Executive Committee' },
  { value: 'center', label: 'Center Team' },
  { value: 'faculty', label: 'Faculty Team' },
  { value: 'research', label: 'Research Scholars' },
  { value: 'postdoc', label: 'Postdoctoral Researchers' }
];

export default function TeamMemberForm({ member, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    image_url: '',
    category: [],
    bio: '',
    sort_order: 0,
    is_active: true
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (member) {
      let categories = [];
      if (Array.isArray(member.category)) {
        categories = member.category;
      } else if (typeof member.category === 'string' && member.category.trim()) {
        categories = member.category.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      }

      setFormData({
        name: member.name || '',
        title: member.title || '',
        department: member.department || '',
        email: member.email || '',
        image_url: member.image_url || '',
        category: categories,
        bio: member.bio || '',
        sort_order: member.sort_order ?? 0,
        is_active: member.is_active !== false
      });
    }
  }, [member]);

  const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.85) => {
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Compressing & uploading photo...');
    try {
      const compressedBlob = await compressImage(file, 1000, 1000, 0.85);
      const uploadData = new FormData();
      uploadData.append('image', compressedBlob, file.name.replace(/\.[^/.]+$/, "") + ".jpg");

      const res = await adminApi.uploadImage(uploadData);
      setFormData(prev => ({ ...prev, image_url: res.data.url }));
      toast.success('Photo uploaded successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload photo: ' + (err.response?.data?.message || err.message), { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (parseInt(value, 10) || 0) : value
    }));
  };

  const handleCategoryToggle = (catValue) => {
    setFormData(prev => {
      const current = Array.isArray(prev.category) ? prev.category : [];
      if (current.includes(catValue)) {
        return { ...prev, category: current.filter(c => c !== catValue) };
      } else {
        return { ...prev, category: [...current, catValue] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      toast.error('Team Member Name is required');
      return;
    }
    if (!formData.category || formData.category.length === 0) {
      toast.error('Please select at least one Category for this member');
      return;
    }

    const payload = {
      ...formData,
      category: formData.category.join(', '),
      sort_order: parseInt(formData.sort_order, 10) || 0
    };

    onSave(payload);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'media', label: 'Photo' },
    { id: 'settings', label: 'Settings & Sort Order' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-xl my-8 animate-scale-in text-slate-800 font-sans">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {member ? 'Modify Team Member' : 'Create New Team Member'}
        </h2>
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
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Title / Role</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Center Director, Professor"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Department / Institute</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Dept. of Management Studies"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. name@iitm.ac.in"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Categories (Select all that apply) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      {TEAM_CATEGORIES.map(cat => {
                        const checked = formData.category.includes(cat.value);
                        return (
                          <label
                            key={cat.value}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                              checked
                                ? 'bg-fedex-purple/10 border-fedex-purple/40 text-fedex-purple font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCategoryToggle(cat.value)}
                              className="size-4 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple"
                            />
                            <span className="text-xs">{cat.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / Research Focus</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Brief description or area of focus..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* PHOTO TAB */}
            {activeTab === 'media' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Photo</label>

                  {formData.image_url ? (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="size-20 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                        <img
                          src={resolveImageUrl(formData.image_url)}
                          alt="Profile Preview"
                          className="size-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{formData.name || 'Member Photo'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{formData.image_url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                        title="Remove photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-fedex-purple hover:bg-slate-50/50 transition-all text-center">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-fedex-purple">
                          <div className="size-8 border-2 border-fedex-purple border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Uploading photo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-10 h-10 mb-2 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 mb-1">Click to upload portrait photo</span>
                          <span className="text-xs text-slate-400">JPG, PNG, WebP up to 5MB</span>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS & SORT ORDER TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Active Status */}
                <label className="flex items-center gap-3 cursor-pointer select-none p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-fedex-purple transition-all">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="size-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple"
                  />
                  <div>
                    <span className="block text-slate-800 font-bold text-sm">Active Member</span>
                    <span className="block text-slate-500 text-xs mt-0.5">When enabled, this member is visible on the public website.</span>
                  </div>
                </label>

                {/* Sort Order (Identical to Events sort method) */}
                <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-2 max-w-md">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sort Order / Display Sequence
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                  />
                  <p className="text-xs text-slate-500">
                    <strong>Lower numbers appear first</strong> (e.g. 1, 2, 3...). Enter the order you want this member to appear on the team pages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-fedex-purple/20 text-sm"
          >
            {member ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
