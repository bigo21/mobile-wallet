'use client';

export default function LogoutButton() {
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.assign('/admin/login');
  };
  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-gray-300 hover:text-white underline underline-offset-4"
    >
      Déconnexion
    </button>
  );
}
