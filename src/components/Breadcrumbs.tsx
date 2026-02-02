import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getInstanceById } from '../data/mockData';

export default function Breadcrumbs() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); 
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  const instanceId = id || (pathnames[pathnames.indexOf('instance') + 1]);
  const instance = instanceId ? getInstanceById(instanceId) : undefined;

  // Build breadcrumb items based on V5 logic
  // "Ven AI" -> Must navigate strictly to /app/dashboard
  const items: { label: string; to?: string; active?: boolean }[] = [
    { label: 'Ven AI', to: '/app/dashboard' } 
  ];

  if (pathnames.includes('dashboard') && !pathnames.includes('instance')) {
      // Main Dashboard: "Ven AI > All Instances"
      items.push({ label: 'All Instances', active: true });
  } else if (pathnames.includes('resources')) {
      // Global Resources: "Ven AI > Data Resources"
      items.push({ label: 'Data Resources', active: true });
  } else if (pathnames.includes('insights')) {
      // Global Insights: "Ven AI > Insights"
      items.push({ label: 'Insights', active: true });
  } else if (pathnames.includes('settings') && !pathnames.includes('instance')) {
       // Global Settings: "Ven AI > Settings"
       items.push({ label: 'Settings', active: true });
  } else if (pathnames.includes('new-instance')) {
      items.push({ label: 'New Instance', active: true });
  } else if (pathnames.includes('instance') && instanceId) {
      // Instance Context
      items.push({ label: 'All Instances', to: '/app/dashboard' });
      
      // If just /dashboard, the instance name IS the active item
      if (pathnames[pathnames.length - 1] === 'dashboard') {
          items.push({ label: instance?.name || instanceId, active: true });
      } else {
          // If deeper (e.g. Chat), Instance Name is a link to dashboard
          items.push({ label: instance?.name || instanceId, to: `/app/instance/${instanceId}/dashboard` });
          
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
