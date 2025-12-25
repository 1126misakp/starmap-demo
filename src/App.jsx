import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Network, Database, FileText, Calendar, X, Activity, Users, Building2, ChevronRight, MousePointer2, Move3d, Loader2, Flag, Filter, List, ChevronDown, ChevronUp } from 'lucide-react';


// --- 数据定义 ---

const BASE_DEPARTMENTS = [
  { id: 'd1', label: '总经办', type: 'department', color: '#EF4444' }, 
  { id: 'd2', label: '人资部', type: 'department', color: '#F97316' }, 
  { id: 'd3', label: '战略企管部', type: 'department', color: '#F59E0B' }, 
  { id: 'd4', label: '招商运营中心', type: 'department', color: '#84CC16' }, 
  { id: 'd5', label: '技术中心', type: 'department', color: '#10B981' }, 
  { id: 'd6', label: '基建部', type: 'department', color: '#06B6D4' }, 
  { id: 'd7', label: '安环部', type: 'department', color: '#3B82F6' }, 
  { id: 'd8', label: '财务部', type: 'department', color: '#6366F1' }, 
  { id: 'd9', label: '审计部', type: 'department', color: '#8B5CF6' }, 
  { id: 'd10', label: '党委组织部', type: 'department', color: '#D946EF' }, 
  { id: 's1', label: '子公司: 物业公司', type: 'subsidiary', color: '#EC4899' }, 
  { id: 's2', label: '子公司: 绿建科技', type: 'subsidiary', color: '#F43F5E' }, 
];

// 辅助生成通用里程碑
const GENERIC_MILESTONES = [
  { id: 'm1', label: '项目立项', position: 10 },
  { id: 'm2', label: '方案评审', position: 35 },
  { id: 'm3', label: '实施阶段', position: 60 },
  { id: 'm4', label: '验收交付', position: 90 },
];

const PROJECTS_DATA = [
  { 
    id: 'p1', 
    label: '智慧园区升级改造', 
    type: 'project', 
    color: '#FFFFFF', 
    progress: 65, 
    status: 'processing', 
    description: '对集团总部园区进行智能化弱电改造及OA系统升级。', 
    participants: ['d5', 'd6', 'd8', 's1'], 
    milestones: GENERIC_MILESTONES,
    docs: [
      { title: 'OA系统需求调研纪要.pdf', date: '2023-10-12', type: '纪要', milestoneId: 'm1' },
      { title: '弱电工程施工图v2.0', date: '2023-11-05', type: '图纸', milestoneId: 'm2' },
      { title: '中期进度汇报.ppt', date: '2023-12-20', type: '汇报', milestoneId: 'm3' },
      { title: '服务器采购合同', date: '2023-11-15', type: '合同', milestoneId: 'm3' }
    ] 
  },
  { 
    id: 'p2', 
    label: '年度财务内控审计', 
    type: 'project', 
    color: '#FFFFFF', 
    progress: 90, 
    status: 'processing', 
    description: '针对全集团及子公司的年度财务合规性审计。', 
    participants: ['d1', 'd8', 'd9', 's1', 's2'],
    milestones: [
        { id: 'm1', label: '审计启动', position: 10 },
        { id: 'm2', label: '现场取证', position: 50 },
        { id: 'm3', label: '报告初稿', position: 80 },
        { id: 'm4', label: '整改复核', position: 95 }
    ],
    docs: [
      { title: '审计启动会签到表', date: '2023-11-01', type: '记录', milestoneId: 'm1' },
      { title: '子公司财务抽凭底稿', date: '2023-11-15', type: '底稿', milestoneId: 'm2' },
      { title: '内控缺陷整改建议书', date: '2023-12-05', type: '公文', milestoneId: 'm3' },
      { title: '年度审计正式报告.pdf', date: '2023-12-20', type: '报告', milestoneId: 'm4' }
    ] 
  },
  { id: 'p3', label: '绿建技术研发专项', type: 'project', color: '#FFFFFF', progress: 30, status: 'delayed', description: '新型环保建材的研发与实验基地建设。', participants: ['d3', 'd5', 'd7', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '可行性报告.pdf', date: '2023-09-15', type: '报告', milestoneId: 'm1' }] },
  { id: 'p4', label: '新业务招商推介会', type: 'project', color: '#FFFFFF', progress: 100, status: 'completed', description: '主要针对二期园区的招商引资活动。', participants: ['d1', 'd4', 'd8', 's1'], milestones: GENERIC_MILESTONES, docs: [{ title: '签约名单.xlsx', date: '2023-08-20', type: '表格', milestoneId: 'm4' }] },
  { id: 'p5', label: '集团人才盘点', type: 'project', color: '#FFFFFF', progress: 50, status: 'processing', description: '全集团核心关键岗位人才胜任力评估。', participants: ['d2', 'd10', 's1', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '盘点通知.doc', date: '2023-11-01', type: '通知', milestoneId: 'm1' }, { title: '人才九宫格初稿', date: '2023-11-20', type: '图表', milestoneId: 'm3' }] },
  { id: 'p6', label: '供应链金融平台搭建', type: 'project', color: '#FFFFFF', progress: 20, status: 'processing', description: '联合银行搭建上下游供应链金融服务系统。', participants: ['d8', 'd3', 'd5', 's1'], milestones: GENERIC_MILESTONES, docs: [{ title: '银企合作协议', date: '2024-01-10', type: '合同', milestoneId: 'm1' }] },
  { id: 'p7', label: '安全生产可视化监控', type: 'project', color: '#FFFFFF', progress: 85, status: 'processing', description: '全厂区AI摄像头覆盖及隐患自动识别系统。', participants: ['d7', 'd5', 's1', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '监控点位图', date: '2023-11-20', type: '图纸', milestoneId: 'm2' }] },
  { id: 'p8', label: '集团品牌VI升级', type: 'project', color: '#FFFFFF', progress: 95, status: 'completed', description: '重新设计企业LOGO及办公应用系统视觉规范。', participants: ['d1', 'd3', 'd4'], milestones: GENERIC_MILESTONES, docs: [{ title: 'VI手册v2.0', date: '2023-10-01', type: '手册', milestoneId: 'm4' }] },
  { id: 'p9', label: '干部梯队“青苗计划”', type: 'project', color: '#FFFFFF', progress: 40, status: 'processing', description: '选拔优秀的年轻骨干进行为期一年的脱产培训。', participants: ['d2', 'd10', 's1', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '学员名单', date: '2024-01-05', type: '名单', milestoneId: 'm2' }] },
  { id: 'p10', label: '绿色债券发行筹备', type: 'project', color: '#FFFFFF', progress: 10, status: 'delayed', description: '利用绿建业务优势申请发行绿色企业债。', participants: ['d8', 'd3', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '券商尽调清单', date: '2024-02-01', type: '清单', milestoneId: 'm1' }] },
  { id: 'p11', label: '物业缴费小程序上线', type: 'project', color: '#FFFFFF', progress: 75, status: 'processing', description: '开发业主端小程序，实现自助缴费和报修。', participants: ['d5', 's1', 'd8'], milestones: GENERIC_MILESTONES, docs: [{ title: 'UI设计稿', date: '2023-12-15', type: '设计', milestoneId: 'm3' }] },
  { id: 'p12', label: 'ISO管理体系年审', type: 'project', color: '#FFFFFF', progress: 60, status: 'processing', description: '质量、环境、职业健康三体系的年度外部审核。', participants: ['d3', 'd7', 'd6', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '外审计划', date: '2024-01-20', type: '计划', milestoneId: 'm3' }] },
  { id: 'p13', label: '二期厂房基建工程', type: 'project', color: '#FFFFFF', progress: 45, status: 'delayed', description: '二期扩建工程的主体施工阶段。', participants: ['d6', 'd7', 'd8', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '施工进度表', date: '2024-01-01', type: '表格', milestoneId: 'm2' }] },
  { id: 'p14', label: '全员绩效考核改革', type: 'project', color: '#FFFFFF', progress: 15, status: 'processing', description: '引入OKR工具，重构绩效考核体系。', participants: ['d2', 'd1', 'd3'], milestones: GENERIC_MILESTONES, docs: [{ title: '改革宣讲PPT', date: '2024-02-10', type: 'PPT', milestoneId: 'm1' }] },
  { id: 'p15', label: '党员进社区志愿活动', type: 'project', color: '#FFFFFF', progress: 100, status: 'completed', description: '组织全体党员参与周边社区环境治理。', participants: ['d10', 's1'], milestones: GENERIC_MILESTONES, docs: [{ title: '活动新闻稿', date: '2023-07-01', type: '新闻', milestoneId: 'm4' }] },
  { id: 'p16', label: '高新技术企业复审', type: 'project', color: '#FFFFFF', progress: 55, status: 'processing', description: '三年一次的高企资质重新认定工作。', participants: ['d5', 'd8', 'd3', 's2'], milestones: GENERIC_MILESTONES, docs: [{ title: '申报材料汇编', date: '2023-11-11', type: '申报书', milestoneId: 'm2' }] },
  { id: 'p17', label: '法律合规风险排查', type: 'project', color: '#FFFFFF', progress: 80, status: 'processing', description: '对历史合同和规章制度进行法律风险体检。', participants: ['d1', 'd9', 'd3'], milestones: GENERIC_MILESTONES, docs: [{ title: '风险整改建议', date: '2023-12-30', type: '报告', milestoneId: 'm3' }] },
  { id: 'p18', label: '食堂餐饮服务招标', type: 'project', color: '#FFFFFF', progress: 90, status: 'processing', description: '园区食堂新一轮供应商公开招标。', participants: ['d1', 'd2', 'd8', 's1'], milestones: GENERIC_MILESTONES, docs: [{ title: '中标通知书', date: '2024-01-15', type: '通知', milestoneId: 'm4' }] },
];

// --- 3D 核心组件 ---


const ThreeGraph = ({ 
  onNodeClick, 
  selectedNodeId,
  data 
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const objectsRef = useRef([]); 
  const nodePositionsRef = useRef(new Map()); 
  const isFocusingRef = useRef(false);
  const isReturningRef = useRef(false); // 新增：是否正在回退
  const targetQuaternionRef = useRef(null);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);
  
  const SPHERE_RADIUS = 180; 

  useEffect(() => {
    if (window.THREE) {
      setIsThreeLoaded(true);
      return;
    }

    const scriptId = 'three-js-lib';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => setIsThreeLoaded(true);
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.THREE) {
          setIsThreeLoaded(true);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!isThreeLoaded || !mountRef.current) return;
    const THREE = window.THREE;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    nodePositionsRef.current.clear();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.001);

    const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000); 
    camera.position.z = 380; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(100, 200, 100);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x4444ff, 0.8);
    pointLight2.position.set(-100, -200, 100);
    scene.add(pointLight2);

    const nodeMeshes = [];
    const deptPositions = {};

    const createTextSprite = (message, color, fontSize) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Object3D();

      const font = `Bold ${fontSize}px Arial`;
      ctx.font = font;
      const width = ctx.measureText(message).width + 10;
      const height = fontSize * 1.5;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(message, width/2, height/2);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(material);
      const scale = 0.5; 
      sprite.scale.set(width * scale, height * scale, 1);
      return sprite;
    };

    const deptGeo = new THREE.SphereGeometry(12, 32, 32);
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    data.departments.forEach((dept, i) => {
      const y = 1 - (i / (data.departments.length - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y); 
      const theta = phi * i;
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const position = new THREE.Vector3(x, y, z).multiplyScalar(SPHERE_RADIUS);
      deptPositions[dept.id] = position;
      nodePositionsRef.current.set(dept.id, position.clone());

      const material = new THREE.MeshPhongMaterial({ 
        color: dept.color,
        transparent: true,
        opacity: 0.9,
        shininess: 100
      });
      const mesh = new THREE.Mesh(deptGeo, material);
      mesh.position.copy(position);
      mesh.userData = { id: dept.id, type: 'department', color: dept.color };
      
      const label = createTextSprite(dept.label, dept.color, 24);
      label.position.set(0, 20, 0);
      label.renderOrder = 999; 
      mesh.add(label);

      scene.add(mesh);
      nodeMeshes.push({ mesh, node: dept });
    });

    const projGeo = new THREE.SphereGeometry(7, 16, 16);
    const projMaterialBase = new THREE.MeshPhongMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.9,
        shininess: 50
    });

    data.projects.forEach((proj) => {
      const center = new THREE.Vector3(0,0,0);
      let count = 0;
      proj.participants?.forEach(pid => {
        if (deptPositions[pid]) {
          center.add(deptPositions[pid]);
          count++;
        }
      });
      
      if (count > 0) {
        center.divideScalar(count);
        center.multiplyScalar(0.5); 
      }
      
      center.x += (Math.random() - 0.5) * 60;
      center.y += (Math.random() - 0.5) * 60;
      center.z += (Math.random() - 0.5) * 60;

      const mesh = new THREE.Mesh(projGeo, projMaterialBase.clone());
      mesh.position.copy(center);
      mesh.userData = { id: proj.id, type: 'project', color: '#ffffff' };
      nodePositionsRef.current.set(proj.id, center.clone());

      scene.add(mesh);
      nodeMeshes.push({ mesh, node: proj });

      proj.participants?.forEach(pid => {
        if (deptPositions[pid]) {
          const points = [center, deptPositions[pid]];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.2 });
          const line = new THREE.Line(lineGeo, lineMat);
          line.userData = { source: proj.id, target: pid };
          scene.add(line);
        }
      });
    });

    objectsRef.current = nodeMeshes;

    let animationId;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 动画逻辑优先级：拖拽 > 聚焦 > 回退 > 自转
      if (isDragging) {
          // 拖拽时不做自动动画
      } else if (isFocusingRef.current && targetQuaternionRef.current) {
          // 聚焦动画
          scene.quaternion.slerp(targetQuaternionRef.current, 0.05);
          if (scene.quaternion.angleTo(targetQuaternionRef.current) < 0.001) {
             // 接近目标后保持微调，不完全关闭以防漂移
          }
      } else if (isReturningRef.current && targetQuaternionRef.current) {
          // 回退动画 (扶正)
          scene.quaternion.slerp(targetQuaternionRef.current, 0.05);
          // 当足够接近正位时，关闭回退状态，允许自转接管
          if (scene.quaternion.angleTo(targetQuaternionRef.current) < 0.01) {
              isReturningRef.current = false;
          }
      } else if (!selectedNodeId) {
         // 闲置自转
         scene.rotation.y += 0.001;
      }

      scene.traverse((obj) => {
         if (obj.isSprite) obj.lookAt(camera.position);
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        if (w === 0 || h === 0) return;
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mountRef.current);

    handleResize();

    const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        isFocusingRef.current = false; 
        isReturningRef.current = false; // 打断回退
        prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - prevMouse.x;
            const dy = e.clientY - prevMouse.y;
            scene.rotation.y += dx * 0.005;
            scene.rotation.x += dy * 0.005;
            prevMouse = { x: e.clientX, y: e.clientY };
        }
        
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
        document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    };
    const onMouseUp = (e: MouseEvent) => {
        isDragging = false;
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
        if (intersects.length > 0) {
            const nodeData = nodeMeshes.find(n => n.mesh === intersects[0].object)?.node;
            if (nodeData) onNodeClick(nodeData);
        }
    };
    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.5;
        camera.position.z = Math.max(100, Math.min(800, camera.position.z));
    };

    const el = mountRef.current;
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        el.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        el.removeEventListener('wheel', onWheel);
        if (el.contains(renderer.domElement)) {
            el.removeChild(renderer.domElement);
        }
        scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                else obj.material.dispose();
            }
        });
        renderer.dispose();
    };
  }, [isThreeLoaded, data]); 

  // 3. 监听选中状态变化，计算目标动画
  useEffect(() => {
     if (!window.THREE || !sceneRef.current) return;
     const THREE = window.THREE;

     // 更新高亮材质 (保持不变)
     objectsRef.current.forEach(({ mesh, node }) => {
        const isSelected = selectedNodeId === node.id;
        let isRelated = false;
        if (selectedNodeId) {
            if (isSelected) isRelated = true;
            else if (selectedNodeId) {
                const sNode = [...data.departments, ...data.projects].find(n => n.id === selectedNodeId);
                if (sNode?.type === 'project' && sNode.participants?.includes(node.id)) isRelated = true;
                if (node.type === 'project' && node.participants?.includes(selectedNodeId)) isRelated = true;
            }
        }
        if (selectedNodeId) {
            if (isRelated) {
                mesh.material.opacity = 1;
                if (mesh.material.emissive) {
                     const colorHex = node.type === 'project' ? 0xffff00 : parseInt(node.color.replace('#', '0x')) || 0x444444;
                     mesh.material.emissive.setHex(colorHex);
                     mesh.material.emissiveIntensity = 0.5;
                }
            } else {
                mesh.material.opacity = 0.1;
                if (mesh.material.emissive) {
                    mesh.material.emissive.setHex(0x000000);
                    mesh.material.emissiveIntensity = 0;
                }
            }
        } else {
            mesh.material.opacity = 0.9;
             if (mesh.material.emissive) {
                mesh.material.emissive.setHex(0x000000);
                mesh.material.emissiveIntensity = 0;
            }
        }
     });
     sceneRef.current.children.forEach((obj) => {
        if (obj.type === 'Line') {
            const d = obj.userData;
            if (selectedNodeId) {
                const active = d.source === selectedNodeId || d.target === selectedNodeId;
                obj.material.opacity = active ? 0.8 : 0.05;
                obj.material.color.setHex(active ? 0x60A5FA : 0x334155);
            } else {
                obj.material.opacity = 0.15;
                obj.material.color.setHex(0x334155);
            }
        }
     });

     // --- 动画逻辑核心 ---
     if (selectedNodeId) {
        // 1. 聚焦模式：计算目标点，旋转至正对屏幕
        const targetLocalPos = nodePositionsRef.current.get(selectedNodeId);
        if (targetLocalPos) {
            const currentQuat = sceneRef.current.quaternion.clone();
            const currentWorldPos = targetLocalPos.clone().applyQuaternion(currentQuat).normalize();
            const targetDir = new THREE.Vector3(0, 0, 1); // 相机在 +Z
            const rotateQuat = new THREE.Quaternion().setFromUnitVectors(currentWorldPos, targetDir);
            const finalQuat = rotateQuat.multiply(currentQuat);
            
            targetQuaternionRef.current = finalQuat;
            isFocusingRef.current = true;
            isReturningRef.current = false;
        }
     } else {
        // 2. 回退模式：selectedNodeId 变为 null 时触发
        // 我们希望恢复到“正立”状态 (X轴和Z轴旋转归零，保留Y轴朝向)
        if (isFocusingRef.current) { // 只有之前是聚焦状态才触发回退，防止初始化时乱动
            isFocusingRef.current = false;
            isReturningRef.current = true;

            const currentQuat = sceneRef.current.quaternion.clone();
            const currentEuler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');
            // 目标：保留 Y 轴旋转，X/Z 轴归零
            const targetEuler = new THREE.Euler(0, currentEuler.y, 0, 'YXZ'); 
            targetQuaternionRef.current = new THREE.Quaternion().setFromEuler(targetEuler);
        } else {
            isReturningRef.current = false;
        }
     }

  }, [selectedNodeId]);

  if (!isThreeLoaded) {
      return <div className="w-full h-full flex items-center justify-center text-blue-400 gap-2"><Loader2 className="animate-spin" /> 加载星图引擎...</div>;
  }

  return <div ref={mountRef} className="w-full h-full cursor-move" />;
};


// --- 主界面组件 ---

export default function KnowledgeGraph3D() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [introMode, setIntroMode] = useState(true);
  const [isProjectListOpen, setIsProjectListOpen] = useState(true);

  const selectedNode = useMemo(() => {
    return [...BASE_DEPARTMENTS, ...PROJECTS_DATA].find(n => n.id === selectedNodeId);
  }, [selectedNodeId]);

  // 当切换节点时，重置选中的里程碑
  useEffect(() => {
    setSelectedMilestoneId(null);
  }, [selectedNodeId]);

  const handleNodeClick = (node: NodeData) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    setIntroMode(false);
  };

  // 过滤显示的文档
  const displayedDocs = useMemo(() => {
    if (!selectedNode?.docs) return [];
    if (!selectedMilestoneId) return selectedNode.docs;
    return selectedNode.docs.filter(d => d.milestoneId === selectedMilestoneId);
  }, [selectedNode, selectedMilestoneId]);

  // 获取当前选中的里程碑名称
  const activeMilestoneLabel = useMemo(() => {
      if(!selectedMilestoneId || !selectedNode?.milestones) return null;
      return selectedNode.milestones.find(m => m.id === selectedMilestoneId)?.label;
  }, [selectedMilestoneId, selectedNode]);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 3D 容器区域 */}
      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        
        {/* 背景星光装饰 */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
        </div>

        {/* 顶部标题 */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-400 drop-shadow-lg">
            <Move3d className="w-8 h-8" />
            实业公司数据星图demo <span className="text-slate-500 text-base font-normal tracking-wider">| UNIVERSE EDITION</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md">
            拖拽旋转视角 • 滚轮缩放 • 点击节点查看详情
          </p>
        </div>
        
        {/* 左侧项目列表 (可折叠，高度铺满) */}
        <div 
          className={`absolute left-6 w-64 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col
            ${isProjectListOpen ? 'top-24 h-[calc(100vh-6.5rem)]' : 'top-24 h-[52px]'}`}
        >
          <div 
            className="p-3 bg-slate-900/90 flex items-center justify-between cursor-pointer border-b border-transparent hover:bg-slate-800/50 transition-colors shrink-0"
            onClick={() => setIsProjectListOpen(!isProjectListOpen)}
          >
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <List size={16} className="text-blue-400"/> 项目总览 ({PROJECTS_DATA.length})
            </h3>
            {isProjectListOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </div>
          
          {/* List content - flex-1 ensures it takes all available height */}
          <div className="overflow-y-auto p-4 pt-0 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent flex-1 mt-2">
            {PROJECTS_DATA.map(proj => (
              <div 
                key={proj.id}
                onClick={() => {
                   setSelectedNodeId(proj.id);
                   setIntroMode(false);
                }}
                className={`p-3 rounded border transition-all cursor-pointer group
                  ${selectedNodeId === proj.id 
                    ? 'bg-blue-900/40 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-medium leading-tight line-clamp-2 ${selectedNodeId === proj.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {proj.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ml-2 whitespace-nowrap ${
                     proj.status === 'delayed' ? 'bg-red-500/20 text-red-300' :
                     proj.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                     'bg-blue-500/20 text-blue-300'
                  }`}>
                    {proj.progress}%
                  </span>
                </div>
                
                {/* Mini Progress Bar */}
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${
                        proj.status === 'delayed' ? 'bg-red-500' : 
                        proj.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                     }`}
                     style={{ width: `${proj.progress}%` }}
                   />
                </div>
              </div>
            ))}
            
            {/* 底部装饰，防止列表内容紧贴底部 */}
            <div className="h-4"></div>
          </div>
        </div>

        {/* 3D Scene */}
        <ThreeGraph 
            onNodeClick={handleNodeClick} 
            selectedNodeId={selectedNodeId}
            data={{ departments: BASE_DEPARTMENTS, projects: PROJECTS_DATA }}
        />

        {/* 引导文字 */}
        {introMode && !selectedNodeId && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center pointer-events-none opacity-80 animate-bounce">
                <p className="text-blue-200">点击任意节点查看关联数据</p>
            </div>
        )}
      </div>

      {/* 右侧详情面板 */}
      <div 
        className={`w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-700 shadow-2xl transition-transform duration-300 ease-out transform flex flex-col absolute right-0 top-0 bottom-0 z-20 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedNode ? (
          <>
            <div className="p-6 border-b border-slate-700 bg-slate-800/50">
              <div className="flex justify-between items-start">
                <div>
                  <div className={`text-xs uppercase font-bold tracking-wider mb-1 ${selectedNode.type === 'project' ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {selectedNode.type === 'project' ? 'PROJECT' : selectedNode.type === 'subsidiary' ? 'SUBSIDIARY' : 'DEPARTMENT'}
                  </div>
                  <h2 className="text-xl font-bold text-white leading-tight">{selectedNode.label}</h2>
                </div>
                <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 部门视图 */}
              {selectedNode.type !== 'project' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Activity size={16} /> 业务概况
                    </h3>
                    <p className="text-sm text-slate-400">
                      该节点共有 <strong className="text-white mx-1">
                          {PROJECTS_DATA.filter(p => p.participants?.includes(selectedNode.id)).length}
                      </strong> 个正在进行的协同项目。
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3">关联项目列表</h3>
                    <div className="space-y-2">
                       {PROJECTS_DATA
                        .filter(p => p.participants?.includes(selectedNode.id))
                        .map(proj => (
                            <div 
                              key={proj.id} 
                              onClick={() => setSelectedNodeId(proj.id)}
                              className="bg-slate-800 hover:bg-slate-700 p-3 rounded border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <span className="text-sm text-slate-200">{proj.label}</span>
                              <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-400" />
                            </div>
                          ))
                        }
                    </div>
                  </div>
                </div>
              )}

              {/* 项目视图 */}
              {selectedNode.type === 'project' && (
                <div className="space-y-6">
                  {/* 进度 - 带里程碑 */}
                  <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-slate-300 flex items-center gap-2">
                        <Flag size={14} className="text-blue-400" /> 项目进度
                      </span>
                      <span className={`text-sm font-bold ${
                        selectedNode.status === 'delayed' ? 'text-red-400' : 
                        selectedNode.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'
                      }`}>
                        {selectedNode.progress}%
                      </span>
                    </div>

                    {/* 进度条轨道 */}
                    <div className="relative w-full h-8 mb-4 flex items-center">
                        {/* 背景槽 */}
                        <div className="absolute w-full h-2 bg-slate-700 rounded-full"></div>
                        {/* 进度填充 */}
                        <div 
                           className={`absolute h-2 rounded-full ${
                            selectedNode.status === 'delayed' ? 'bg-red-500' : 
                            selectedNode.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                           }`}
                           style={{ width: `${selectedNode.progress}%` }}
                        ></div>

                        {/* 里程碑节点 */}
                        {selectedNode.milestones?.map((m) => {
                            const isPassed = (selectedNode.progress || 0) >= m.position;
                            const isActive = selectedMilestoneId === m.id;
                            return (
                                <div 
                                  key={m.id}
                                  onClick={() => setSelectedMilestoneId(isActive ? null : m.id)}
                                  className={`absolute w-4 h-4 rounded-full border-2 cursor-pointer transition-all transform hover:scale-125 group z-10
                                    ${isActive ? 'bg-white border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 
                                      isPassed ? 'bg-blue-500 border-slate-900' : 'bg-slate-600 border-slate-900'}
                                  `}
                                  style={{ left: `${m.position}%`, marginLeft: '-6px' }}
                                >
                                    {/* Tooltip */}
                                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded whitespace-nowrap border border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isActive ? 'opacity-100' : ''}`}>
                                        {m.label}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-600"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-700 pt-3">
                      {selectedNode.description}
                    </div>
                  </div>

                  {/* 参与部门 */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Users size={16} /> 协同部门
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.participants?.map(pid => {
                          const dept = BASE_DEPARTMENTS.find(d => d.id === pid);
                          return dept ? (
                            <span 
                              key={dept.id} 
                              onClick={() => setSelectedNodeId(dept.id)}
                              className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-xs text-slate-300 hover:text-white hover:border-slate-400 cursor-pointer transition-colors flex items-center gap-2"
                              style={{ borderLeftColor: dept.color, borderLeftWidth: 3 }}
                            >
                               {dept.label}
                            </span>
                          ) : null;
                        })
                      }
                    </div>
                  </div>

                  {/* 知识文档 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Database size={16} /> 项目相关
                        </h3>
                        {/* 过滤指示器 */}
                        {activeMilestoneLabel ? (
                            <span 
                              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-blue-500/30"
                              onClick={() => setSelectedMilestoneId(null)}
                            >
                                <Filter size={10} /> 
                                {activeMilestoneLabel} 
                                <X size={10} />
                            </span>
                        ) : (
                            <span className="text-xs text-slate-600">显示全部文件</span>
                        )}
                    </div>

                    <div className="space-y-2 min-h-[100px]">
                      {displayedDocs?.length === 0 ? (
                          <div className="text-center text-slate-500 text-xs py-4 border border-dashed border-slate-700 rounded">
                              该阶段暂无沉淀文档
                          </div>
                      ) : (
                          displayedDocs?.map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/80 transition-colors cursor-pointer group border border-transparent hover:border-slate-600">
                            <div className="mt-1">
                                {doc.type.includes('会议') ? <Calendar size={16} className="text-amber-400" /> : <FileText size={16} className="text-blue-400" />}
                            </div>
                            <div>
                                <div className="text-sm text-slate-200 group-hover:text-blue-300 transition-colors">{doc.title}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="bg-slate-700 px-1 rounded text-slate-300 scale-90 origin-left">{doc.type}</span>
                                <span>{doc.date}</span>
                                </div>
                            </div>
                            </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}