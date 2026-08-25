import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthed, ADMIN_COOKIE } from '@/lib/adminAuth';
import { getLeads, getLeadCounts } from '@/lib/db';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  contact: 'Contact / RDV',
  presentation: 'Présentation',
  documentation: 'Documentation',
};

const TAG_CLASS: Record<string, string> = {
  contact: 'bg-sky-100 text-sky-800',
  presentation: 'bg-amber-100 text-amber-800',
  documentation: 'bg-green-100 text-green-800',
};

function fmtDate(d: string): string {
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

export default async function AdminPage({ searchParams }: { searchParams: { type?: string } }) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) redirect('/admin/login');

  const type = searchParams.type ?? '';
  const [leads, counts] = await Promise.all([getLeads(type), getLeadCounts()]);
  const total = counts.contact + counts.presentation + counts.documentation;
  const qs = type ? `?type=${encodeURIComponent(type)}` : '';

  const tabs = [
    { key: '', label: 'Tous', count: total },
    { key: 'contact', label: TYPE_LABELS.contact, count: counts.contact },
    { key: 'presentation', label: TYPE_LABELS.presentation, count: counts.presentation },
    { key: 'documentation', label: TYPE_LABELS.documentation, count: counts.documentation },
  ];

  return (
    <main className="min-h-screen bg-[#f4f4f5]">
      <header className="bg-gradient-to-r from-[#0D0D0D] to-[#2D1B0E] px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-white">
          Mobile<span className="text-[#F9A825]">Wallet</span> <span className="font-normal text-gray-400">— Leads</span>
        </span>
        <LogoutButton />
      </header>

      <div className="max-w-[1250px] mx-auto p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tabs.map((t) => (
            <Link
              key={t.key || 'all'}
              href={t.key ? `/admin?type=${t.key}` : '/admin'}
              className={`px-3.5 py-2 rounded-lg text-sm border transition-colors ${
                type === t.key
                  ? 'bg-[#F9A825] border-[#F9A825] text-black font-semibold'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#F9A825]'
              }`}
            >
              {t.label} ({t.count})
            </Link>
          ))}
          <a
            href={`/api/admin/export${qs}`}
            className="ml-auto px-3.5 py-2 rounded-lg text-sm bg-[#1a1a1a] text-white border border-[#1a1a1a] hover:bg-black"
          >
            ⬇ Export CSV
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="p-3 font-medium whitespace-nowrap">Date</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Nom</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Pays</th>
                <th className="p-3 font-medium">Téléphone</th>
                <th className="p-3 font-medium">Message</th>
                <th className="p-3 font-medium">Lng</th>
                <th className="p-3 font-medium">Doc</th>
                <th className="p-3 font-medium">IP</th>
                <th className="p-3 font-medium">Téléch.</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-10 text-center text-gray-400">Aucun lead pour ce filtre.</td>
                </tr>
              )}
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-gray-100 align-top">
                  <td className="p-3 whitespace-nowrap text-gray-600">{fmtDate(l.created_at)}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${TAG_CLASS[l.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {TYPE_LABELS[l.type] ?? l.type}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-gray-900">{l.name}</td>
                  <td className="p-3 whitespace-nowrap"><a href={`mailto:${l.email}`} className="text-[#c47d00] hover:underline">{l.email}</a></td>
                  <td className="p-3 whitespace-nowrap text-gray-700">{l.country || <span className="text-gray-300">—</span>}</td>
                  <td className="p-3 whitespace-nowrap text-gray-700">{l.phone || <span className="text-gray-300">—</span>}</td>
                  <td className="p-3 max-w-[280px] text-gray-600 whitespace-pre-line">{l.message || <span className="text-gray-300">—</span>}</td>
                  <td className="p-3 text-gray-500 uppercase">{l.lang}</td>
                  <td className="p-3 text-gray-500 uppercase">{l.doc_lang || <span className="text-gray-300">—</span>}</td>
                  <td className="p-3 whitespace-nowrap text-gray-500">{l.ip || <span className="text-gray-300">—</span>}</td>
                  <td className="p-3 whitespace-nowrap">
                    {l.type === 'contact' ? (
                      <span className="text-gray-300">—</span>
                    ) : l.download_count > 0 ? (
                      <Link href={`/admin/downloads/${l.id}`} className="font-semibold text-green-700 hover:underline">
                        {l.download_count}×
                      </Link>
                    ) : (
                      <Link href={`/admin/downloads/${l.id}`} className="text-gray-400 hover:underline">non</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
