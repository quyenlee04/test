import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddCategory = () => {
    axios.post('/api/categories/add', newCategory)
      .then(response => {
        setCategories([...categories, response.data]);
        setNewCategory({ name: '', description: '' });
      })
      .catch(error => console.error('Error adding category:', error));
  };

  const handleDeleteCategory = (id: number) => {
    axios.delete(`/api/categories/${id}`)
      .then(() => setCategories(categories.filter(category => category.id !== id)))
      .catch(error => console.error('Error deleting category:', error));
  };

  return (
    <div>
      <h1>Categories Management</h1>
      <input
        type="text"
        placeholder="Name"
        value={newCategory.name}
        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newCategory.description}
        onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
      />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
