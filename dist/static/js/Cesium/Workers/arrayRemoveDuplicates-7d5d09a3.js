define(["exports","./RuntimeError-ac440aa5","./defaultValue-69ee94f4","./ComponentDatatype-07fbb0d4"],(function(e,n,t,i){"use strict";const d=i.CesiumMath.EPSILON10;e.arrayRemoveDuplicates=function(e,n,i,f){if(!t.defined(e))return;i=t.defaultValue(i,!1);const u=t.defined(f),r=e.length;if(r<2)return e;let a,s,l,c=e[0],o=0,p=-1;for(a=1;a<r;++a)s=e[a],n(c,s,d)?(t.defined(l)||(l=e.slice(0,a),o=a-1,p=0),u&&f.push(a)):(t.defined(l)&&(l.push(s),o=a,u&&(p=f.length)),c=s);return i&&n(e[0],e[r-1],d)&&(u&&(t.defined(l)?f.splice(p,0,o):f.push(r-1)),t.defined(l)?l.length-=1:l=e.slice(0,-1)),t.defined(l)?l:e}}));
