const API_URL = 'http://localhost:8080/api';

// Função auxiliar para injetar o token JWT em todas as requisições
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  // Se o token expirar ou for inválido, desloga o usuário
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Não autorizado');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro na requisição');
  }

  // Se for um DELETE (204 No Content), não tenta fazer o parse do JSON
  if (response.status === 204) return null;
  return response.json();
}

export const register = (username, password) => 
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());

export const login = (username, password) => 
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());

export const getTodos = () => fetchWithAuth('/todos');
export const createTodo = (data) => fetchWithAuth('/todos', { method: 'POST', body: JSON.stringify(data) });
export const toggleTodo = (id) => fetchWithAuth(`/todos/${id}/toggle`, { method: 'PUT' });
export const updateTodo = (id, data) => fetchWithAuth(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTodo = (id) => fetchWithAuth(`/todos/${id}`, { method: 'DELETE' });