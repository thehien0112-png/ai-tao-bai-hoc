// Lucide-style icon set (stroke). Usage: <Icon name="sparkles" size={18}/>
const ICONS = {
  sparkles:'M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5 10.1 7.6z M19 14l.9 2.2 2.1.8-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.8z',
  plus:'M12 5v14 M5 12h14',
  trash:'M3 6h18 M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6 M10 11v6 M14 11v6',
  upload2:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 9l5-5 5 5 M12 4v12',
  search:'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.3-4.3',
  chevDown:'M6 9l6 6 6-6',
  chevRight:'M9 6l6 6-6 6',
  chevLeft:'M15 6l-6 6 6 6',
  check:'M20 6L9 17l-5-5',
  x:'M18 6L6 18 M6 6l12 12',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z',
  dots:'M12 6a1 1 0 100-2 1 1 0 000 2z M12 13a1 1 0 100-2 1 1 0 000 2z M12 20a1 1 0 100-2 1 1 0 000 2z',
  book:'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  fileSpread:'M4 3h11l5 5v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z M14 3v6h6 M8 13h8 M8 17h8 M8 9h3',
  headphones:'M3 14v-2a9 9 0 0118 0v2 M21 16a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2zM3 16a2 2 0 002 2h1v-6H5a2 2 0 00-2 2z',
  video:'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
  reader:'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
  puzzle:'M19.4 13a2 2 0 002 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2 1.6 1.6 0 00-3.2 0 2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 002-2 1.6 1.6 0 000-3.2 2 2 0 01-2-2V5a2 2 0 012-2h3a2 2 0 012 2 1.6 1.6 0 003.2 0 2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2 1.6 1.6 0 000 3.2z',
  history:'M3 3v5h5 M3.05 13A9 9 0 106 5.3L3 8 M12 7v5l4 2',
  back:'M19 12H5 M12 19l-7-7 7-7',
  info:'M12 22a10 10 0 100-20 10 10 0 000 20z M12 16v-4 M12 8h.01',
  warn:'M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z M12 9v4 M12 17h.01',
  folder:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  mic:'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z M19 10v1a7 7 0 01-14 0v-1 M12 18v4 M8 22h8',
  layers:'M12 2l9 5-9 5-9-5 9-5z M3 12l9 5 9-5 M3 17l9 5 9-5',
  filter:'M22 3H2l8 9.5V19l4 2v-8.5z',
  wand:'M15 4V2 M15 16v-2 M8 9h2 M20 9h2 M17.8 11.8L19 13 M15 9h0 M17.8 6.2L19 5 M3 21l9-9 M12.2 6.2L11 5',
};
function Icon({name, size=20, stroke=2, fill=false, style, ...rest}){
  const d = ICONS[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill?'currentColor':'none'}
      stroke={fill?'none':'currentColor'} strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={{display:'block',...style}} {...rest}>
      {d.split(' M').map((seg,i)=>(<path key={i} d={(i?'M':'')+seg}/>))}
    </svg>
  );
}

function Check({on, indet, size=18}){
  return (
    <span className={'checkbox'+(on?' checked':'')+(indet?' indet':'')}>
      {on && <Icon name="check" size={size-5} stroke={3}/>}
      {!on && indet && <span style={{width:9,height:2,background:'#fff',borderRadius:2}}/>}
    </span>
  );
}

function Toggle({on}){ return <span className={'toggle'+(on?' on':'')}/>; }

function NumStepper({value, onChange, min=0, max=20}){
  return (
    <div className="stepper-num">
      <button type="button" onClick={()=>onChange(Math.max(min,value-1))}>−</button>
      <input value={value} onChange={e=>{const v=parseInt(e.target.value.replace(/\D/g,''))||0;onChange(Math.min(max,Math.max(min,v)));}}/>
      <button type="button" onClick={()=>onChange(Math.min(max,value+1))}>+</button>
    </div>
  );
}

Object.assign(window, { Icon, Check, Toggle, NumStepper });
