import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const handleDeleteOrder = (id: number) => {
    axios.delete(`/api/orders/${id}`)
      .then(() => setOrders(orders.filter(order => order.id !== id)))
      .catch(error => console.error('Error deleting order:', error));
  };

  return (
    <div>
      <h1>Orders Management</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Order #{order.id} - ${order.total_amount}
            <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
