(function () {
  'use strict';

  // jsPDF se verifica en tiempo de uso, no de carga
  function getJsPDF() {
    var j = window.jspdf && window.jspdf.jsPDF;
    if (!j) throw new Error('jsPDF no esta cargado. Asegurate de cargar jspdf.umd.min.js antes de EneagramaTheme.js');
    return j;
  }

  /* COLOR SYSTEM */
  const C = {
    ink0:[14,14,16],ink1:[28,28,32],ink2:[44,44,50],ink3:[72,72,80],ink4:[110,110,118],
    ink5:[158,158,165],ink6:[200,200,206],ink7:[228,228,233],ink8:[242,242,246],ink9:[250,250,252],
    wh:[255,255,255],gold:[168,148,96],gold2:[200,182,128],gold3:[232,222,190],gold4:[248,244,232],
    tx:[28,28,32],mu:[110,110,118],fa:[168,168,175],ln:[220,220,226],bg:[248,248,251],
  };
  const TC={1:[168,52,44],2:[190,75,115],3:[190,130,35],4:[95,75,155],5:[52,90,158],6:[45,115,95],7:[200,145,35],8:[148,42,42],9:[72,132,92]};

  const PW=210,PH=297,MX=12,CW=PW-MX*2,HDR=17,FY=286,CT=24,MB=8;

  /* --- enc(): elimina tildes y caracteres especiales para helvetica en jsPDF --- */
  function enc(s){
    if(s==null)return'';
    var r=String(s);
    r=r.replace(/\u00e1/g,'a').replace(/\u00e0/g,'a').replace(/\u00e2/g,'a');
    r=r.replace(/\u00e9/g,'e').replace(/\u00e8/g,'e').replace(/\u00ea/g,'e');
    r=r.replace(/\u00ed/g,'i').replace(/\u00ec/g,'i').replace(/\u00ee/g,'i');
    r=r.replace(/\u00f3/g,'o').replace(/\u00f2/g,'o').replace(/\u00f4/g,'o');
    r=r.replace(/\u00fa/g,'u').replace(/\u00f9/g,'u').replace(/\u00fb/g,'u');
    r=r.replace(/\u00fc/g,'u').replace(/\u00f1/g,'n');
    r=r.replace(/\u00c1/g,'A').replace(/\u00c0/g,'A');
    r=r.replace(/\u00c9/g,'E').replace(/\u00c8/g,'E');
    r=r.replace(/\u00cd/g,'I').replace(/\u00cc/g,'I');
    r=r.replace(/\u00d3/g,'O').replace(/\u00d2/g,'O');
    r=r.replace(/\u00da/g,'U').replace(/\u00d9/g,'U');
    r=r.replace(/\u00dc/g,'U').replace(/\u00d1/g,'N');
    r=r.replace(/\u00bf/g,'').replace(/\u00a1/g,'');
    r=r.replace(/\u2192/g,'->').replace(/\u2190/g,'<-');
    r=r.replace(/\u2014/g,'-').replace(/\u2013/g,'-');
    r=r.replace(/\u2026/g,'...');
    r=r.replace(/\u201c/g,'"').replace(/\u201d/g,'"');
    r=r.replace(/\u2018/g,"'").replace(/\u2019/g,"'");
    r=r.replace(/\u00b7/g,'.').replace(/\u2605/g,'*');
    return r;
  }

  /* --- helpers --- */
  function sf(doc,style,size,color){doc.setFont('helvetica',style);doc.setFontSize(size);doc.setTextColor(...(color||C.tx));}
  function sw(doc,text,maxW){return doc.splitTextToSize(enc(text),maxW);}
  function fr(doc,x,y,w,h,fill){doc.setFillColor(...fill);doc.rect(x,y,w,h,'F');}
  function rr(doc,x,y,w,h,r,fill,stroke,lw){if(fill)doc.setFillColor(...fill);if(stroke){doc.setDrawColor(...stroke);doc.setLineWidth(lw||0.25);}doc.roundedRect(x,y,w,h,r,r,fill&&stroke?'FD':fill?'F':'D');}
  function ensureSpace(doc,y,need,model){if(y+need>FY-MB)return newPage(doc,model);return y;}
  function t(doc,s,x,y,opts){doc.text(enc(s),x,y,opts||undefined);}  // shorthand for doc.text with enc

  /* ========== PORTADA ========== */
  function drawCover(doc,model){
    fr(doc,0,0,PW,PH,C.ink1);
    fr(doc,0,0,PW,24,C.ink0);
    fr(doc,0,0,3,PH,C.gold);

    try{const img=new Image();img.src='../img/one-logoletra.png';doc.addImage(img,'PNG',12,5.5,26,13);}
    catch(e){sf(doc,'bold',13,C.wh);t(doc,'ONE',12,14);}
    sf(doc,'normal',7.5,C.gold2);
    t(doc,'Escencial - Desarrollo de Personas',40,14);

    rr(doc,PW-52,8,40,9,2,C.ink2);
    sf(doc,'normal',7,C.ink5);
    t(doc,'ENEAGRAMA - 2026',PW-32,13.8,{align:'center'});

    doc.setDrawColor(...C.ink3);doc.setLineWidth(0.3);
    doc.line(12,28,PW-12,28);

    /* Simbolo eneagrama */
    try{
      const logoImg=new Image();logoImg.src='../img/one-logocolor.png';
      doc.addImage(logoImg,'PNG',120,53,64,32);
    }catch(e){
      const scx=PW-48,scy=72,sR=26;
      doc.setDrawColor(...C.gold);doc.setLineWidth(0.5);doc.circle(scx,scy,sR,'D');
      const pts=[];for(let i=0;i<9;i++){const a=(i*40-90)*Math.PI/180;pts.push([scx+sR*Math.cos(a),scy+sR*Math.sin(a)]);}
      doc.setDrawColor(...C.gold3);doc.setLineWidth(0.35);
      [[2,5],[5,8],[8,2]].forEach(([a,b])=>doc.line(pts[a][0],pts[a][1],pts[b][0],pts[b][1]));
      doc.setDrawColor(...C.ink3);doc.setLineWidth(0.2);
      const hx=[0,3,1,7,4,6,0];for(let i=0;i<hx.length-1;i++)doc.line(pts[hx[i]][0],pts[hx[i]][1],pts[hx[i+1]][0],pts[hx[i+1]][1]);
      pts.forEach((p,i)=>{const isDom=i===(model.typeNum-1);doc.setFillColor(...(isDom?TC[model.typeNum]:C.gold3));doc.circle(p[0],p[1],isDom?2.5:0.9,'F');});
      sf(doc,'bold',14,TC[model.typeNum]);t(doc,String(model.typeNum),scx,scy+3,{align:'center'});
    }

    sf(doc,'bold',42,C.wh);t(doc,'MATERIAL',15,60);
    sf(doc,'bold',42,C.ink5);t(doc,'DE',15,78);
    sf(doc,'normal',14,C.gold2);t(doc,'ESTUDIO ENEAGRAMA - GUIA COMPLETA',15,90);
    fr(doc,15,96,80,0.6,C.gold);

    rr(doc,12,103,CW,56,3,C.ink2);
    fr(doc,12,103,4,56,C.gold);

    sf(doc,'normal',7,C.ink5);t(doc,'MATERIAL PREPARADO PARA',22,114);
    sf(doc,'bold',22,C.wh);t(doc,model.fullName,22,127);
    sf(doc,'bold',10,C.gold2);t(doc,model.typeLabel,22,137);

    doc.setDrawColor(...C.ink3);doc.setLineWidth(0.3);
    doc.line(22,142,12+CW-6,142);

    sf(doc,'normal',7.5,C.ink5);
    t(doc,'Evaluacion: '+model.dateText+'   .   '+model.admin,22,148);
    t(doc,'Metodologia Eneagrama - Sistema Riso-Hudson',22,154);

    sf(doc,'bold',8,C.ink4);t(doc,'PUNTAJES POR ENEATIPO',12,168);
    const scores=model.scores;
    const cardW=(CW-8*0.5)/9;
    for(let tp=1;tp<=9;tp++){
      const cx=12+(tp-1)*(cardW+0.5),cy=172,sc=scores[tp]||0,col=TC[tp],isDom=tp===model.typeNum;
      rr(doc,cx,cy,cardW,24,2,isDom?C.ink3:C.ink2);
      fr(doc,cx,cy,cardW,2.5,col);
      sf(doc,'bold',isDom?8.5:7,col);t(doc,String(tp),cx+cardW/2,cy+10,{align:'center'});
      sf(doc,'bold',isDom?7:6.5,isDom?C.wh:C.ink5);t(doc,sc+'%',cx+cardW/2,cy+17,{align:'center'});
      const bx=cx+1.5,by=cy+19.5,bw=cardW-3;
      fr(doc,bx,by,bw,1.5,C.ink3);fr(doc,bx,by,bw*Math.min(sc,100)/100,1.5,col);
    }

    rr(doc,12,204,CW,36,3,C.ink2);fr(doc,12,204,3,36,C.gold);
    sf(doc,'bold',7,C.gold2);t(doc,'LEMA DEL TIPO',20,213);
    sf(doc,'italic',9.5,C.wh);
    doc.text(sw(doc,'"'+model.lema+'"',CW-20),20,221);

    rr(doc,12,247,CW,36,3,C.ink2);fr(doc,12,247,3,36,C.gold);
    sf(doc,'bold',7,C.ink5);t(doc,'RESUMEN DEL PERFIL',20,256);
    sf(doc,'normal',8.5,C.ink6);
    doc.text(sw(doc,model.summary,CW-18),20,263);

    sf(doc,'normal',6.5,C.ink4);
    t(doc,'Documento confidencial - ONE Escencial - Plataforma Eneagrama',PW/2,PH-7,{align:'center'});
  }

  /* ========== CHROME DE PAGINA ========== */
  function drawChrome(doc,model){
    fr(doc,0,0,PW,PH,C.bg);
    fr(doc,0,0,PW,HDR,C.ink1);
    fr(doc,0,0,3,PH,C.gold);

    try{const hImg=new Image();hImg.src='../img/one-logoletra.png';doc.addImage(hImg,'PNG',MX+1,3,22,11);}
    catch(e){sf(doc,'bold',9,C.wh);t(doc,'ONE',MX+2,9);}
    sf(doc,'normal',6.5,C.ink5);
    t(doc,'Material de Estudio Personalizado Eneagrama',MX+26,14.5);

    rr(doc,PW-66,4,54,9,2,C.ink2);
    sf(doc,'bold',6.5,C.gold2);
    t(doc,model.typeLabel,PW-39,9.5,{align:'center'});

    /* MARCA DE AGUA - one-iconocolor.png, 104x104mm centrado, opacity 0.09 */
    try{
      const mwImg=new Image();mwImg.src='../img/one-iconocolor.png';
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity:0.09}));
      doc.addImage(mwImg,'PNG',(210-104)/2,(297-104)/2,104,104);
      doc.restoreGraphicsState();
    }catch(e){}

    doc.setDrawColor(...C.gold3);doc.setLineWidth(0.4);
    doc.line(MX,FY,MX+CW,FY);

    sf(doc,'normal',6.5,C.mu);
    t(doc,model.fullName,MX+3,FY+4.5);
    t(doc,model.dateText,PW/2,FY+4.5,{align:'center'});
    t(doc,'Tipo '+model.typeNum+' - '+model.typeName,PW-MX,FY+4.5,{align:'right'});
  }

  function newPage(doc,model){doc.addPage();drawChrome(doc,model);return CT;}

  /* ========== TOC ========== */
  function drawTOC(doc,model){
    let y=newPage(doc,model);
    rr(doc,MX,y,CW,13,2,C.ink1);
    sf(doc,'bold',11,C.wh);t(doc,'INDICE DEL MATERIAL DE ESTUDIO',MX+6,y+9);
    y+=17;

    const titles=[
      'Carta Personal de Bienvenida','Historia y Origen del Eneagrama',
      'Las Tres Triadas - Centros de Inteligencia','Los Niveles de Desarrollo Psicologico',
      'Alas - Los Matices del Caracter','Flechas - Integracion y Desintegracion',
      'Los 27 Subtipos Instintivos','Tu Perfil Eneagramatico: Quien Sos',
      'Tus Fortalezas y Puntos de Cuidado','Comunicacion Estrategica por Eneatipo',
      'Liderazgo y Equipos desde tu Eneatipo','Plan de Desarrollo Personal 90 Dias',
      'Herramientas Practicas y Compromisos',
    ];

    titles.forEach((title,i)=>{
      const even=i%2===0;
      fr(doc,MX,y-3,CW,9.5,even?C.ink8:C.wh);
      rr(doc,MX+2,y-2.5,7.5,7,1.5,C.ink1);
      sf(doc,'bold',7.5,C.gold2);t(doc,String(i+1).padStart(2,'0'),MX+5.75,y+2,{align:'center'});
      sf(doc,'normal',9.5,C.tx);t(doc,title,MX+13,y+2);
      const tw=doc.getTextWidth(title);
      doc.setFillColor(...C.ln);
      for(let dx=MX+13+tw+3;dx<PW-MX-8;dx+=2.2)doc.circle(dx,y+1.2,0.22,'F');
      y+=9.5;
    });

    y+=7;
    doc.setDrawColor(...C.gold3);doc.setLineWidth(0.4);doc.line(MX,y,MX+CW,y);y+=7;
    sf(doc,'italic',9,C.mu);t(doc,'"El autoconocimiento es la base de todo liderazgo efectivo y toda comunicacion de impacto."',PW/2,y,{align:'center'});
    y+=5;sf(doc,'normal',7,C.fa);t(doc,'Basado en el Modelo Eneagrama - Metodologia Riso-Hudson - ONE Escencial',PW/2,y,{align:'center'});
  }

  /* ========== BANNER ========== */
  function drawBanner(doc,y,section,idx){
    const bh=15;
    rr(doc,MX,y,CW,bh,2,C.ink1);
    fr(doc,MX,y,3,bh,C.gold);
    rr(doc,MX+6,y+3,9,9,2,C.ink2);
    sf(doc,'bold',7.5,C.gold2);t(doc,String(idx+1).padStart(2,'0'),MX+10.5,y+9,{align:'center'});
    sf(doc,'bold',10,C.wh);
const titleLines = sw(doc, section.title, CW-28);
doc.text(titleLines, MX+20, y+10);
    return y+bh+4;
  }

  /* ========== RENDERERS ========== */
  function renderPara(doc,y,block,model){
    const x=MX+3,mw=CW-8,lh=block.lineH||4.4;
    sf(doc,block.bold?'bold':block.italic?'italic':'normal',block.size||9.8,block.color||C.tx);
    const lines=enc(String(block.text??'')).split('\n').flatMap(l=>doc.splitTextToSize(l,mw));
    const bh=lines.length*lh+1;
    y=ensureSpace(doc,y,bh,model);
    doc.text(lines,x,y);
    return y+bh;
  }

  function renderSubtitle(doc,y,block,model){
    y=ensureSpace(doc,y+2,26,model);
    sf(doc,'bold',10,block.color||C.ink1);
const lines=sw(doc,block.text||'',CW-6);
doc.text(lines,MX+3,y);
const tw=Math.min(doc.getTextWidth(enc(block.text||'')),CW-6);
fr(doc,MX+3,y+2,tw+2,0.6,C.gold);
return y+lines.length*5+1.5;
  }

  function renderBullets(doc,y,items,model,opts={}){
    const bCol=opts.bulletColor||C.gold;
    const indent=opts.indent||0;
    for(const item of items){
      y=ensureSpace(doc,y,6,model);
      const x=MX+3+indent,mw=CW-6-indent-7;
      doc.setFillColor(...bCol);doc.circle(x+1.2,y-1.6,1.2,'F');
      sf(doc,'normal',9.2,opts.color||C.tx);
      const lines=sw(doc,item,mw);doc.text(lines,x+5.5,y);
      y+=lines.length*4.3+1;
    }
    return y+0.5;
  }

  function renderNumbered(doc,y,items,model){
    for(let i=0;i<items.length;i++){
      y=ensureSpace(doc,y,10,model);
      const x=MX+3,mw=CW-13;
      rr(doc,x,y-4.5,7.5,6.5,1.5,C.ink8,C.ln,0.2);
      sf(doc,'bold',7.5,C.gold);doc.text(String(i+1),x+3.75,y,{align:'center'});
      sf(doc,'normal',9.2,C.tx);
      const lines=sw(doc,items[i],mw);doc.text(lines,x+11,y);
      y+=lines.length*4.3+1.5;
    }
    return y+0.5;
  }

  function renderQuote(doc,y,block,model){
    const x=MX+3,tw=CW-3,textX=x+14,textMaxW=(x+tw)-textX-6;
    const lines=sw(doc,block.text,textMaxW);
    const bh=lines.length*5.2+14;
    y=ensureSpace(doc,y,bh+3,model);
    rr(doc,x,y,tw,bh,2,C.ink8,C.ln,0.2);
    fr(doc,x,y,3,bh,C.gold);
    sf(doc,'bold',13,C.gold3);doc.text('"',x+7,y+10);
    sf(doc,'italic',8.5,C.ink2);doc.text(lines,textX,y+9);
    return y+bh+3;
  }

function renderInfoCard(doc,y,block,model){
  const x=MX+3,tw=CW-6,color=block.color||C.ink1;
  const textX=x+6, textW=PW-MX*2-textX+MX-18;
  const bLines=sw(doc,block.text||'',textW);
  const bh=bLines.length*4.8+18;
  if(y+bh+6>FY-MB)y=newPage(doc,model);
  rr(doc,x,y,tw,bh,2,C.bg,C.ln,0.2);
  fr(doc,x,y,tw,8,color);rr(doc,x,y,tw,8,2,color);fr(doc,x,y+5,tw,3,color);
  sf(doc,'bold',7.5,C.wh);t(doc,(block.title||'').toUpperCase(),textX,y+6.5);
  sf(doc,'normal',9.2,C.tx);doc.text(bLines,textX,y+15);
  return y+bh+3;
}

  function renderMetrics(doc,y,items,model){
    const x=MX+3,tw=CW-3,gap=3,n=Math.min(items.length,4),colW=(tw-gap*(n-1))/n;
    y=ensureSpace(doc,y,26,model);
    items.slice(0,n).forEach((m,i)=>{
      const cx=x+i*(colW+gap),col=m.color||TC[model.typeNum]||C.ink2;
      rr(doc,cx,y,colW,22,2,C.wh,C.ln,0.2);fr(doc,cx,y,colW,3,col);
      sf(doc,'bold',13,col);t(doc,m.label,cx+4,y+12);
      sf(doc,'bold',11,C.ink1);t(doc,String(m.value),cx+4,y+19);
      if(m.caption){sf(doc,'normal',6.5,C.mu);t(doc,m.caption,cx+colW-3,y+19,{align:'right'});}
      const bx=cx+4,by=y+20.5,bw=colW-8;
      fr(doc,bx,by,bw,1.5,C.ink7);fr(doc,bx,by,bw*Math.min(parseFloat(m.value)/100,1),1.5,col);
    });
    return y+26;
  }

  function renderTable(doc,y,block,model){
    const{headers,rows,colWidths:fracs,headerBg,compact}=block;
    if(!rows?.length)return y;
    const x0=MX+3,TW=CW-3;
    const colWs=fracs?fracs.map(f=>f*TW):headers.map(()=>TW/headers.length);
    const PAD=compact?2:2.5,LH=compact?3.9:4.1,FSZ=compact?7.5:8.2;
    const hBg=headerBg||C.ink1;
    const accentCol=TC[model.typeNum]||C.gold;

    const doHeader=(atY)=>{
      rr(doc,x0,atY,TW,8.5,1.5,hBg);
      sf(doc,'bold',7.5,C.wh);let cx=x0;
      // headers pasan por enc()
      headers.forEach((h,i)=>{t(doc,h,cx+PAD,atY+6);cx+=colWs[i];});
      return atY+8.5;
    };

    // Calcular alturas de fila usando sw() que ya llama enc()
    const rowHeights=rows.map(row=>{
      if(!Array.isArray(row))return 0;
      let maxL=1;
      row.forEach((cell,ci)=>{
        if(ci<colWs.length)maxL=Math.max(maxL,sw(doc,String(cell??''),colWs[ci]-PAD*2-1).length);
      });
      return maxL*LH+PAD*2;
    });

    const totalH=8.5+rowHeights.reduce((a,b)=>a+b,0);
    if(totalH<=FY-MB-CT)y=ensureSpace(doc,y,totalH+2,model);
    else y=ensureSpace(doc,y,15,model);
    y=doHeader(y);

    rows.forEach((row,rIdx)=>{
      if(!Array.isArray(row))return;
      let maxL=1;
      row.forEach((cell,ci)=>{
        if(ci<colWs.length)maxL=Math.max(maxL,sw(doc,String(cell??''),colWs[ci]-PAD*2-1).length);
      });
      const rowH=Math.max(maxL*LH+PAD*2,10);
      if(y+rowH>FY-MB){y=newPage(doc,model);y=doHeader(y);}
      fr(doc,x0,y,TW,rowH,rIdx%2===0?C.ink8:C.wh);
      let cx=x0;
      row.forEach((cell,ci)=>{
        if(ci>=colWs.length)return;
        const cw=colWs[ci]-PAD*2-1,isBold=ci===0;
        const isEmpty=String(cell??'').trim()===''||String(cell??'').trim()===' ';
        sf(doc,isBold?'bold':'normal',FSZ,isBold?accentCol:C.tx);
        if(isEmpty&&ci===0){
          doc.text(String(rIdx+1),cx+PAD,y+PAD+LH*0.85);
        }else if(isEmpty&&ci>0){
          const lineY=y+rowH-PAD-1.5;
          doc.setDrawColor(...C.ink6);doc.setLineWidth(0.3);
          doc.line(cx+PAD,lineY,cx+colWs[ci]-PAD-2,lineY);
        }else{
          // sw() ya llama enc() internamente - texto de celdas correctamente codificado
          doc.text(sw(doc,String(cell),cw),cx+PAD,y+PAD+LH*0.85);
        }
        cx+=colWs[ci];
      });
      doc.setDrawColor(...C.ln);doc.setLineWidth(0.12);
      doc.line(x0,y+rowH,x0+TW,y+rowH);
      y+=rowH;
    });
    return y+3;
  }

  function renderTwoCol(doc,y,block,model){
    const x=MX+3,tw=CW-3,gap=4,cW=(tw-gap)/2;
    y=ensureSpace(doc,y,18,model);
    if(block.leftTitle||block.rightTitle){
if(block.leftTitle){
  rr(doc,x,y,cW,7.5,1.5,C.ink8,C.ln,0.2);
  sf(doc,'bold',7,C.ink2);
  const ltL=sw(doc,block.leftTitle,cW-8);
  doc.text(ltL,x+4,y+5.5);
}
if(block.rightTitle){
  rr(doc,x+cW+gap,y,cW,7.5,1.5,C.ink8,C.ln,0.2);
  sf(doc,'bold',7,C.ink2);
  const rtL=sw(doc,block.rightTitle,cW-8);
  doc.text(rtL,x+cW+gap+4,y+5.5);
}
      y+=11;
    }
    const lItems=block.leftItems||[],rItems=block.rightItems||[];
    for(let i=0;i<Math.max(lItems.length,rItems.length);i++){
      const lL=lItems[i]?sw(doc,lItems[i],cW-10):[];
      const rL=rItems[i]?sw(doc,rItems[i],cW-10):[];
      const mH=Math.max(lL.length,rL.length)*4.2+4;
      y=ensureSpace(doc,y,mH+1,model);
      if(lItems[i]){doc.setFillColor(...C.gold);doc.circle(x+1.2,y-1.6,1.1,'F');sf(doc,'normal',8.8,C.tx);doc.text(lL,x+5,y);}
      if(rItems[i]){doc.setFillColor(...C.ink3);doc.circle(x+cW+gap+1.2,y-1.6,1.1,'F');sf(doc,'normal',8.8,C.tx);doc.text(rL,x+cW+gap+5,y);}
      y+=mH;
    }
    return y+2;
  }

  function renderScenario(doc,y,block,model){
    const x=MX+3,tw=CW-3;
    const parts=[
      {label:'Tu respuesta natural',text:block.natural||'',color:C.ink3,bg:C.ink8},
      {label:'Por que funciona',text:block.why||'',color:[20,150,65],bg:[238,248,242]},
      {label:'Ajuste recomendado',text:block.adjust||'',color:C.gold,bg:C.gold4},
    ].filter(p=>p.text);
    let est=13;parts.forEach(p=>{est+=6.5+sw(doc,p.text,tw-14).length*4.2+3;});
    y=ensureSpace(doc,y,Math.min(est,50),model);
    rr(doc,x,y,tw,11.5,2,C.ink1);fr(doc,x,y,3,11.5,C.gold);
    sf(doc,'bold',6.5,C.gold2);t(doc,(block.label||'ESCENARIO').toUpperCase(),x+6,y+5);
sf(doc,'bold',9,C.wh);
const scenTitleLines=sw(doc,block.title||'',tw-10);
doc.text(scenTitleLines,x+6,y+10.5);
    y+=13.5;
    parts.forEach(p=>{
      const pL=sw(doc,p.text,tw-12),pBh=6.5+pL.length*4.2+3;
      y=ensureSpace(doc,y,pBh,model);
      rr(doc,x,y,tw,pBh,1.5,p.bg,C.ln,0.15);fr(doc,x,y,2.5,pBh,p.color);
      sf(doc,'bold',7,p.color);t(doc,p.label+':',x+5.5,y+5);
      sf(doc,'normal',8.8,C.tx);doc.text(pL,x+5.5,y+10);
      y+=pBh+1.5;
    });
    return y+2.5;
  }

function renderHighlight(doc,y,block,model){
  const x=MX+3,tw=CW-6,color=block.color||C.ink2;
  const textX=x+7, textW=PW-MX-textX-6;
  const lines=sw(doc,block.text||'',textW);
  const bh=lines.length*4.5+13;
  y=ensureSpace(doc,y,bh+3,model);
  rr(doc,x,y,tw,bh,2,block.bg||C.ink8,C.ln,0.2);
  fr(doc,x,y,3,bh,color);
  if(block.title){
    sf(doc,'bold',7.5,color);t(doc,block.title,textX,y+6.5);
    sf(doc,'normal',9.2,C.tx);doc.text(lines,textX,y+12);
  } else {
    sf(doc,'normal',9.2,C.tx);doc.text(lines,textX,y+7);
  }
  return y+bh+3;
}

  /* ========== RENDER SECTION ========== */
  function renderSection(doc,model,section,idx){
    let y=newPage(doc,model);
    y=drawBanner(doc,y,section,idx);y+=1.5;
    if(section.intro){
      sf(doc,'italic',9,C.mu);
      const lines=sw(doc,section.intro,CW-3);doc.text(lines,MX+3,y);
      y+=lines.length*4.3+3;
    }
    const blocks=section.blocks||[];

    function estimateH(b){
      if(!b)return 0;const TW2=CW-3;
      if(b.type==='infoCard')return sw(doc,b.text||'',TW2-14).length*4.4+22;
      if(b.type==='table'){
        const f2=b.colWidths||[];
        const cW2=f2.length?f2.map(f=>f*TW2):(b.headers||[]).map(()=>TW2/(b.headers||[1]).length);
        const P2=b.compact?2:2.5,L2=b.compact?3.9:4.1;
        let h=8.5;
        (b.rows||[]).forEach(row=>{if(!Array.isArray(row))return;let m=1;row.forEach((c,ci)=>{if(ci<cW2.length)m=Math.max(m,sw(doc,String(c??''),cW2[ci]-P2*2-1).length);});h+=Math.max(m*L2+P2*2,10);});
        return h+3;
      }
      if(b.type==='quote')return sw(doc,b.text||'',TW2-22).length*5.2+20;
      if(b.type==='paragraph'){const lines=enc(String(b.text||'')).split('\n').flatMap(l=>doc.splitTextToSize(l,CW-8));return lines.length*(b.lineH||4.4)+4;}
      return 0;
    }

    for(let bi=0;bi<blocks.length;bi++){
      const block=blocks[bi],next=blocks[bi+1];
      if(next&&(block.type==='infoCard'&&next.type==='table'||block.type==='quote'&&next.type==='paragraph')){
        if(y+estimateH(block)+5+estimateH(next)>FY-MB)y=newPage(doc,model);
      }
      switch(block.type){
        case 'paragraph':  y=renderPara(doc,y,block,model)+1.5;break;
        case 'subtitle':   y=renderSubtitle(doc,y,block,model)+1;break;
        case 'bullets':    y=renderBullets(doc,y,block.items,model,block)+1.5;break;
        case 'numbered':   y=renderNumbered(doc,y,block.items,model)+1.5;break;
        case 'quote':      y=renderQuote(doc,y,block,model)+1.5;break;
        case 'metrics':    y=renderMetrics(doc,y,block.items,model)+1.5;break;
        case 'table':      y=renderTable(doc,y,block,model)+1.5;break;
        case 'twoColumn':  y=renderTwoCol(doc,y,block,model)+1.5;break;
        case 'scenario':   y=renderScenario(doc,y,block,model)+2;break;
        case 'infoCard':   y=renderInfoCard(doc,y,block,model)+1.5;break;
        case 'highlight':  y=renderHighlight(doc,y,block,model)+1.5;break;
        case 'divider':
          y=ensureSpace(doc,y+2,4,model);
          doc.setDrawColor(...C.ln);doc.setLineWidth(0.2);
          doc.line(MX+3,y,MX+CW,y);y+=4;break;
      }
    }
  }

  function render(model){
    const doc=new (getJsPDF())({orientation:'p',unit:'mm',format:'a4'});
    drawCover(doc,model);
    drawTOC(doc,model);
    model.sections.forEach((sec,i)=>renderSection(doc,model,sec,i));
    return doc;
  }

  window.EneagramaTheme={render};
})();