// Lecteur/écrivain des propriétés Unreal (format « tagged properties » UE4) utilisé dans les sauvegardes de prospection d'Icarus.
// Principe de sécurité : tout ce qui n'est pas compris est gardé tel quel (octets bruts) ; les tailles sont recalculées à l'écriture.
const UE=(()=>{
  const td=new TextDecoder("utf-8"),tdu=new TextDecoder("utf-16le");
  class R{constructor(u8,o=0,end=u8.length){this.u=u8;this.v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);this.o=o;this.end=end;}
    i32(){const x=this.v.getInt32(this.o,true);this.o+=4;return x;} u8(){return this.u[this.o++];}
    bytes(n){if(n<0||this.o+n>this.end)throw new Error("overflow");const b=this.u.subarray(this.o,this.o+n);this.o+=n;return b;}
    str(){const n=this.i32();if(n===0)return "";if(n>0){if(n>65536)throw new Error("bad str");const b=this.bytes(n);return td.decode(b.subarray(0,n-1));}
      const m=-n;if(m>65536)throw new Error("bad str");const b=this.bytes(m*2);return {u16:tdu.decode(b.subarray(0,m*2-2))};}}
  class W{constructor(){this.parts=[];this.len=0;} push(u8){this.parts.push(u8);this.len+=u8.length;}
    i32(x){const b=new Uint8Array(4);new DataView(b.buffer).setInt32(0,x,true);this.push(b);} u8(x){this.push(Uint8Array.of(x));}
    str(s){if(s===""){this.i32(0);return;}if(typeof s==="object"){const n=s.u16.length+1;this.i32(-n);const b=new Uint8Array(n*2);for(let i=0;i<s.u16.length;i++){const c=s.u16.charCodeAt(i);b[i*2]=c&255;b[i*2+1]=c>>8;}this.push(b);return;}
      const e=new TextEncoder().encode(s);this.i32(e.length+1);const b=new Uint8Array(e.length+1);b.set(e);this.push(b);}
    out(){const r=new Uint8Array(this.len);let o=0;for(const p of this.parts){r.set(p,o);o+=p.length;}return r;}}
  const sv=s=>typeof s==="object"?s.u16:s;
  // Lit une liste de propriétés jusqu'à « None »
  function readProps(r,depth){const props=[];
    while(true){const name=r.str();if(sv(name)==="None")return props;
      const type=r.str(),size=r.i32(),idx=r.i32();const p={name,type,size,idx};const T=sv(type);
      if(T==="StructProperty"){p.sname=r.str();p.sguid=r.bytes(16);}
      else if(T==="BoolProperty"){p.bool=r.u8();}
      else if(T==="ByteProperty"||T==="EnumProperty"){p.ename=r.str();}
      else if(T==="ArrayProperty"||T==="SetProperty"){p.inner=r.str();}
      else if(T==="MapProperty"){p.ktype=r.str();p.vtype=r.str();}
      p.hasGuid=r.u8();if(p.hasGuid)p.guid=r.bytes(16);
      const start=r.o,end=start+size;p.raw=r.bytes(size);
      try{p.val=readValue(p,new R(r.u,start,end),depth);}catch(e){p.val=undefined;}
      props.push(p);}}
  function readValue(p,r,depth){const T=sv(p.type);
    if(T==="IntProperty"){const x=r.i32();if(r.o!==r.end)throw 0;return x;}
    if(T==="NameProperty"||T==="StrProperty"||T==="EnumProperty"){const s=r.str();if(r.o!==r.end)throw 0;return s;}
    if(T==="StructProperty"&&depth<40){const v=readProps(r,depth+1);if(r.o!==r.end)throw 0;return v;}
    if(T==="ArrayProperty"&&depth<40){const n=r.i32();const I=sv(p.inner);
      if(I==="StructProperty"){const it={name:r.str(),type:r.str(),size:r.i32(),idx:r.i32(),sname:r.str(),sguid:r.bytes(16),hasGuid:r.u8()};if(it.hasGuid)it.guid=r.bytes(16);
        const els=[];for(let i=0;i<n;i++)els.push(readProps(r,depth+1));if(r.o!==r.end)throw 0;return {n,itemTag:it,els};}
      if(I==="NameProperty"||I==="StrProperty"||I==="EnumProperty"){const els=[];for(let i=0;i<n;i++)els.push(r.str());if(r.o!==r.end)throw 0;return {n,els};}
      if(I==="IntProperty"){const els=[];for(let i=0;i<n;i++)els.push(r.i32());if(r.o!==r.end)throw 0;return {n,els};}
      return undefined;}
    return undefined;}
  // Écriture
  function writeProps(w,props){for(const p of props)writeProp(w,p);w.str("None");}
  function valueBytes(p){if(p.val===undefined||!p.dirty)return p.raw;const T=sv(p.type),w=new W();
    if(T==="IntProperty")w.i32(p.val);
    else if(T==="NameProperty"||T==="StrProperty"||T==="EnumProperty")w.str(p.val);
    else if(T==="StructProperty")writeProps(w,p.val);
    else if(T==="ArrayProperty"){const I=sv(p.inner),v=p.val;w.i32(v.els.length);
      if(I==="StructProperty"){const body=new W();for(const e of v.els)writeProps(body,e);const bb=body.out();const it=v.itemTag;
        w.str(it.name);w.str(it.type);w.i32(bb.length);w.i32(it.idx);w.str(it.sname);w.push(it.sguid);w.u8(it.hasGuid);if(it.hasGuid)w.push(it.guid);w.push(bb);}
      else if(I==="IntProperty")for(const x of v.els)w.i32(x);
      else for(const s of v.els)w.str(s);}
    return w.out();}
  function writeProp(w,p){const vb=valueBytes(p);const T=sv(p.type);
    w.str(p.name);w.str(p.type);w.i32(vb.length);w.i32(p.idx);
    if(T==="StructProperty"){w.str(p.sname);w.push(p.sguid);}
    else if(T==="BoolProperty")w.u8(p.bool);
    else if(T==="ByteProperty"||T==="EnumProperty")w.str(p.ename);
    else if(T==="ArrayProperty"||T==="SetProperty")w.str(p.inner);
    else if(T==="MapProperty"){w.str(p.ktype);w.str(p.vtype);}
    w.u8(p.hasGuid);if(p.hasGuid)w.push(p.guid);w.push(vb);}
  // Marque une propriété et tous ses parents comme modifiés (pour recalculer les tailles)
  function markPath(path){for(const p of path)p.dirty=true;}
  const find=(props,n)=>props&&props.find(p=>sv(p.name)===n);
  return {R,W,readProps,writeProps,find,sv,markPath,
    parse(u8){return readProps(new R(u8),0);},
    write(props){const w=new W();writeProps(w,props);return w.out();},
    // Les données d'un recorder sont un tableau d'octets (ArrayProperty<ByteProperty>) contenant d'autres propriétés
    parseBytesArray(p){const r=new R(p.raw);const n=r.i32();const sub=r.u.subarray(4,4+n);return readProps(new R(sub),0);},
    bytesArrayValue(props){const body=UE.write(props);const w=new W();w.i32(body.length);w.push(body);return w.out();}};
})();
