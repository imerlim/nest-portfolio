import { useEffect, useState } from 'react'
import axios from 'axios'

// Definimos o formato do projeto para o TypeScript não reclamar
interface Project {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Função para buscar projetos
  const fetchProjects = () => {
    axios.get('http://localhost:3000/projects').then(res => setProjects(res.data));
  };

  useEffect(() => { fetchProjects(); }, []);

  // Função para salvar novo projeto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/projects', { title, description });
    setTitle('');
    setDescription('');
    fetchProjects(); // Recarrega a lista
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Gerenciar Portfólio</h1>
      
      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Adicionar Projeto</button>
      </form>

      <hr />

      {/* Listagem */}
      <div>
        {projects.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App