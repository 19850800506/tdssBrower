/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96.6
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(["exports","./Matrix2-4706dd70","./defaultValue-028a8a27","./RuntimeError-a977b8e0","./EllipsoidGeodesic-0454f1c2","./EllipsoidRhumbLine-248c8a1e","./IntersectionTests-54d7f8a4","./ComponentDatatype-438cad2a","./Plane-f4cd36d8"],function(_,n,p,G,H,z,U,L,b){"use strict";const d={};d.numberOfPoints=function(s,a,r){const t=n.Cartesian3.distance(s,a);return Math.ceil(t/r)},d.numberOfPointsRhumbLine=function(s,a,r){const t=Math.pow(s.longitude-a.longitude,2)+Math.pow(s.latitude-a.latitude,2);return Math.max(1,Math.ceil(Math.sqrt(t/(r*r))))};const q=new n.Cartographic;d.extractHeights=function(s,a){const r=s.length,t=new Array(r);for(let e=0;e<r;e++){const l=s[e];t[e]=a.cartesianToCartographic(l,q).height}return t};const X=new n.Matrix4,Z=new n.Cartesian3,O=new n.Cartesian3,Y=new b.Plane(n.Cartesian3.UNIT_X,0),k=new n.Cartesian3,W=new b.Plane(n.Cartesian3.UNIT_X,0),F=new n.Cartesian3,j=new n.Cartesian3,R=[];function v(s,a,r){const t=R;t.length=s;let e;if(a===r){for(e=0;e<s;e++)t[e]=a;return t}const g=(r-a)/s;for(e=0;e<s;e++){const w=a+e*g;t[e]=w}return t}const S=new n.Cartographic,D=new n.Cartographic,T=new n.Cartesian3,N=new n.Cartesian3,J=new n.Cartesian3,I=new H.EllipsoidGeodesic;let E=new z.EllipsoidRhumbLine;function K(s,a,r,t,e,l,g,w){const c=t.scaleToGeodeticSurface(s,N),m=t.scaleToGeodeticSurface(a,J),h=d.numberOfPoints(s,a,r),f=t.cartesianToCartographic(c,S),y=t.cartesianToCartographic(m,D),u=v(h,e,l);I.setEndPoints(f,y);const P=I.surfaceDistance/h;let i=w;f.height=e;let o=t.cartographicToCartesian(f,T);n.Cartesian3.pack(o,g,i),i+=3;for(let C=1;C<h;C++){const A=I.interpolateUsingSurfaceDistance(C*P,D);A.height=u[C],o=t.cartographicToCartesian(A,T),n.Cartesian3.pack(o,g,i),i+=3}return i}function Q(s,a,r,t,e,l,g,w){const c=t.cartesianToCartographic(s,S),m=t.cartesianToCartographic(a,D),h=d.numberOfPointsRhumbLine(c,m,r);c.height=0,m.height=0;const f=v(h,e,l);E.ellipsoid.equals(t)||(E=new z.EllipsoidRhumbLine(void 0,void 0,t)),E.setEndPoints(c,m);const y=E.surfaceDistance/h;let u=w;c.height=e;let P=t.cartographicToCartesian(c,T);n.Cartesian3.pack(P,g,u),u+=3;for(let i=1;i<h;i++){const o=E.interpolateUsingSurfaceDistance(i*y,D);o.height=f[i],P=t.cartographicToCartesian(o,T),n.Cartesian3.pack(P,g,u),u+=3}return u}d.wrapLongitude=function(s,a){const r=[],t=[];if(p.defined(s)&&s.length>0){a=p.defaultValue(a,n.Matrix4.IDENTITY);const e=n.Matrix4.inverseTransformation(a,X),l=n.Matrix4.multiplyByPoint(e,n.Cartesian3.ZERO,Z),g=n.Cartesian3.normalize(n.Matrix4.multiplyByPointAsVector(e,n.Cartesian3.UNIT_Y,O),O),w=b.Plane.fromPointNormal(l,g,Y),c=n.Cartesian3.normalize(n.Matrix4.multiplyByPointAsVector(e,n.Cartesian3.UNIT_X,k),k),m=b.Plane.fromPointNormal(l,c,W);let h=1;r.push(n.Cartesian3.clone(s[0]));let f=r[0];const y=s.length;for(let u=1;u<y;++u){const P=s[u];if(b.Plane.getPointDistance(m,f)<0||b.Plane.getPointDistance(m,P)<0){const i=U.IntersectionTests.lineSegmentPlane(f,P,w,F);if(p.defined(i)){const o=n.Cartesian3.multiplyByScalar(g,5e-9,j);b.Plane.getPointDistance(w,f)<0&&n.Cartesian3.negate(o,o),r.push(n.Cartesian3.add(i,o,new n.Cartesian3)),t.push(h+1),n.Cartesian3.negate(o,o),r.push(n.Cartesian3.add(i,o,new n.Cartesian3)),h=1}}r.push(n.Cartesian3.clone(s[u])),h++,f=P}t.push(h)}return{positions:r,lengths:t}},d.generateArc=function(s){p.defined(s)||(s={});const a=s.positions;if(!p.defined(a))throw new G.DeveloperError("options.positions is required.");const r=a.length,t=p.defaultValue(s.ellipsoid,n.Ellipsoid.WGS84);let e=p.defaultValue(s.height,0);const l=Array.isArray(e);if(r<1)return[];if(r===1){const i=t.scaleToGeodeticSurface(a[0],N);if(e=l?e[0]:e,e!==0){const o=t.geodeticSurfaceNormal(i,T);n.Cartesian3.multiplyByScalar(o,e,o),n.Cartesian3.add(i,o,i)}return[i.x,i.y,i.z]}let g=s.minDistance;if(!p.defined(g)){const i=p.defaultValue(s.granularity,L.CesiumMath.RADIANS_PER_DEGREE);g=L.CesiumMath.chordLength(i,t.maximumRadius)}let w=0,c;for(c=0;c<r-1;c++)w+=d.numberOfPoints(a[c],a[c+1],g);const m=(w+1)*3,h=new Array(m);let f=0;for(c=0;c<r-1;c++){const i=a[c],o=a[c+1],C=l?e[c]:e,A=l?e[c+1]:e;f=K(i,o,g,t,C,A,h,f)}R.length=0;const y=a[r-1],u=t.cartesianToCartographic(y,S);u.height=l?e[r-1]:e;const P=t.cartographicToCartesian(u,T);return n.Cartesian3.pack(P,h,m-3),h};const B=new n.Cartographic,$=new n.Cartographic;d.generateRhumbArc=function(s){p.defined(s)||(s={});const a=s.positions;if(!p.defined(a))throw new G.DeveloperError("options.positions is required.");const r=a.length,t=p.defaultValue(s.ellipsoid,n.Ellipsoid.WGS84);let e=p.defaultValue(s.height,0);const l=Array.isArray(e);if(r<1)return[];if(r===1){const C=t.scaleToGeodeticSurface(a[0],N);if(e=l?e[0]:e,e!==0){const A=t.geodeticSurfaceNormal(C,T);n.Cartesian3.multiplyByScalar(A,e,A),n.Cartesian3.add(C,A,C)}return[C.x,C.y,C.z]}const g=p.defaultValue(s.granularity,L.CesiumMath.RADIANS_PER_DEGREE);let w=0,c,m=t.cartesianToCartographic(a[0],B),h;for(c=0;c<r-1;c++)h=t.cartesianToCartographic(a[c+1],$),w+=d.numberOfPointsRhumbLine(m,h,g),m=n.Cartographic.clone(h,B);const f=(w+1)*3,y=new Array(f);let u=0;for(c=0;c<r-1;c++){const C=a[c],A=a[c+1],V=l?e[c]:e,x=l?e[c+1]:e;u=Q(C,A,g,t,V,x,y,u)}R.length=0;const P=a[r-1],i=t.cartesianToCartographic(P,S);i.height=l?e[r-1]:e;const o=t.cartographicToCartesian(i,T);return n.Cartesian3.pack(o,y,f-3),y},d.generateCartesianArc=function(s){const a=d.generateArc(s),r=a.length/3,t=new Array(r);for(let e=0;e<r;e++)t[e]=n.Cartesian3.unpack(a,e*3);return t},d.generateCartesianRhumbArc=function(s){const a=d.generateRhumbArc(s),r=a.length/3,t=new Array(r);for(let e=0;e<r;e++)t[e]=n.Cartesian3.unpack(a,e*3);return t},_.PolylinePipeline=d});
