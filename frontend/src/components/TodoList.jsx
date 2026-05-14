import { useState, useEffect } from 'react';
import { getTodos, createTodo, toggleTodo, deleteTodo, updateTodo } from '../services/api';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const newTodo = await createTodo({ title, description });
      setTodos([...todos, newTodo]);
      setTitle('');
      setDescription('');
    } catch (error) {
      alert('Erro ao criar tarefa');
    }
  };

  const handleToggle = async (id) => {
    try {
      const updatedTodo = await toggleTodo(id);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      alert('Erro ao atualizar tarefa');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      alert('Erro ao deletar tarefa');
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const updatedTodo = await updateTodo(id, { title: editTitle, description: editDescription });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingId(null);
    } catch (error) {
      alert('Erro ao salvar alteração');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Carregando tarefas...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Formulário de Criação */}
      <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3">Nova Tarefa</h3>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Título da tarefa..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
          <input 
            type="text" 
            placeholder="Descrição (opcional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition self-end">
            Adicionar
          </button>
        </div>
      </form>

      {/* Lista de Tarefas */}
      <ul className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhuma tarefa encontrada.</p>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="flex items-start justify-between p-4 border border-gray-200 rounded hover:bg-gray-50 transition">
              
              {editingId === todo.id ? (
                <div className="flex-1 mr-4 flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-1 text-sm outline-none"
                  />
                  <input 
                    type="text" 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-1 text-xs outline-none"
                    placeholder="Descrição..."
                  />
                </div>
              ) : (
                <div className="flex items-start gap-4 flex-1">
                  
                  {/* Botão de Toggle */}
                  <button
                    onClick={() => handleToggle(todo.id)}
                    title={todo.completed ? 'Desmarcar tarefa' : 'Marcar como finalizado'}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-transparent hover:border-green-400 hover:text-green-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.title}
                      </h4>
                      {/* Badge visual de Status */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {todo.completed ? 'Finalizado' : 'Pendente'}
                      </span>
                    </div>
                    {todo.description && (
                      <p className={`text-sm mt-1 ${todo.completed ? 'line-through text-gray-300' : 'text-gray-500'}`}>
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Botões de Ação (Editar e Excluir) */}
              <div className="flex gap-2 ml-2">
                {editingId === todo.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(todo.id)} className="text-green-600 hover:bg-green-50 p-2 rounded" title="Salvar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </button>
                    <button onClick={cancelEditing} className="text-gray-500 hover:bg-gray-100 p-2 rounded" title="Cancelar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(todo)} className="text-blue-500 hover:bg-blue-50 p-2 rounded" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                    </button>
                    <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:bg-red-50 p-2 rounded" title="Excluir">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}