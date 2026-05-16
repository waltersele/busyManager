'use client';

import { api } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface OrgUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
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
      <h1 className="mb-6 text-2xl font-bold">Usuarios</h1>
      <form onSubmit={invite} className="card mb-6 grid gap-3 md:grid-cols-4">
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn">
          Invitar
        </button>
      </form>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="card flex justify-between">
            <span>
              {u.name} — {u.email}
            </span>
            <span className="text-xs text-muted">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
