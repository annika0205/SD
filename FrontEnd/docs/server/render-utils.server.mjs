import './polyfills.server.mjs';
import{Aa as w,Ba as P,Da as I,Ea as V,Fa as x,Ga as S,Ia as T,Ja as _,La as F,ba as f,da as g,ea as h,fa as p,ga as y,ia as C,ma as E}from"./chunk-JYODBYVQ.mjs";import{k as l,l as d,m as u}from"./chunk-E44LSF4W.mjs";E();S();E();S();F();function a(e,n,i,t=""){return d(this,null,function*(){for(let r of e){let{path:o,redirectTo:c,loadChildren:L,children:R}=r;if(o===void 0)continue;let s=j(t,o);if(c!==void 0){yield{route:s,success:!1,redirect:!0};continue}if(/[:*]/.test(o)){yield{route:s,success:!1,redirect:!1};continue}if(yield{route:s,success:!0,redirect:!1},R?.length&&(yield*u(a(R,n,i,s))),L){let m=yield new l(T(r,n,i).toPromise());if(m){let{routes:N,injector:A=i}=m;yield*u(a(N,n,A,s))}}}})}function D(e,n){return d(this,null,function*(){let i=y(C,"server",[{provide:w,useValue:{document:n,url:""}},{provide:f,useFactory:()=>{class t extends f{ignoredLogs=new Set(["Angular is running in development mode."]);log(o){this.ignoredLogs.has(o)||super.log(o)}}return new t}},...P])();try{let t;O(e)?t=yield new l(e()):t=(yield new l(i.bootstrapModule(e))).injector.get(g),yield new l(h(t));let r=t.injector,o=r.get(_);if(o.config.length===0)yield{route:"",success:!0,redirect:!1};else{let c=r.get(p);yield*u(a(o.config,c,r))}}finally{i.destroy()}})}function O(e){return typeof e=="function"&&!("\u0275mod"in e)}function j(...e){return e.filter(Boolean).join("/")}export{D as extractRoutes,x as renderApplication,V as renderModule,f as \u0275Console,I as \u0275SERVER_CONTEXT};
