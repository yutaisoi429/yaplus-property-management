import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2, LayoutDashboard, Database, BarChart3, FileText, Settings,
  Bell, Search, Plus, ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Cloud, CheckCircle2, AlertTriangle, Clock3, Droplets, Zap, Thermometer,
  Wind, Download, X, UploadCloud, CalendarDays, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import './styles.css';

const initialProperties = [
  { name: 'YA PLUS 渋谷神南', type: 'オフィス', area: '4,820㎡', score: 92, status: '正常', usage: '182,450', change: -8.4, color: '#0f766e' },
  { name: 'YA PLUS 新宿御苑', type: '商業施設', area: '6,210㎡', score: 84, status: '要確認', usage: '248,920', change: 4.2, color: '#d97706' },
  { name: 'YA PLUS 日本橋', type: 'オフィス', area: '3,650㎡', score: 89, status: '正常', usage: '142,680', change: -3.1, color: '#2563eb' },
  { name: 'YA PLUS 横浜みなとみらい', type: '複合施設', area: '8,440㎡', score: 95, status: '正常', usage: '321,240', change: -11.2, color: '#7c3aed' },
];

const monthly = [58, 62, 67, 64, 72, 78, 82, 79, 74, 70, 64, 61];

function Sparkline() {
  const points = monthly.map((v, i) => `${i * 43.5 + 5},${130 - v}`).join(' ');
  return <svg className="chart-svg" viewBox="0 0 490 150" preserveAspectRatio="none">
    <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16786f" stopOpacity=".22"/><stop offset="100%" stopColor="#16786f" stopOpacity="0"/></linearGradient></defs>
    {[25, 55, 85, 115].map(y => <line key={y} x1="0" y1={y} x2="490" y2={y} stroke="#e8ece8" strokeDasharray="3 5" />)}
    <polygon points={`5,145 ${points} 483,145`} fill="url(#fill)" />
    <polyline points={points} fill="none" stroke="#16786f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="483" cy={130-monthly[11]} r="5" fill="#fff" stroke="#16786f" strokeWidth="3" />
  </svg>
}

function App() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('yaplus-properties');
    if (!saved) return initialProperties;
    try { return JSON.parse(saved); } catch { return initialProperties; }
  });
  const [active, setActive] = useState('ダッシュボード');
  const [modal, setModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState('すべての物件');
  const [period, setPeriod] = useState('2026年9月');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => properties.filter(p => p.name.includes(query)), [query]);
  const notify = (message) => { setToast(message); setTimeout(() => setToast(''), 2500); };
  useEffect(() => localStorage.setItem('yaplus-properties', JSON.stringify(properties)), [properties]);
  const createProperty = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    if (properties.some(property => property.name === name)) {
      notify('同じ名前の物件がすでに登録されています');
      return;
    }
    const property = {
      name,
      type: data.get('type'),
      area: `${Number(data.get('area')).toLocaleString('ja-JP')}㎡`,
      address: data.get('address'),
      startDate: data.get('startDate'),
      code: data.get('code') || `YP-${String(properties.length + 1).padStart(4, '0')}`,
      score: 0,
      status: '正常',
      usage: '0',
      change: 0,
      color: '#16786f',
    };
    setProperties(current => [...current, property]);
    setSelected(name);
    setPropertyModal(false);
    notify(`${name}を登録しました`);
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><span></span><span></span><span></span></span><div><b>YA PLUS</b><small>PROPERTY CLOUD</small></div></div>
      <nav>
        <p className="nav-label">ワークスペース</p>
        {[
          [LayoutDashboard, 'ダッシュボード'], [Building2, '物件管理'], [Database, 'データ入力'],
          [BarChart3, '分析・比較'], [FileText, 'レポート']
        ].map(([Icon, label]) => <button key={label} onClick={() => label === 'データ入力' ? setModal(true) : setActive(label)} className={active === label ? 'active' : ''}><Icon size={18}/><span>{label}</span>{label === 'データ入力' && <em>3</em>}</button>)}
        <p className="nav-label lower">システム</p>
        <button><Settings size={18}/><span>設定</span></button>
      </nav>
      <div className="cloud-card"><div className="cloud-icon"><Cloud size={19}/></div><b>クラウド同期済み</b><span>最終更新：2分前</span><div className="sync-line"><i></i></div></div>
      <div className="profile"><div className="avatar">YA</div><div><b>YA PLUS 管理</b><span>管理ワークスペース</span></div><MoreHorizontal size={18}/></div>
    </aside>

    <main>
      <header><div className="mobile-logo">YA+</div><div className="search"><Search size={18}/><input aria-label="物件を検索" placeholder="物件名・データを検索" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><div className="header-actions"><button className="icon-btn" aria-label="通知" onClick={()=>notify('新しい通知はありません')}><Bell size={19}/><i></i></button><button className="primary" onClick={()=>setModal(true)}><Plus size={18}/>データを入力</button></div></header>

      <div className="page">
        <div className="page-title"><div><p className="eyebrow">OVERVIEW</p><h1>{active === 'ダッシュボード' ? '運用ダッシュボード' : active}</h1><p>物件のエネルギーと設備の状況を、ひとつの画面で把握できます。</p></div><div className="filters"><label><Building2 size={16}/><select value={selected} onChange={e=>setSelected(e.target.value)}><option>すべての物件</option>{properties.map(p=><option key={p.name}>{p.name}</option>)}</select><ChevronDown size={15}/></label><label><CalendarDays size={16}/><select value={period} onChange={e=>setPeriod(e.target.value)}><option>2026年9月</option><option>2026年8月</option><option>2026年7月</option></select><ChevronDown size={15}/></label></div></div>

        <section className="metrics">
          <Metric icon={Building2} label="管理物件" value={String(properties.length)} unit="件" note={`稼働中 ${properties.length}件`} />
          <Metric icon={Zap} label="総エネルギー使用量" value="895,290" unit="kWh" trend="-6.8%" good />
          <Metric icon={Droplets} label="総水道使用量" value="3,842" unit="m³" trend="-2.4%" good />
          <Metric icon={AlertTriangle} label="対応が必要" value="3" unit="件" note="前月比 +1件" alert />
        </section>

        <section className="dashboard-grid">
          <article className="card usage-card"><div className="card-head"><div><span className="section-label">ENERGY TREND</span><h2>エネルギー使用量の推移</h2></div><button className="ghost" onClick={()=>notify('CSVを書き出しました')}><Download size={16}/>CSV</button></div><div className="usage-summary"><strong>895,290 <small>kWh</small></strong><span><ArrowDownRight size={15}/>6.8%</span><em>前年同月比</em></div><div className="chart"><div className="y-labels"><span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span></div><Sparkline/><div className="x-labels">{['10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月'].map(x=><span key={x}>{x}</span>)}</div></div></article>
          <article className="card status-card"><div className="card-head"><div><span className="section-label">FACILITY STATUS</span><h2>設備ステータス</h2></div><button className="text-btn" onClick={()=>setActive('物件管理')}>すべて見る <ChevronRight size={15}/></button></div><div className="donut-row"><div className="donut"><div><b>96.4%</b><span>正常稼働</span></div></div><div className="legend"><p><i className="green"></i><span>正常</span><b>106</b></p><p><i className="yellow"></i><span>要確認</span><b>3</b></p><p><i className="gray"></i><span>停止中</span><b>1</b></p></div></div><div className="notice"><AlertTriangle size={17}/><div><b>確認が必要な設備があります</b><span>空調 2件・給排水 1件</span></div><ChevronRight size={17}/></div></article>
        </section>

        <section className="card property-card"><div className="card-head"><div><span className="section-label">PROPERTIES</span><h2>物件別パフォーマンス</h2></div><div className="card-actions"><button className="filter-btn"><SlidersHorizontal size={16}/>表示項目</button><button className="add-property" onClick={()=>setPropertyModal(true)}><Plus size={16}/>新規物件</button></div></div><div className="table-wrap"><table><thead><tr><th>物件名</th><th>種別 / 延床面積</th><th>運用スコア</th><th>ステータス</th><th>使用量（当月）</th><th>前年同月比</th><th></th></tr></thead><tbody>{filtered.map((p,i)=><tr key={p.name}><td><div className="property-name"><span style={{background:p.color}}><Building2 size={18}/></span><b>{p.name}</b></div></td><td><b className="sub-bold">{p.type}</b><small>{p.area}</small></td><td><div className="score"><b>{p.score}</b><span><i style={{width:`${p.score}%`, background:p.color}}></i></span></div></td><td><span className={p.status === '正常' ? 'badge ok' : 'badge warn'}>{p.status === '正常' ? <CheckCircle2 size={13}/> : <AlertTriangle size={13}/>} {p.status}</span></td><td><b className="number">{p.usage}</b> <small>kWh</small></td><td><span className={p.change < 0 ? 'change good' : 'change bad'}>{p.change < 0 ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {Math.abs(p.change)}%</span></td><td><button className="row-more"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div></section>
      </div>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><div className="modal"><div className="modal-head"><div><span className="section-label">NEW RECORD</span><h2>月次データを入力</h2><p>入力したデータはクラウドへ即時保存されます。</p></div><button className="icon-btn" onClick={()=>setModal(false)}><X size={20}/></button></div><form onSubmit={e=>{e.preventDefault();setModal(false);notify('2026年9月のデータを保存しました')}}><div className="form-grid"><label className="full">対象物件<span>必須</span><select required value={selected === 'すべての物件' ? properties[0]?.name : selected} onChange={e=>setSelected(e.target.value)}>{properties.map(property=><option key={property.name}>{property.name}</option>)}</select></label><label>対象年月<span>必須</span><input type="month" defaultValue="2026-09" required/></label><label>データ種別<span>必須</span><select><option>月次実績</option><option>検針値</option><option>設備点検</option></select></label><label>電力使用量 <small>kWh</small><input type="number" defaultValue="72480"/></label><label>水道使用量 <small>m³</small><input type="number" defaultValue="318"/></label><label>ガス使用量 <small>m³</small><input type="number" placeholder="0"/></label><label>廃棄物量 <small>kg</small><input type="number" placeholder="0"/></label></div><div className="drop-zone"><UploadCloud size={25}/><div><b>CSVからまとめて入力</b><span>ファイルをドラッグ＆ドロップ、または選択</span></div><button type="button">ファイルを選択</button></div><label className="notes">備考<textarea placeholder="設備の稼働状況など、共有事項を入力してください"></textarea></label><div className="modal-actions"><button type="button" className="cancel" onClick={()=>setModal(false)}>キャンセル</button><button className="primary" type="submit"><Cloud size={17}/>クラウドに保存</button></div></form></div></div>}
    {propertyModal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setPropertyModal(false)}><div className="modal property-modal"><div className="modal-head"><div><span className="section-label">NEW PROPERTY</span><h2>新しい物件を登録</h2><p>基本情報を登録後、月次データや設備情報を追加できます。</p></div><button className="icon-btn" aria-label="閉じる" onClick={()=>setPropertyModal(false)}><X size={20}/></button></div><form onSubmit={createProperty}><div className="form-grid"><label className="full">物件名<span>必須</span><input name="name" placeholder="例：YA PLUS 品川" required autoFocus/></label><label>物件種別<span>必須</span><select name="type" required><option value="オフィス">オフィス</option><option value="商業施設">商業施設</option><option value="集合住宅">集合住宅</option><option value="複合施設">複合施設</option><option value="その他">その他</option></select></label><label>延床面積<span>必須</span><div className="input-suffix"><input name="area" type="number" min="1" placeholder="5,000" required/><b>㎡</b></div></label><label className="full">所在地<span>必須</span><input name="address" placeholder="東京都港区…" required/></label><label>運用開始日<span>必須</span><input name="startDate" type="date" required/></label><label>管理番号<input name="code" placeholder="自動採番"/></label></div><div className="next-step"><CheckCircle2 size={18}/><div><b>登録後すぐに利用できます</b><span>新しい物件が一覧とデータ入力の選択肢に追加されます。</span></div></div><div className="modal-actions"><button type="button" className="cancel" onClick={()=>setPropertyModal(false)}>キャンセル</button><button className="primary" type="submit"><Plus size={17}/>物件を登録</button></div></form></div></div>}
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>
}

function Metric({icon:Icon,label,value,unit,trend,note,good,alert}) { return <article className="metric"><div className={`metric-icon ${alert?'alert':''}`}><Icon size={20}/></div><div className="metric-label">{label}</div><div className="metric-value">{value}<small>{unit}</small></div>{trend?<div className={`metric-foot ${good?'good':''}`}><ArrowDownRight size={14}/><b>{trend}</b><span>前年同月比</span></div>:<div className={`metric-foot ${alert?'bad':''}`}><span>{note}</span></div>}</article> }

createRoot(document.getElementById('root')).render(<App/>);
