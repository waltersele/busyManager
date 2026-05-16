'use client';

import PageHeader from '@/components/PageHeader';
import { api } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface OrgUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function TeamPage() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function load() {
    api<{ data: OrgUser[] }>('/org/users').then((r) => setUsers(r.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function invite(e: FormEvent) {
    e.preventDefault();
    await api('/org/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'org_admin' }),
    });
    setName('');
    setEmail('');
    setPassword('');
    load();
  }

  return (
    <div>
      <PageHeader
        title="Equipo"
        description="Usuarios con acceso a la organización y roles por negocio."
      />
      <form onSubmit={invite} className="card mb-6 grid gap-4 md:grid-cols-4">
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn">
          Invitar
        </button>
      </form>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="card flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-900">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
