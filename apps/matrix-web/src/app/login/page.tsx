'use client';

import { api, setToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('orgadmin@karting.demo');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de login';
      setError(
        msg === 'Failed to fetch'
          ? 'No se puede conectar con la API (¿Docker en marcha? puerto 8080)'
          : msg,
      );
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-orange-500 to-orange-700 p-12 text-white lg:flex">
        <p className="text-2xl font-semibold">BusyManager</p>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Tus apps, un solo lugar</h1>
          <p className="mt-4 max-w-md text-orange-100">
            Activa módulos por negocio, configura una vez y deja que cada app use tus datos.
          </p>
        </div>
        <p className="text-sm text-orange-200">La Matriz · Panel cliente</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-slate-900">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-slate-500">Administrador de organización</p>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn mt-6 w-full">
            Entrar
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: orgadmin@karting.demo / password
          </p>
        </form>
      </div>
    </div>
  );
}
