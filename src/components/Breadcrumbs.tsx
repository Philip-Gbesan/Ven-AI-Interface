import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getInstantById } from '../data/mockData';

export default function Breadcrumbs() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); 
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  const instantId = id || (pathnames[pathnames.indexOf('instant') + 1]);
  const instant = instantId ? getInstantById(instantId) : undefined;

  // Build breadcrumb items based on V5 logic
  // "Ven AI" -> Must navigate strictly to /app/dashboard
  const items: { label: string; to?: string; active?: boolean }[] = [
    { label: 'Ven AI', to: '/app/dashboard' } 
  ];

  if (pathnames.includes('dashboard') && !pathnames.includes('instant')) {
      // Main Dashboard: "Ven AI > All Instants"
      items.push({ label: 'All Instants', active: true });
  } else if (pathnames.includes('resources')) {
      // Global Resources: "Ven AI > Data Resources"
      items.push({ label: 'Data Resources', active: true });
  } else if (pathnames.includes('files')) {
      items.push({ label: 'Files', active: true });
  } else if (pathnames.includes('insights')) {
      // Global Insights: "Ven AI > Insights"
      items.push({ label: 'Insights', active: true });
  } else if (pathnames.includes('billings')) {
      items.push({ label: 'Billings', to: location.pathname.includes('history') ? '/app/billings' : undefined, active: !location.pathname.includes('history') });
      if (pathnames.includes('history')) {
          items.push({ label: 'Usage History', active: true });
      }
  } else if (pathnames.includes('integration')) {
      items.push({ label: 'Integration', active: true });
  } else if (pathnames.includes('new-instant')) {
      items.push({ label: 'New Instant', active: true });
  } else if (pathnames.includes('instant') && instantId) {
      // Instant Context
      items.push({ label: 'All Instants', to: '/app/dashboard' });
      
      // If just /dashboard, the instance name IS the active item
      if (pathnames[pathnames.length - 1] === 'dashboard') {
          items.push({ label: instant?.name || instantId, active: true });
      } else {
          // If deeper (e.g. Chat), Instant Name is a link to dashboard
          items.push({ label: instant?.name || instantId, to: `/app/instant/${instantId}/dashboard` });
          
          if (pathnames.includes('chat')) {
              items.push({ label: 'Chat', active: true });
          } else if (pathnames.includes('settings')) {
              items.push({ label: 'Settings', active: true });
          }
      }
  }

  return (
    <nav className="flex items-center text-sm">
      {items.map((item, index) => {
         return (
             <div key={index} className="flex items-center">
                 {index > 0 && <ChevronRight className="w-4 h-4 text-zinc-400 mx-2" />}
                 {item.to ? (
                     <Link to={item.to} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                         {item.label}
                     </Link>
                 ) : (
                     <span className={`font-medium ${item.active ? 'text-zinc-900' : 'text-zinc-500'}`}>
                         {item.label}
                     </span>
                 )}
             </div>
         );
      })}
    </nav>
  );
}
