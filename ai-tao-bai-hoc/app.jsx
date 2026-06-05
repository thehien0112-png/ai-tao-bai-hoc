const { useState, useMemo, useEffect, useRef } = React;

// derived data globals
window.WEEKS = window.PPCT;
window.TOTAL_ENTRIES = WEEKS.reduce((a,w)=>a+w.entries.length,0);

// ---------- Top nav ----------
function TopNav(){
  return (
    <div className="topnav">
      <div className="brand">Tool editor</div>
      <nav className="nav-links">
        <a href="#">Quản lý <Icon name="chevDown" size={14}/></a>
        <a href="#">Mã kích hoạt</a>
        <a href="#">Sự kiện</a>
        <a href="#">Cài đặt tài khoản</a>
        <a href="#">PCNL/NDCD <Icon name="chevDown" size={14}/></a>
      </nav>
      <div className="nav-spacer"></div>
      <div className="nav-user"><span className="avatar"><Icon name="reader" size={16}/></span>Vườn Tri Thức Việt <Icon name="chevDown" size={14}/></div>
    </div>
  );
}

// ---------- List screen ----------
function ListScreen({rows, onOpenAI}){
  const [sel, setSel] = useState(new Set());
  const allOn = rows.length>0 && sel.size===rows.length;
  return (
    <div className="page">
      <div className="crumbs"><a href="#">App</a> / <a href="#">Con Sáng Tạo PCNL V2</a> / <a href="#">Test Game</a></div>
      <h1 className="page-title">Danh sách tuần</h1>

      <div className="toolbar">
        <button className="btn"><Icon name="back" size={16}/>Quay lại</button>
        <button className="btn btn-primary"><Icon name="plus" size={16}/>Thêm mới</button>
        <button className="btn btn-ai btn-lg" onClick={onOpenAI}><Icon name="sparkles" size={17} fill/>Tạo bằng AI</button>
        <button className="btn-icon"><Icon name="trash" size={18}/></button>
        <button className="btn-icon round"><Icon name="folder" size={16}/></button>
      </div>

      <div className="filters">
        <div className="field">
          <select className="select" defaultValue="Test Game"><option>Test Game</option><option>Tuần học chính khoá</option></select>
          <span className="chev"><Icon name="chevDown" size={16}/></span>
        </div>
        <div className="field">
          <input className="input" placeholder="Tìm kiếm"/>
          <span className="srch"><Icon name="search" size={16}/></span>
        </div>
        <button className="btn">Xóa lọc</button>
      </div>

      <table className="tbl">
        <thead><tr>
          <th style={{width:36}}><span onClick={()=>setSel(allOn?new Set():new Set(rows.map((_,i)=>i)))}><Check on={allOn}/></span></th>
          <th style={{width:54}}>STT</th><th>Tiêu đề</th><th style={{width:220}}>Số lượng</th><th style={{width:120}}></th>
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td><span onClick={()=>setSel(s=>{const n=new Set(s);n.has(i)?n.delete(i):n.add(i);return n;})}><Check on={sel.has(i)}/></span></td>
              <td className="muted">{i+1}</td>
              <td><div style={{display:'flex',alignItems:'center',gap:14}}>
                <span className="thumb"/><span className="row-title">{r.title}</span>
                {r.ai && <span className="tc-tag" style={{background:'#eef0ff',color:'#5b54f0',display:'inline-flex',alignItems:'center',gap:4}}><Icon name="sparkles" size={11} fill/>AI</span>}
              </div></td>
              <td className="muted">{r.count} bài</td>
              <td><div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button className="btn-icon" style={{color:'var(--blue-600)'}}><Icon name="eye" size={18}/></button>
                <button className="btn-icon round" style={{borderColor:'#e0e3e8',background:'#eef0f3'}}><Icon name="dots" size={16}/></button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pager"><span className="page-arrow"><Icon name="chevLeft" size={18}/></span>
        <span className="page-num">1</span><span className="page-arrow"><Icon name="chevRight" size={18}/></span>
        <button className="btn-icon round" style={{borderColor:'#e0e3e8'}}><Icon name="plus" size={16}/></button>
      </div>
    </div>
  );
}

// ---------- Wizard shell ----------
const STEP_LABELS = ['Nguồn dữ liệu','Chọn tiết','Loại bài giảng','Xác nhận'];
function Wizard({onClose, onFinish}){
  const allKeys = useMemo(()=>WEEKS.flatMap((w,wi)=>w.entries.map((_,ei)=>wi+'-'+ei)),[]);
  const [step, setStep] = useState(0);
  const [src, setSrc] = useState({book:null, ppct:null});
  const [selected, setSelected] = useState(new Set(allKeys)); // default ALL
  const [openWeeks, setOpenWeeks] = useState(new Set([0]));
  const [types, setTypes] = useState(new Set(['baidoc']));
  const [cfg, setCfg] = useState(defaultCfg);
  const [phase, setPhase] = useState('review'); // review | gen | done
  const [progress, setProgress] = useState(0);
  const [genList, setGenList] = useState([]);

  const chosenTypes = TYPES.filter(t=>types.has(t.id));
  const total = selected.size*chosenTypes.length;

  const canNext = step===0 ? !!src.ppct : step===1 ? selected.size>0 : step===2 ? types.size>0 : true;

  const startGen = ()=>{
    const items=[]; let count=0;
    // build a representative gen list (cap to keep UI tidy)
    const selArr=[...selected].slice(0,6);
    selArr.forEach(k=>{
      const [wi,ei]=k.split('-').map(Number); const e=WEEKS[wi].entries[ei];
      chosenTypes.forEach(t=> items.push({label:t.name+': '+e.name, icon:t.icon, color:t.color, status:'wait'}));
    });
    if(selected.size>6) items.push({label:`… và ${total-items.length} bài giảng khác`, icon:'layers', color:'#64748b', status:'wait'});
    setGenList(items); setPhase('gen'); setProgress(4);
    let i=0;
    const tick=()=>{
      setGenList(list=>list.map((g,idx)=> idx<i?{...g,status:'done'}: idx===i?{...g,status:'run'}:g));
      setProgress(Math.min(98, Math.round(((i+1)/items.length)*100)));
      i++;
      if(i<=items.length){ setTimeout(tick, 520); }
      else { setProgress(100); setGenList(list=>list.map(g=>({...g,status:'done'}))); setTimeout(()=>setPhase('done'),400); }
    };
    setTimeout(tick,400);
  };

  const next = ()=>{
    if(step<3){ setStep(step+1); return; }
    if(phase==='review'){ startGen(); return; }
    if(phase==='done'){ onFinish(total); }
  };

  return (
    <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget && phase!=='gen') onClose();}}>
      <div className="wizard">
        <div className="wz-head">
          <div className="wz-title">
            <span className="spark"><Icon name="sparkles" size={20} fill/></span>
            <div><h2>Tạo bài học & câu hỏi bằng AI</h2>
              <p>Tiếng Việt · Lớp 2 — từ file phân phối chương trình</p></div>
          </div>
          <button className="wz-close" onClick={onClose} disabled={phase==='gen'}><Icon name="x" size={18}/></button>
        </div>

        <div className="steps">
          {STEP_LABELS.map((l,i)=>(
            <React.Fragment key={i}>
              {i>0 && <div className={'step-line'+(i<=step?' fill':'')}/>}
              <div className={'step'+(i===step?' active':'')+(i<step?' done':'')}>
                <div className="dot">{i<step? <Icon name="check" size={15} stroke={3}/> : i+1}</div>
                <div className="lbl">{l}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="wz-body">
          {step===0 && <Step1 src={src} setSrc={setSrc}/>}
          {step===1 && <Step2 selected={selected} setSelected={setSelected} openWeeks={openWeeks} setOpenWeeks={setOpenWeeks}/>}
          {step===2 && <Step3 types={types} setTypes={setTypes} cfg={cfg} setCfg={setCfg}/>}
          {step===3 && <Step4 selCount={selected.size} types={types} cfg={cfg} phase={phase} progress={progress} genList={genList}/>}
        </div>

        <div className="wz-foot">
          <div>
            {step>0 && phase==='review' && <button className="btn" onClick={()=>setStep(step-1)}><Icon name="chevLeft" size={16}/>Quay lại</button>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <div className="foot-info">
              {step===1 && <>Đã chọn <b>{selected.size}</b> tiết</>}
              {step===2 && <>Sẽ tạo <b>{total}</b> bài giảng</>}
              {step===3 && phase==='review' && <>Tổng <b>{total}</b> bài giảng</>}
            </div>
            {phase!=='done' && phase!=='gen' && (
              <button className="btn btn-primary btn-lg" disabled={!canNext} onClick={next}>
                {step<3? <>Tiếp tục<Icon name="chevRight" size={16}/></> : <><Icon name="sparkles" size={16} fill/>Bắt đầu tạo {total} bài</>}
              </button>
            )}
            {phase==='gen' && <button className="btn btn-lg" disabled><span className="spin" style={{marginRight:4}}/>Đang tạo…</button>}
            {phase==='done' && <button className="btn btn-primary btn-lg" onClick={()=>onFinish(total)}><Icon name="check" size={16} stroke={3}/>Hoàn tất</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Root ----------
function App(){
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    {title:'Test ký tự các dạng game', count:7},
    {title:'tuần 2', count:1},
  ]);
  const finish = (n)=>{
    setOpen(false);
    setRows(r=>[{title:'Tiếng Việt 2 — Bài giảng AI', count:n, ai:true}, ...r]);
  };
  return (
    <div className="app">
      <TopNav/>
      <ListScreen rows={rows} onOpenAI={()=>setOpen(true)}/>
      {open && <Wizard onClose={()=>setOpen(false)} onFinish={finish}/>}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
