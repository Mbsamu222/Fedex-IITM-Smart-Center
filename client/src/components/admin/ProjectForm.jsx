import React, { useState, useEffect } from 'react';
import { adminApi, publicApi, resolveImageUrl } from '../../services/api';
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

export default function ProjectForm({ project, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Ongoing',
    sort_order: 0,
    content: '',
    start_date: '',
    end_date: '',
    image_url: '',
    header_image_url: '',
    is_published: true,
    is_featured: false,
    listed_in_research_page: true,
    research_area_id: '',
    case_study_link: '',
    slug: '',
    associated_people: []
  });
  
  const [researchAreas, setResearchAreas] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [personSearch, setPersonSearch] = useState('');
  const [personRole, setPersonRole] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        associated_people: project.associated_people || []
      });
    }
  }, [project]);

  const fetchInitialData = async () => {
    try {
      const [areasRes, teamRes] = await Promise.all([
        adminApi.getResearchAreas(),
        publicApi.getTeam() // Get all team members
      ]);
      setResearchAreas(areasRes.data);
      setTeamMembers(teamRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load initial data');
    }
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setIsUploading(true);
    try {
      // Assuming a generic upload endpoint or we just use adminApi.uploadImage if it exists
      // The current project seems to use /api/upload
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setFormData(prev => ({ ...prev, [field]: data.url }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleAddPerson = () => {
    if (!selectedPersonId) {
      toast.error('Please select a person');
      return;
    }
    const person = teamMembers.find(p => p.id === parseInt(selectedPersonId));
    if (!person) return;
    
    // Check if already added
    if (formData.associated_people.find(p => (p.person_id || p.id) === person.id)) {
      toast.error('Person is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      associated_people: [
        ...prev.associated_people,
        {
          id: person.id, // Will be mapped to person_id in backend
          person_id: person.id,
          name: person.name,
          title: person.title,
          role: personRole,
          sort_order: prev.associated_people.length
        }
      ]
    }));
    
    setSelectedPersonId('');
    setPersonRole('');
  };

  const handleRemovePerson = (personId) => {
    setFormData(prev => ({
      ...prev,
      associated_people: prev.associated_people.filter(p => (p.person_id || p.id) !== personId)
    }));
  };
  
  const handleSortPerson = (personId, direction) => {
     // A simple swap for sort_order
     const people = [...formData.associated_people];
     const idx = people.findIndex(p => (p.person_id || p.id) === personId);
     if (idx < 0) return;
     if (direction === 'up' && idx > 0) {
       const temp = people[idx];
       people[idx] = people[idx - 1];
       people[idx - 1] = temp;
     } else if (direction === 'down' && idx < people.length - 1) {
       const temp = people[idx];
       people[idx] = people[idx + 1];
       people[idx + 1] = temp;
     }
     // Update sort_order explicitly
     people.forEach((p, i) => p.sort_order = i);
     setFormData(prev => ({ ...prev, associated_people: people }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.research_area_id) {
      toast.error('Title and Research Area are required');
      return;
    }
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'details', label: 'Details' },
    { id: 'images', label: 'Images' },
    { id: 'people', label: 'People' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl shadow-xl my-8 animate-scale-in text-slate-800 font-sans">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-semibold text-slate-900">{project ? 'Modify Project' : 'Create New Project'}</h2>
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
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Auto-generated if left empty" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all">
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"></textarea>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Research Area <span className="text-rose-500">*</span></label>
                <select name="research_area_id" value={formData.research_area_id} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" required>
                  <option value="">Select Research Area</option>
                  {researchAreas.map(area => (
                    <option key={area.id} value={area.id}>{area.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={handleContentChange} 
                modules={quillModules}
                className="h-[240px] sm:h-[300px] lg:h-[400px] mb-16" // larger height and margin for rich toolbar
              />
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Case Study Link</label>
              <input type="text" name="case_study_link" value={formData.case_study_link} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" placeholder="https://..." />
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Card Image (Thumbnail)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-fedex-purple transition-colors">
                  {formData.image_url ? (
                    <img src={resolveImageUrl(formData.image_url)} alt="Card" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-fedex-purple transition-colors" />
                  )}
                  <input type="file" onChange={(e) => handleUpload(e, 'image_url')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div className="flex-1 space-y-2">
                  <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Or enter image URL manually" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                  {isUploading && <p className="text-xs text-fedex-purple font-medium">Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Header Image (Detail Page)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-64 h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-fedex-purple transition-colors">
                  {formData.header_image_url ? (
                    <img src={resolveImageUrl(formData.header_image_url)} alt="Header" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-fedex-purple transition-colors" />
                  )}
                  <input type="file" onChange={(e) => handleUpload(e, 'header_image_url')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div className="flex-1 space-y-2">
                  <input type="text" name="header_image_url" value={formData.header_image_url} onChange={handleChange} placeholder="Or enter image URL manually" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Add Associated Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-6 space-y-1">
                  <label className="text-xs font-medium text-slate-500">Select Team Member</label>
                  <select value={selectedPersonId} onChange={(e) => setSelectedPersonId(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all">
                    <option value="">Select Team Member...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name} ({member.title})</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-slate-500">Role</label>
                  <input type="text" placeholder="e.g. Lead Researcher" value={personRole} onChange={(e) => setPersonRole(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
                </div>
                <div className="md:col-span-2">
                  <button type="button" onClick={handleAddPerson} className="w-full py-2.5 bg-fedex-purple text-white font-semibold rounded-lg hover:bg-fedex-purple/95 flex justify-center items-center gap-1.5 transition-all">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Associated People List</h3>
              {formData.associated_people.length === 0 ? (
                <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">No people associated yet.</div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm">
                  {formData.associated_people.map((person, index) => (
                    <div key={person.person_id || person.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800">{person.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{person.role || person.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleSortPerson(person.person_id || person.id, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent">↑</button>
                        <button type="button" onClick={() => handleSortPerson(person.person_id || person.id, 'down')} disabled={index === formData.associated_people.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent">↓</button>
                        <div className="w-px h-5 bg-slate-200 mx-1"></div>
                        <button type="button" onClick={() => handleRemovePerson(person.person_id || person.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all" />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple bg-white" />
                <div>
                  <div className="font-semibold text-sm text-slate-800">Published (Visible on site)</div>
                  <div className="text-xs text-slate-500">Uncheck to hide project from visitors</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple bg-white" />
                <div>
                  <div className="font-semibold text-sm text-slate-800">Featured Project</div>
                  <div className="text-xs text-slate-500">Show in the prominent featured sections</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <input type="checkbox" name="listed_in_research_page" checked={formData.listed_in_research_page} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fedex-purple focus:ring-fedex-purple bg-white" />
                <div>
                  <div className="font-semibold text-sm text-slate-800">Listed in Research Page</div>
                  <div className="text-xs text-slate-500">Include in the main Research landscape listing</div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all">
          Cancel
        </button>
        <button type="submit" className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-xs gap-1.5 flex items-center">
          <Save className="w-4 h-4" /> Save Project
        </button>
      </div>
      </div>
      </form>
    </div>
  );
}
