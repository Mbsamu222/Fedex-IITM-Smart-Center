import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi, resolveImageUrl } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus, Edit3, Trash2, X, Save, ArrowLeft, LogOut, Search,
  ChevronLeft, Eye, EyeOff, Check, Menu, LayoutDashboard, Monitor,
  TrendingUp, Briefcase, Calendar, PenLine, BookOpen, Users, Image,
  BarChart3, MessageSquare, Settings, Bell, ArrowUp, ArrowDown,
  ArrowUpToLine, ArrowDownToLine, GripVertical, ListOrdered,
  LayoutGrid, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import ProjectForm from '../../components/admin/ProjectForm';
import PublicationForm from '../../components/admin/PublicationForm';
import EventForm from '../../components/admin/EventForm';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const teamCategoryTabs = [
  { key: 'all', label: 'All Teams' },
  { key: 'advisory', label: 'Advisory Board' },
  { key: 'executive', label: 'Executive Committee' },
  { key: 'center', label: 'Center Team' },
  { key: 'faculty', label: 'Faculty Team' },
  { key: 'research', label: 'Research Scholars' },
  { key: 'postdoc', label: 'Postdoctoral' },
];

const sectionConfig = {
  hero: {
    title: 'Hero Sections',
    fields: [
      { key: 'title', label: 'Title', type: 'textarea' },
      { key: 'title_highlight', label: 'Title Highlight Text', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'cta_primary_text', label: 'Primary CTA Text', type: 'text' },
      { key: 'cta_primary_link', label: 'Primary CTA Link', type: 'text' },
      { key: 'cta_secondary_text', label: 'Secondary CTA Text', type: 'text' },
      { key: 'cta_secondary_link', label: 'Secondary CTA Link', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'floating_tag', label: 'Floating Tag', type: 'text' },
      { key: 'floating_text', label: 'Floating Text', type: 'text' },
      { key: 'is_active', label: 'Active', type: 'checkbox' },
    ],
    api: { get: () => adminApi.getHeroAll(), create: adminApi.createHero, update: adminApi.updateHero, delete: adminApi.deleteHero },
    displayField: 'title',
  },
  'research-areas': {
    title: 'Research Areas',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'icon', label: 'Icon (Brain/Plane/TrendingUp/Building/Heart/Leaf/Monitor)', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getResearchAreas, create: adminApi.createResearchArea, update: adminApi.updateResearchArea, delete: adminApi.deleteResearchArea },
    displayField: 'title',
  },
  projects: {
    title: 'Projects',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'research_area_id', label: 'Research Area', type: 'select', options: [] },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'case_study_link', label: 'Case Study Link', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'checkbox' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getProjects, create: adminApi.createProject, update: adminApi.updateProject, delete: adminApi.deleteProject },
    displayField: 'title',
  },
  events: {
    title: 'Events',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'richtext', required: true },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'time', label: 'Time (e.g. 3:00 PM)', type: 'text' },
      { key: 'location', label: 'Location / Venue', type: 'text' },
      { key: 'event_type', label: 'Event Type', type: 'select', options: ['Industry Focused Learning', 'Startup Bootcamp', 'Seminar', 'Hackathon', 'Workshop', 'Other'] },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'link', label: 'Link', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'checkbox' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getEvents, create: adminApi.createEvent, update: adminApi.updateEvent, delete: adminApi.deleteEvent },
    displayField: 'title',
  },
  activities: {
    title: 'Activities Management',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'activity_type', label: 'Activity Type', type: 'select', options: ['Job Posting', 'Seminar', 'Workshop', 'Announcement', 'Other'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Expired', 'Archived'] },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'expiration_date', label: 'Expiration Date', type: 'date' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'contact_email', label: 'Contact Email', type: 'text' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      { key: 'external_url', label: 'External URL', type: 'text' },
    ],
    api: { get: adminApi.getActivities, create: adminApi.createActivity, update: adminApi.updateActivity, delete: adminApi.deleteActivity },
    displayField: 'title',
  },
  news: {
    title: 'News & Updates',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'published_date', label: 'Published Date', type: 'date' },
      { key: 'link', label: 'Read More Link', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'is_active', label: 'Active (show in homepage popup)', type: 'checkbox' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getNews, create: adminApi.createNews, update: adminApi.updateNews, delete: adminApi.deleteNews },
    displayField: 'title',
  },
  blogs: {
    title: 'Blog Posts',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { key: 'content', label: 'Content', type: 'richtext' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'published_date', label: 'Published Date', type: 'date' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
    ],
    api: { get: adminApi.getBlogs, create: adminApi.createBlog, update: adminApi.updateBlog, delete: adminApi.deleteBlog },
    displayField: 'title',
  },
  publications: {
    title: 'Publications',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'authors', label: 'Authors', type: 'text', required: true },
      { key: 'venue', label: 'Venue / Journal', type: 'text' },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'abstract', label: 'Abstract', type: 'textarea' },
      { key: 'doi_link', label: 'DOI Link', type: 'text' },
      { key: 'pdf_link', label: 'PDF Link', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
    ],
    api: { get: adminApi.getPublications, create: adminApi.createPublication, update: adminApi.updatePublication, delete: adminApi.deletePublication },
    displayField: 'title',
  },
  team: {
    title: 'Team Members',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'title', label: 'Title / Role', type: 'text' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      {
        key: 'category', label: 'Categories (Select all that apply)', type: 'multiselect', required: true, options: [
          { value: 'advisory', label: 'Advisory Board' },
          { value: 'executive', label: 'Executive Committee' },
          { value: 'center', label: 'Center Team' },
          { value: 'faculty', label: 'Faculty Team' },
          { value: 'research', label: 'Research Scholars' },
          { value: 'postdoc', label: 'Postdoctoral Researchers' }
        ]
      },
      { key: 'bio', label: 'Bio / Area of Focus', type: 'textarea' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active (visible on public site)', type: 'checkbox' },
    ],
    api: { get: () => adminApi.getTeam(), create: adminApi.createTeamMember, update: adminApi.updateTeamMember, delete: adminApi.deleteTeamMember },
    displayField: 'name',
    subtitleField: 'category',
  },
  gallery: {
    title: 'Gallery Images',
    fields: [
      { key: 'image_url', label: 'Image', type: 'image', required: true },
      { key: 'caption', label: 'Caption', type: 'text' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Highlights', 'Event Gallery', 'Research']
      },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getGallery, create: adminApi.createGalleryImage, update: adminApi.updateGalleryImage, delete: adminApi.deleteGalleryImage },
    displayField: 'caption',
  },
  stats: {
    title: 'Statistics',
    fields: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'value', label: 'Value', type: 'text', required: true },
      { key: 'suffix', label: 'Suffix (e.g., +)', type: 'text' },
      { key: 'icon', label: 'Icon (FileText/Briefcase/Users/Building)', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
    api: { get: adminApi.getStats, create: adminApi.createStat, update: adminApi.updateStat, delete: adminApi.deleteStat },
    displayField: 'label',
    subtitleField: 'value',
  },
  messages: {
    title: 'Contact Messages',
    fields: [],
    api: { get: adminApi.getMessages, delete: adminApi.deleteMessage },
    displayField: 'subject',
    readOnly: true,
  },
  settings: {
    title: 'Site Settings',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', required: true },
      { key: 'site_tagline', label: 'Site Tagline', type: 'textarea' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      { key: 'contact_email', label: 'Contact Email', type: 'text' },
      { key: 'contact_address', label: 'Contact Address', type: 'textarea' },
      { key: 'footer_disclaimer', label: 'Footer Disclaimer', type: 'textarea' },
      { key: 'copyright_text', label: 'Copyright Text', type: 'text' },
    ],
    api: { get: adminApi.getSettings, update: (id, data) => adminApi.updateSettings(data) },
    displayField: 'site_name',
  },
};

const navigationLinks = [
  { key: 'hero', label: 'Hero Section', icon: Monitor },
  { key: 'research-areas', label: 'Research Areas', icon: TrendingUp },
  { key: 'projects', label: 'Projects', icon: Briefcase },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'activities', label: 'Announcements', icon: BookOpen },
  { key: 'news', label: 'News & Updates', icon: Bell },
  { key: 'blogs', label: 'Blogs & Insights', icon: PenLine },
  { key: 'publications', label: 'Publications', icon: BookOpen },
  { key: 'team', label: 'Team Members', icon: Users },
  { key: 'gallery', label: 'Gallery', icon: Image },
  { key: 'stats', label: 'Key Statistics', icon: BarChart3 },
  { key: 'messages', label: 'Inbox Messages', icon: MessageSquare },
  { key: 'settings', label: 'Site Settings', icon: Settings },
];

const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
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
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas conversion failed'));
            }
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

export default function AdminCrud() {
  const { section } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const config = sectionConfig[section];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({});
  const [researchAreas, setResearchAreas] = useState([]);
  const [uploadingFields, setUploadingFields] = useState({});
  const [localPreviews, setLocalPreviews] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [teamCategoryFilter, setTeamCategoryFilter] = useState('all');
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderList, setReorderList] = useState([]);
  const [editingOrder, setEditingOrder] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const hasImageColumn = config && (
    config.fields?.some(f => f.type === 'image' || f.key === 'image_url') ||
    ['hero', 'research-areas', 'projects', 'events', 'activities', 'news', 'blogs', 'team', 'gallery'].includes(section)
  );

  useEffect(() => {
    if (config) fetchItems();
    setCurrentPage(1);
  }, [section]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'add' && config) {
      openCreateModal();
      navigate(`/admin/${section}`, { replace: true });
    }
  }, [location, section]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (section === 'settings') {
        const res = await config.api.get();
        setSettingsData(res.data || {});
        setItems([res.data || {}]);
      } else {
        const res = await config.api.get();
        setItems(res.data || []);

        if (section === 'projects') {
          const raRes = await adminApi.getResearchAreas();
          setResearchAreas(raRes.data || []);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    const initial = {};
    config.fields.forEach(f => {
      if (f.type === 'checkbox') {
        // is_active defaults to true (visible) for team members, false for other checkboxes
        initial[f.key] = (section === 'team' && f.key === 'is_active') ? true : false;
      } else if (f.type === 'number') {
        initial[f.key] = 0;
      } else if (f.type === 'multiselect') {
        initial[f.key] = [];
      } else {
        initial[f.key] = '';
      }
    });
    setFormData(initial);
    setLocalPreviews({});
    setUploadingFields({});
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    const data = {};
    config.fields.forEach(f => {
      let val = item[f.key];
      if (f.type === 'date' && val) val = val.split('T')[0];
      if (f.type === 'checkbox') val = !!val;
      if (f.type === 'number') val = val || 0;
      if (f.type === 'multiselect') {
        if (Array.isArray(val)) {
          val = val;
        } else if (typeof val === 'string' && val.trim()) {
          val = val.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          val = [];
        }
      }
      data[f.key] = val ?? '';
    });
    setFormData(data);
    setLocalPreviews({});
    setUploadingFields({});
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSaveProject = async (projectData) => {
    setSaving(true);
    try {
      if (editingItem) {
        await config.api.update(editingItem.id, projectData);
        toast.success(`${config.title.replace(/s$/, '')} updated successfully`);
      } else {
        await config.api.create(projectData);
        toast.success(`${config.title.replace(/s$/, '')} created successfully`);
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Error saving record: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    for (const field of config.fields) {
      if (field.required) {
        if (field.type === 'multiselect') {
          const selected = Array.isArray(formData[field.key])
            ? formData[field.key]
            : (formData[field.key] ? [formData[field.key]] : []);
          if (selected.length === 0) {
            toast.error(`Please select at least one ${field.label.toLowerCase()}.`);
            return;
          }
        } else if (!formData[field.key] && formData[field.key] !== 0) {
          toast.error(`${field.label} is required.`);
          return;
        }
      }
    }

    const payload = { ...formData };
    config.fields.forEach(f => {
      if (f.type === 'multiselect' && Array.isArray(payload[f.key])) {
        payload[f.key] = payload[f.key].join(', ');
      }
    });

    setSaving(true);
    try {
      if (editingItem) {
        await config.api.update(editingItem.id, payload);
        toast.success('Updated successfully!');
      } else {
        await config.api.create(payload);
        toast.success('Created successfully!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await config.api.delete(id);
      toast.success('Deleted successfully!');
      setDeleteConfirm(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await adminApi.markMessageRead(id);
      fetchItems();
    } catch { }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-700">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-3xl max-w-sm shadow-sm">
          <p className="text-slate-500 text-lg mb-6">Section layout not found.</p>
          <Link to="/admin" className="inline-flex bg-fedex-purple hover:bg-fedex-purple/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-fedex-purple/10">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getFieldsWithOptions = () => {
    if (!config || !config.fields) return [];
    return config.fields.map(f => {
      if (f.key === 'research_area_id') {
        return {
          ...f,
          options: researchAreas.map(r => ({ value: r.id, label: r.title }))
        };
      }
      return f;
    });
  };

  const filteredItems = items.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const match = Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchLower)
      );
      if (!match) return false;
    }
    if (section === 'team' && teamCategoryFilter !== 'all') {
      const cat = (item.category || '').toLowerCase();
      if (!cat.includes(teamCategoryFilter.toLowerCase())) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (section === 'team') {
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    }
    return 0;
  });

  useEffect(() => {
    if (section === 'team') {
      setReorderList([...filteredItems]);
    }
  }, [items, teamCategoryFilter, section, searchTerm]);

  const handleQuickMove = async (item, direction) => {
    const list = [...filteredItems];
    const index = list.findIndex(i => i.id === item.id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const orders = list.map((m, idx) => ({
      id: m.id,
      sort_order: idx + 1
    }));

    try {
      await adminApi.reorderTeam(orders);
      toast.success(`Moved ${item.name} ${direction}!`);
      fetchItems();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handleInlineOrderSave = async (id, newOrder) => {
    const num = parseInt(newOrder);
    if (isNaN(num)) return;
    try {
      await adminApi.reorderTeam([{ id, sort_order: num }]);
      toast.success('Position updated!');
      setEditingOrder(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchItems();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const moveInReorderList = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= reorderList.length) return;
    const updated = [...reorderList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setReorderList(updated);
  };

  const handleSaveReorderedList = async () => {
    setSaving(true);
    try {
      const orders = reorderList.map((item, idx) => ({
        id: item.id,
        sort_order: idx + 1
      }));
      await adminApi.reorderTeam(orders);
      toast.success('Custom team display order saved successfully!');
      fetchItems();
    } catch (err) {
      toast.error('Failed to save order: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = (section === 'team' && reorderMode) 
    ? reorderList 
    : filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans w-full max-w-full overflow-hidden">

      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/smart-logo.png"
              alt="IIT Madras FedEx SMART Center Logo"
              className="h-9 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</div>
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="pt-4 border-t border-slate-100 my-4"></div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules</div>
          <div className="space-y-1">
            {navigationLinks.map(link => (
              <Link
                key={link.key}
                to={`/admin/${link.key}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${section === link.key
                    ? 'bg-fedex-purple/10 text-fedex-purple border-l-2 border-fedex-purple font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <link.icon className={`w-4 h-4 ${section === link.key ? 'text-fedex-purple' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-80 max-w-[85vw] bg-white h-full border-r border-slate-200 animate-slide-in-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <img
                src="/smart-logo.png"
                alt="IIT Madras FedEx SMART Center Logo"
                className="h-9 w-auto"
              />
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <div className="pt-4 border-t border-slate-100 my-4"></div>
              <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules</div>
              <div className="space-y-1">
                {navigationLinks.map(link => (
                  <Link
                    key={link.key}
                    to={`/admin/${link.key}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${section === link.key
                        ? 'bg-fedex-purple/10 text-fedex-purple border-l-2 border-fedex-purple font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <link.icon className={`w-4 h-4 ${section === link.key ? 'text-fedex-purple' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* TOP NAVBAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 h-16 flex items-center">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Link to="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-all">
                  <ChevronLeft className="w-4 h-4" /> Dashboard
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 font-semibold text-sm">{config.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 flex-grow">

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{config.title}</h1>
              {section !== 'settings' && <p className="text-slate-500 text-xs mt-1">{items.length} total entries found</p>}
            </div>
            {section !== 'settings' && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                  />
                </div>
                {!config.readOnly && (
                  <button onClick={openCreateModal} className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-xs flex-shrink-0">
                    <Plus className="w-4 h-4" /> Add Record
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loader or Content */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-3 border-fedex-purple/30 border-t-fedex-purple rounded-full animate-spin"></div>
            </div>
          ) : section === 'settings' ? (
            /* Site Settings Form Layout */
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-2xl">
              <div className="space-y-6">
                {config.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows="3"
                        value={settingsData[field.key] || ''}
                        onChange={(e) => setSettingsData({ ...settingsData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={settingsData[field.key] || ''}
                        onChange={(e) => setSettingsData({ ...settingsData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await config.api.update(null, settingsData);
                        toast.success('Site Settings updated successfully!');
                        fetchItems();
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Update failed.');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-xs gap-1.5 flex items-center disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Settings</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <p className="text-slate-500 text-sm mb-6">No records match the filter criteria.</p>
              {!config.readOnly && (
                <button onClick={openCreateModal} className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 mx-auto text-xs">
                  <Plus className="w-4 h-4" /> Add First Record
                </button>
              )}
            </div>
          ) : section === 'messages' ? (
            /* Messages Feed Layout */
            <div className="space-y-4">
              {paginatedItems.map((msg) => (
                <div key={msg.id} className={`bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden ${!msg.is_read ? 'border-l-4 border-l-fedex-orange' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-slate-900 font-semibold">{msg.name}</h3>
                        {!msg.is_read && (
                          <span className="px-2.5 py-0.5 bg-orange-50 text-fedex-orange text-[10px] rounded-full font-bold border border-orange-100">New</span>
                        )}
                      </div>
                      <p className="text-fedex-purple text-xs font-semibold mb-2">{msg.email}</p>
                      {msg.subject && <p className="text-slate-800 text-sm font-semibold mb-2">{msg.subject}</p>}
                      <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-slate-400 text-[10px] mt-4 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!msg.is_read && (
                        <button onClick={() => handleMarkRead(msg.id)} className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-500/30 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all" title="Mark as read">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(msg.id)}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-rose-500/30 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isAdmin={true} />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* TEAM MEMBERS CATEGORY FILTER & REORDER TOOLBAR */}
              {section === 'team' && (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Team:</span>
                    {teamCategoryTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setTeamCategoryFilter(tab.key);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          teamCategoryFilter === tab.key
                            ? 'bg-fedex-purple text-white shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Reorder Mode Switcher & Save Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setReorderMode(!reorderMode)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        reorderMode
                          ? 'bg-fedex-orange text-white border-fedex-orange shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title="Toggle visual custom order mode"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>{reorderMode ? 'Table View' : 'Visual Reorder Mode'}</span>
                    </button>

                    {reorderMode && (
                      <button
                        onClick={handleSaveReorderedList}
                        disabled={saving}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save New Order</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* VISUAL REORDER MODE CARDS */}
              {section === 'team' && reorderMode ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-fedex-purple">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 shrink-0" />
                      <span><strong>Visual Sorting:</strong> Drag cards or use the Move buttons (Top, Up, Down, Bottom) to change website display order. Click <strong>Save New Order</strong> when done.</span>
                    </div>
                    <button
                      onClick={handleSaveReorderedList}
                      disabled={saving}
                      className="flex items-center justify-center gap-1.5 bg-fedex-purple hover:bg-fedex-purple/90 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0 disabled:opacity-50"
                    >
                      {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save New Order
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {reorderList.map((member, idx) => {
                      const fullImg = member.image_url ? resolveImageUrl(member.image_url) : null;
                      return (
                        <div
                          key={member.id || idx}
                          draggable
                          onDragStart={() => setDraggedIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== idx) {
                              moveInReorderList(draggedIndex, idx);
                              setDraggedIndex(null);
                            }
                          }}
                          className={`bg-white border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                            draggedIndex === idx ? 'opacity-40 border-dashed border-fedex-purple scale-[0.99]' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-1">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 font-display text-xs font-bold text-slate-700">
                              #{idx + 1}
                            </div>
                            <div className="size-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                              {fullImg ? (
                                <img src={fullImg} alt={member.name} className="size-full object-cover" />
                              ) : (
                                <Users className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{member.title || 'No role specified'}</p>
                              {member.department && <p className="text-[11px] text-slate-400">{member.department}</p>}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {(member.category || '').split(',').map((c, ci) => (
                                  <span key={ci} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                                    {c.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => moveInReorderList(idx, 0)}
                              disabled={idx === 0}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Send to Top"
                            >
                              <ArrowUpToLine className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveInReorderList(idx, idx - 1)}
                              disabled={idx === 0}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveInReorderList(idx, idx + 1)}
                              disabled={idx === reorderList.length - 1}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveInReorderList(idx, reorderList.length - 1)}
                              disabled={idx === reorderList.length - 1}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Send to Bottom"
                            >
                              <ArrowDownToLine className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* TABULAR GRID VIEW */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-6">ID</th>
                          {hasImageColumn && <th className="py-4 px-4 text-center">Image</th>}
                          <th className="py-4 px-6">{config.displayField === 'name' ? 'Name' : 'Title'}</th>
                          {config.subtitleField && (
                            <th className="py-4 px-6 hidden md:table-cell">
                              {config.subtitleField.charAt(0).toUpperCase() + config.subtitleField.slice(1)}
                            </th>
                          )}
                          {section === 'team' && (
                            <th className="py-4 px-4 text-center">Display Order</th>
                          )}
                          {section === 'team' && (
                            <th className="py-4 px-6 hidden sm:table-cell">Status</th>
                          )}
                          <th className="py-4 px-6 hidden lg:table-cell">Created</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {paginatedItems.map((item, i) => {
                          const imgVal = item.image_url || item.image || item.url;
                          const fullImgUrl = imgVal ? resolveImageUrl(imgVal) : null;

                          return (
                            <tr key={item.id || i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6 text-slate-400 text-xs font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>

                              {hasImageColumn && (
                                <td className="py-3 px-4 text-center">
                                  {fullImgUrl ? (
                                    <div
                                      className="relative group/img cursor-pointer inline-block overflow-hidden rounded-xl border border-slate-200 shadow-xs bg-slate-100 transition-transform duration-200 hover:scale-105"
                                      onClick={() => setPreviewImage(fullImgUrl)}
                                      title="Click to view full image"
                                    >
                                      <img
                                        src={fullImgUrl}
                                        alt={item[config.displayField] || 'Thumbnail'}
                                        className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-xl"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                          if (e.target.nextElementSibling) {
                                            e.target.nextElementSibling.style.display = 'flex';
                                          }
                                        }}
                                      />
                                      <div className="hidden w-16 h-12 sm:w-20 sm:h-14 rounded-xl bg-slate-100 flex-col items-center justify-center text-slate-400 gap-0.5">
                                        <Image className="w-4 h-4 text-slate-300" />
                                        <span className="text-[9px] font-medium text-slate-400">No Image</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-16 h-12 sm:w-20 sm:h-14 mx-auto rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-slate-300 gap-0.5">
                                      <Image className="w-4 h-4 text-slate-300" />
                                      <span className="text-[9px] font-medium text-slate-400">No Image</span>
                                    </div>
                                  )}
                                </td>
                              )}

                              <td className="py-4 px-6">
                                <p className="text-slate-800 font-semibold line-clamp-1 max-w-sm sm:max-w-md">
                                  {item[config.displayField] || `Record #${item.id}`}
                                </p>
                              </td>
                              {config.subtitleField && (
                                <td className="py-4 px-6 hidden md:table-cell">
                                  {typeof item[config.subtitleField] === 'string' && item[config.subtitleField].includes(',') ? (
                                    <div className="flex flex-wrap gap-1">
                                      {item[config.subtitleField].split(',').map((cat, ci) => (
                                        <span key={ci} className="text-slate-600 text-xs bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full font-medium">
                                          {cat.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                                      {item[config.subtitleField]}
                                    </span>
                                  )}
                                </td>
                              )}
                              {section === 'team' && (
                                <td className="py-4 px-4 text-center">
                                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-xs">
                                    <input
                                      type="number"
                                      value={editingOrder[item.id] !== undefined ? editingOrder[item.id] : (item.sort_order ?? 0)}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, [item.id]: e.target.value })}
                                      onBlur={(e) => {
                                        if (editingOrder[item.id] !== undefined && editingOrder[item.id] !== item.sort_order) {
                                          handleInlineOrderSave(item.id, e.target.value);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleInlineOrderSave(item.id, e.target.value);
                                        }
                                      }}
                                      className="w-12 px-1.5 py-0.5 text-center text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-fedex-purple"
                                      title="Type position and press Enter"
                                    />
                                    <div className="flex flex-col gap-0.5">
                                      <button
                                        onClick={() => handleQuickMove(item, 'up')}
                                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-colors"
                                        title="Move Up on website"
                                      >
                                        <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                                      </button>
                                      <button
                                        onClick={() => handleQuickMove(item, 'down')}
                                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-colors"
                                        title="Move Down on website"
                                      >
                                        <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              )}
                              {section === 'team' && (
                                <td className="py-4 px-6 hidden sm:table-cell">
                                  {item.is_active !== false ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                      <span className="size-1.5 rounded-full bg-red-500"></span>
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              )}
                              <td className="py-4 px-6 hidden lg:table-cell">
                                <span className="text-slate-400 text-xs">
                                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-1.5 bg-slate-50 border border-slate-200 hover:border-fedex-purple/40 hover:bg-fedex-purple/10 text-slate-500 hover:text-fedex-purple rounded-lg transition-all"
                                    title="Edit Record"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(item.id)}
                                    className="p-1.5 bg-slate-50 border border-slate-200 hover:border-rose-500/40 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isAdmin={true} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL VIEW - CREATE / EDIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] overflow-y-auto">
          {section === 'projects' ? (
            <ProjectForm
              project={editingItem}
              onSave={handleSaveProject}
              onCancel={() => setShowModal(false)}
            />
          ) : section === 'publications' ? (
            <PublicationForm
              publication={editingItem}
              onSave={handleSaveProject}
              onCancel={() => setShowModal(false)}
            />
          ) : section === 'events' ? (
            <EventForm
              event={editingItem}
              onSave={handleSaveProject}
              onCancel={() => setShowModal(false)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-xl my-8 animate-scale-in">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  {editingItem ? 'Modify' : 'Create New'} {config.title.replace(/s$/, '')}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
                {getFieldsWithOptions().map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    {field.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={!!formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 bg-slate-50 text-fedex-purple focus:ring-fedex-purple"
                        />
                        {section === 'team' && field.key === 'is_active' ? (
                          <span className="flex items-center gap-2">
                            {formData[field.key] ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all">
                                <span className="size-2 rounded-full bg-emerald-500"></span>
                                Active — Visible on public site
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 transition-all">
                                <span className="size-2 rounded-full bg-red-500"></span>
                                Inactive — Hidden from public site
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-700 font-medium text-sm">Activate and publish</span>
                        )}
                      </label>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows="4"
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all resize-none"
                        placeholder={`Enter text details for ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'richtext' ? (
                      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 [&_.ql-container]:min-h-[140px] sm:[&_.ql-container]:min-h-[180px] lg:[&_.ql-container]:min-h-[200px] [&_.ql-container]:text-base">
                        <ReactQuill
                          theme="snow"
                          value={formData[field.key] || ''}
                          onChange={(val) => setFormData({ ...formData, [field.key]: val })}
                          modules={quillModules}
                          className="bg-white"
                        />
                      </div>
                    ) : field.type === 'multiselect' ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          {field.options?.map((opt) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const label = typeof opt === 'object' ? opt.label : opt;
                            const selectedList = Array.isArray(formData[field.key])
                              ? formData[field.key]
                              : (typeof formData[field.key] === 'string' && formData[field.key]
                                  ? formData[field.key].split(',').map(s => s.trim())
                                  : []);
                            const isChecked = selectedList.includes(val);

                            return (
                              <div
                                key={val}
                                onClick={() => {
                                  const next = isChecked
                                    ? selectedList.filter(item => item !== val)
                                    : [...selectedList, val];
                                  setFormData({ ...formData, [field.key]: next });
                                }}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                                  isChecked
                                    ? 'bg-fedex-purple/10 border-fedex-purple text-fedex-purple shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <div className={`size-4 rounded flex items-center justify-center border transition-colors ${
                                  isChecked
                                    ? 'bg-fedex-purple border-fedex-purple text-white'
                                    : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="size-3 stroke-[3]" />}
                                </div>
                                <span>{label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-slate-400">Select all team categories where this member should appear.</p>
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.key === 'research_area_id' ? (parseInt(e.target.value) || null) : e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                      >
                        <option value="">Select {field.label}...</option>
                        {field.options?.map((opt) => {
                          const val = typeof opt === 'object' ? opt.value : opt;
                          const label = typeof opt === 'object' ? opt.label : opt;
                          return (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    ) : field.type === 'image' ? (
                      <div className="space-y-3">
                        {(formData[field.key] || localPreviews[field.key]) && (
                          <div className="relative w-40 h-28 border border-slate-200 rounded-xl overflow-hidden group bg-slate-50 flex items-center justify-center">
                            <img
                              src={localPreviews[field.key] || resolveImageUrl(formData[field.key])}
                              alt={field.label}
                              className="w-full h-full object-cover"
                            />
                            {uploadingFields[field.key] && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              </div>
                            )}
                            {!uploadingFields[field.key] && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, [field.key]: '' });
                                  setLocalPreviews({ ...localPreviews, [field.key]: '' });
                                }}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors inline-flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            {formData[field.key] || localPreviews[field.key] ? 'Replace Image' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                // Set immediate local preview
                                const localUrl = URL.createObjectURL(file);
                                setLocalPreviews(prev => ({ ...prev, [field.key]: localUrl }));
                                setUploadingFields(prev => ({ ...prev, [field.key]: true }));

                                const toastId = toast.loading('Compressing & uploading image...');
                                try {
                                  const compressedBlob = await compressImage(file, 1200, 1200, 0.82);
                                  const uploadData = new FormData();
                                  uploadData.append('image', compressedBlob, file.name.replace(/\.[^/.]+$/, "") + ".jpg");

                                  const res = await adminApi.uploadImage(uploadData);
                                  setFormData(prev => ({ ...prev, [field.key]: res.data.url }));
                                  toast.success('Image uploaded and optimized!', { id: toastId });
                                } catch (err) {
                                  console.error(err);
                                  toast.error('Upload failed: ' + (err.response?.data?.message || err.message), { id: toastId });
                                  // Clear preview on error
                                  setLocalPreviews(prev => ({ ...prev, [field.key]: '' }));
                                } finally {
                                  setUploadingFields(prev => ({ ...prev, [field.key]: false }));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          {formData[field.key] && (
                            <span className="text-slate-400 text-xs truncate max-w-xs">{formData[field.key]}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-fedex-purple focus:ring-1 focus:ring-fedex-purple transition-all"
                        placeholder={`Enter value for ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="bg-fedex-purple hover:bg-fedex-purple/95 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-fedex-purple/10 hover:-translate-y-0.5 text-xs gap-1.5 flex items-center disabled:opacity-50">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><Save className="w-4 h-4" /> Save changes</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL VIEW - CONFIRM DELETE */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-xl p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Delete Record?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Are you absolutely sure you want to delete this record? This action will permanently remove it from the database.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg shadow-rose-600/10 rounded-xl text-xs transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
