document.addEventListener('DOMContentLoaded', function(){
  // menu toggle untuk mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.navbar');
  var links = document.querySelectorAll('.navbar a');
  if(toggle && nav){ toggle.addEventListener('click', function(){ nav.classList.toggle('open'); }); }

  // highlight berdasarkan file aktif
  var current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(function(a){
    var href = a.getAttribute('href').split('/').pop();
    if(!href) return;
    if(href === current || (href === 'index.html' && current === '')){
      a.classList.add('active');
    }
    a.addEventListener('click', function(){ links.forEach(function(x){x.classList.remove('active');}); this.classList.add('active'); if(nav && nav.classList.contains('open')) nav.classList.remove('open'); });
  });

  // jika ada sections di halaman, aktifkan highlight on scroll dan sidebar
  var sections = Array.prototype.slice.call(document.querySelectorAll('section'));
  function highlightOnScroll(){
    if(sections.length === 0) return;
    var pos = window.scrollY + 80;
    links.forEach(function(x){ x.classList.remove('active'); });
    var found = false;
    sections.forEach(function(s){
      var top = s.offsetTop;
      var h = s.offsetHeight;
      var id = s.id;
      var link = document.querySelector('.navbar a[href$="#'+id+'"]') || document.querySelector('.navbar a[href$="'+ (location.pathname.split('/').pop()||'index.html') +'#'+id+'"]');
      if(pos >= top && pos < top + h){ if(link) link.classList.add('active'); found = true; }
    });
    if(!found && window.scrollY < 120){
      var homeLink = document.querySelector('.navbar a[href="index.html"]'); if(homeLink) homeLink.classList.add('active');
    }
  }
  window.addEventListener('scroll', highlightOnScroll);
  window.addEventListener('load', highlightOnScroll);

  // Sidebar navigation (only if present)
  var sidebar = document.getElementById('section-sidebar');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnTop = document.getElementById('btn-top');

  function getCurrentSectionIndex(){
    if(sections.length === 0) return -1;
    var mid = window.scrollY + (window.innerHeight/2);
    for(var i=0;i<sections.length;i++){
      var s = sections[i];
      if(mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight) return i;
    }
    return -1;
  }

  function updateSidebar(){
    if(!sidebar) return;
    var idx = getCurrentSectionIndex();
    if(btnPrev){ if(idx <= 0) btnPrev.setAttribute('disabled',''); else btnPrev.removeAttribute('disabled'); }
    if(btnNext){ if(idx < 0 || idx >= sections.length-1) btnNext.setAttribute('disabled',''); else btnNext.removeAttribute('disabled'); }
  }

  if(btnPrev){ btnPrev.addEventListener('click', function(){ var i = getCurrentSectionIndex(); if(i > 0) sections[i-1].scrollIntoView({behavior:'smooth', block:'start'}); }); }
  if(btnNext){ btnNext.addEventListener('click', function(){ var i = getCurrentSectionIndex(); if(i < 0) i = -1; if(i < sections.length-1) sections[i+1].scrollIntoView({behavior:'smooth', block:'start'}); }); }
  if(btnTop){ btnTop.addEventListener('click', function(){ var topEl = document.getElementById('top'); if(topEl) topEl.scrollIntoView({behavior:'smooth', block:'start'}); }); }

  window.addEventListener('scroll', updateSidebar);
  window.addEventListener('load', updateSidebar);

  // keyboard navigation A/S
  window.addEventListener('keydown', function(e){ if(e.target && (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA')) return; if((e.key==='a' || e.key==='A') && btnPrev && !btnPrev.disabled) btnPrev.click(); if((e.key==='s' || e.key==='S') && btnNext && !btnNext.disabled) btnNext.click(); });
});
