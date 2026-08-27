import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, FolderTree } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory } from '../../services/storageService';
import { Category } from '../../types';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleEdit = (category: Category) => {
    setFormData(category);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({
      id: `cat_${Date.now()}`,
      name: '',
      description: ''
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      saveCategory(formData as Category);
      setCategories(getCategories());
      setIsEditing(false);
    }
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      deleteCategory(showDeleteModal);
      setCategories(getCategories());
      setShowDeleteModal(null);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderTree className="text-primary dark:text-accent" />
            Category Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage course categories, descriptions, and metadata.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-secondary dark:bg-accent dark:hover:bg-yellow-400 text-white dark:text-gray-900 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          Create Category
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-64">Sub-Categories</th>
                <th className="p-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white">{category.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {category.id}</div>
                    {category.parentId && (
                       <div className="text-xs text-blue-500 dark:text-blue-400 mt-1 font-semibold">
                         ↳ Sub-category of: {categories.find(c => c.id === category.parentId)?.name || category.parentId}
                       </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    {(() => {
                      const subs = categories.filter(c => c.parentId === category.id);
                      if (subs.length === 0) return <span className="text-gray-400 text-xs italic">None</span>;
                      return (
                        <div className="flex flex-wrap gap-1">
                          {subs.map(s => (
                            <span key={s.id} className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(category.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {formData.id?.startsWith('cat_') && !formData.name ? 'Create Category' : 'Edit Category'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label htmlFor="category-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category Name *
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                    placeholder="e.g., Global Wind Organisation"
                  />
                </div>

                <div>
                  <label htmlFor="category-parent" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Parent Category (Optional)
                  </label>
                  <select
                    id="category-parent"
                    value={formData.parentId || ''}
                    onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                  >
                    <option value="">None (Top-Level Category)</option>
                    {categories.filter(c => c.id !== formData.id && !c.parentId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category-desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="category-desc"
                    rows={4}
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white resize-none"
                    placeholder="Brief description of this category..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-secondary dark:bg-accent dark:hover:bg-yellow-400 text-white dark:text-gray-900 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Check size={18} />
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold">Delete Category</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this category? Courses associated with it will keep their string category name, but this category won't appear in filters or dropdowns.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
