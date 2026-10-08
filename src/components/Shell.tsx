'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Mic, Users, Store, Wallet, BarChart3, Package, Settings, ArrowRight, Plus, CalendarClock } from 'lucide-react';
import type { ReactNode } from 'react';
import { useKoletPay } from '@/lib/store';
const nav=[{href:'/',title:'Home',icon:Home},{href:'/customers',title:'Customers',icon:Users},{href:'/invoices',title:'Invoices',icon:ReceiptText},{href:'/products',title:'Products & Services',icon:Package},{href:'/payments',title:'Payments',icon:Wallet},{href:'/installments',title:'Pay in parts',icon:CalendarClock},{href:'/reports',title:'Reports',icon:BarChart3},{href:'/assistant',title:'Kolet AI',icon:Mic},{href:'/settings',title:'Settings',icon:Settings}];
export function Shell({children}:{children:ReactNode}){
const path = usePathname();
const { data } = useKoletPay();

if (
  path === "/login" ||
  path.startsWith("/login/") ||
  path === "/register" ||
  path.startsWith("/register/")
) {
  return <>{children}</>;
}

 return <div className="app-shell">
  <aside className="sidebar" aria-label="Main navigation">
   <Link href="/" className="brand"><span className="brand-symbol">K</span> KoletPay</Link>
   <div className="sidebar-label">WORKSPACE</div>
   <nav className="side-links">{nav.map(item=>{const Icon=item.icon;const selected=item.href==='/'?path==='/':path.startsWith(item.href);return <Link href={item.href} key={item.href} className={'side-link'+(selected?' active':'')}><Icon size={19} strokeWidth={1.9}/><span>{item.title}</span></Link>})}</nav>
   <div className="sidebar-bottom"><span className="avatar mini">IP</span><span><b>{data.business.name}</b><small>Demo business</small></span></div>
  </aside>
  <div className="workspace">
   <header className="app-header"><Link href="/" className="brand compact"><span className="brand-symbol">K</span> KoletPay</Link><span className="header-context">Business workspace <ArrowRight size={14}/> <strong>{data.business.name}</strong></span><div className="header-actions"><span className="demo-tag">Frontend demo</span><Link className="icon-button" href="/invoices/new" aria-label="Create invoice"><Plus size={19}/></Link><span className="avatar mini">IP</span></div></header>
   <main className="main">{children}</main>
  </div>
  <nav className="bottom-nav" aria-label="Quick navigation">{[nav[0],nav[2],nav[6],nav[1],{href:'/settings',title:'More',icon:Settings}].map(item=>{const Icon=item.icon;const selected=item.href==='/'?path==='/':path.startsWith(item.href);return <Link href={item.href} key={item.title} className={'nav-item'+(selected?' active':'')}><Icon size={21}/><span>{item.title==='Kolet AI'?'AI':item.title}</span></Link>})}</nav>
 </div>
}
export function PageHead({title,sub,action}:{title:string;sub?:string;action?:ReactNode}){return <header className="page-head"><div><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</header>}
export function Status({status}:{status:string}){const type=status==='Paid'?'paid':status==='Overdue'?'overdue':status==='Partially paid'?'partial':'pending';return <span className={'status '+type}>{status}</span>}
export function Empty({title,description}:{title:string;description:string}){return <div className="empty"><Package size={28}/><h3>{title}</h3><p>{description}</p></div>}
export function QuickLink({href,icon,title}:{href:string;icon:ReactNode;title:string}){return <Link className="quick" href={href}>{icon}<span>{title}</span></Link>}
