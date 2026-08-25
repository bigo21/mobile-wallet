import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthed, ADMIN_COOKIE } from '@/lib/adminAuth';
import { getLead, getDownloads } from '@/lib/db';

export const dynamic = 'force-dynamic';

function fmtDate(d: string): string {
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' });
}

export default async function DownloadsPage({ params }: { params: { id: string } }) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) redirect('/admin/login');

  const id = Number(params.id);
  const lead = Number.isNaN(id) ? null : await getLead(id);
  const events = lead ? await getDownloads(id) : [];

  return (
    <main className="min-h-screen bg-[#f4f4f5]">
      <header className="bg-gradient-to-r from-[#0D0D0D] to-[#2D1B0E] px-6 py-4">
        <span className="text-lg font-bold text-white">
          Mobile<span className="text-[#F9A825]">Wallet</span> <span className="font-normal text-gray-400">— Téléchargements</span>
        </span>
      </header>

      <div className="max-w-[900px] mx-auto p-4 sm:p-6">
        <Link href="/admin?type=documentation" className="inline-block mb-4 text-sm text-gray-600 hover:text-black">&larr; Retour aux leads</Link>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {!lead ? (
            <p className="text-gray-400">Lead introuvable.</p>
          ) : (
            <>
              <h1 className="text-lg font-bold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-500 mb-6">
                {lead.email} — demande du {fmtDate(lead.created_at)}
              </p>
              <p className="mb-4 text-sm">
                <strong>{events.length}</strong> téléchargement(s) enregistré(s)
                {lead.doc_lang ? <> — document en <strong className="uppercase">{lead.doc_lang}</strong></> : null}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-left">
                      <th className="p-3 font-medium whitespace-nowrap">Date &amp; heure</th>
                      <th className="p-3 font-medium">IP</th>
                      <th className="p-3 font-medium">Navigateur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-gray-400">Aucun téléchargement pour l&apos;instant.</td></tr>
                    )}
                    {events.map((ev) => (
                      <tr key={ev.id} className="border-t border-gray-100 align-top">
                        <td className="p-3 whitespace-nowrap text-gray-700">{fmtDate(ev.created_at)}</td>
                        <td className="p-3 whitespace-nowrap text-gray-600">{ev.ip || <span className="text-gray-300">—</span>}</td>
                        <td className="p-3 max-w-[440px] break-words text-xs text-gray-500">{ev.user_agent || <span className="text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
