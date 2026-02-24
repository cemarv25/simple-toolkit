import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type RoomPreset = 'square' | 'rectangle' | 'l-shape';

type FurnitureObject = {
    id: string;
    mesh: THREE.Mesh;
    dimensions: { width: number, height: number, depth: number };
    color: number;
}

export function render(container: HTMLElement) {
    container.innerHTML = `
    <div class="will-it-fit-tool">
        <div class="tool-header">
            <h2>Will it Fit? - Room Builder</h2>
            <p>Visualize furniture placement and check for collisions in 3D.</p>
        </div>
        
        <div class="tool-layout">
            <div class="sidebar glass">
                <div class="control-group">
                    <h3>Room Setup</h3>
                    <label for="room-preset">Preset Shape</label>
                    <select id="room-preset">
                        <option value="square">Square</option>
                        <option value="rectangle" selected>Rectangle</option>
                        <option value="l-shape">L-Shape</option>
                    </select>
                    
                    <div id="room-dimensions-controls">
                        <div class="input-row room-dimensions-row">
                            <div class="input-item">
                                <label for="room-width">Width (m)</label>
                                <input type="number" id="room-width" value="5" step="0.1" min="1">
                            </div>
                            <div class="input-item">
                                <label for="room-depth">Depth (m)</label>
                                <input type="number" id="room-depth" value="4" step="0.1" min="1">
                            </div>
                        </div>
                        <div class="input-row">
                            <div class="input-item">
                                <label for="room-height">Height (m)</label>
                                <input type="number" id="room-height" value="2.5" step="0.1" min="1">
                            </div>
                        </div>
                        <div id="l-shape-extra" class="hidden">
                            <div class="input-row">
                                <div class="input-item">
                                    <label for="room-l-width">L-Inner Width</label>
                                    <input type="number" id="room-l-width" value="2" step="0.1" min="0.5">
                                </div>
                                <div class="input-item">
                                    <label for="room-l-depth">L-Inner Depth</label>
                                    <input type="number" id="room-l-depth" value="2" step="0.1" min="0.5">
                                </div>
                            </div>
                        </div>
                    </div>
                    <button id="update-room" class="secondary-btn">Update Room</button>
                </div>

                <div class="control-group">
                    <h3>Add Furniture</h3>
                    <div class="furniture-presets">
                        <button class="preset-btn" data-type="cube">Cube (1m³)</button>
                        <button class="preset-btn" data-type="bed">Bed (2x1.6m)</button>
                        <button class="preset-btn" data-type="desk">Desk (1.4x0.7m)</button>
                    </div>
                    <div class="advanced-add">
                        <h4>Custom Object</h4>
                        <div class="input-row">
                            <div class="input-item">
                                <label for="f-w">Width (m)</label>
                                <input type="number" id="f-w" placeholder="Width" step="0.1" min="0.1" value="1">
                            </div>
                        </div>
                        <div class="input-row">
                            <div class="input-item">
                                <label for="f-d">Depth (m)</label>
                                <input type="number" id="f-d" placeholder="Depth" step="0.1" min="0.1" value="1">
                            </div>
                        </div>
                        <div class="input-row">
                            <div class="input-item">
                                <label for="f-h">Height (m)</label>
                                <input type="number" id="f-h" placeholder="Height" step="0.1" min="0.1" value="0.5">
                            </div>
                        </div>
                        <button id="add-custom" class="primary-btn">Add Custom</button>
                    </div>
                </div>
            </div>
            
            <div class="canvas-container glass" id="three-container">
                <div class="canvas-overlay">
                    <p>Left Click: Rotate | Right Click: Pan | Scroll: Zoom</p>
                    <p>Click & Drag objects to move them</p>
                </div>
                <div id="selected-info" class="selected-info-panel hidden collapsed">
                    <div class="selected-info-header">
                        <h3>Selected Object</h3>
                        <button id="selected-info-toggle" class="selected-info-toggle" aria-label="Toggle selected object details">+</button>
                    </div>
                    <div class="selected-info-body">
                        <p id="obj-name">Furniture #1</p>
                        <div class="input-row">
                            <label for="obj-rotate">Rotation</label>
                            <input type="range" id="obj-rotate" min="0" max="360" value="0">
                        </div>
                        <button id="delete-obj" class="danger-btn">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .will-it-fit-tool {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            height: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }
        .tool-header {
            text-align: center;
        }
        .tool-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 1.5rem;
            height: 600px;
        }
        .sidebar {
            padding: 1.5rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            border-radius: 12px;
        }
        .canvas-container {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            background: #1a1a2e;
            border: 1px solid var(--glass-border);
        }
        .canvas-overlay {
            position: absolute;
            bottom: 10px;
            left: 10px;
            pointer-events: none;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            background: rgba(0, 0, 0, 0.3);
            padding: 5px 10px;
            border-radius: 4px;
        }
        .selected-info-panel {
            position: absolute;
            top: 10px;
            right: 10px;
            min-width: 220px;
            max-width: 280px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            backdrop-filter: blur(8px);
            border: 1px solid var(--glass-border);
        }
        .selected-info-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
        }
        .selected-info-header h3 {
            font-size: 0.9rem;
            margin: 0;
            color: var(--accent-color);
        }
        .selected-info-toggle {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--glass-border);
            color: white;
            border-radius: 999px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 0.8rem;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        .selected-info-body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.25rem;
        }
        .selected-info-panel.collapsed .selected-info-body {
            display: none;
        }
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--glass-border);
        }
        .control-group:last-child {
            border-bottom: none;
        }
        .control-group h3 {
            font-size: 1rem;
            margin: 0;
            color: var(--accent-color);
        }
        .control-group h4 {
            font-size: 0.9rem;
            margin: 0;
            opacity: 0.8;
        }
        .input-row {
            display: flex;
            gap: 10px;
        }
        .room-dimensions-row .input-item {
            flex: 0 0 calc(50% - 5px);
            max-width: calc(50% - 5px);
        }
        .input-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        label {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
        input[type="number"], select {
            padding: 6px 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: white;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        .furniture-presets {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .preset-btn {
            padding: 8px;
            font-size: 0.8rem;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--glass-border);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .preset-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        .primary-btn {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            border: none;
            color: white;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        .secondary-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--glass-border);
            color: white;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
        }
        .danger-btn {
            background: rgba(255, 77, 77, 0.2);
            border: 1px solid #ff4d4d;
            color: #ff4d4d;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
        }
        .hidden { display: none; }

        @media (max-width: 768px) {
            .tool-layout {
                grid-template-columns: 1fr;
                height: auto;
            }
            .sidebar {
                order: 2;
            }
            .canvas-container {
                height: 400px;
                order: 1;
            }
        }
    </style>
    `;

    // --- Three.js Logic ---
    const container3d = document.getElementById('three-container')!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(75, container3d.clientWidth / container3d.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container3d.clientWidth, container3d.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container3d.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Helpers
    const gridHelper = new THREE.GridHelper(20, 20, 0x4facfe, 0x333333);
    scene.add(gridHelper);

    // Room State
    let roomGroup = new THREE.Group();
    scene.add(roomGroup);

    let furniture: FurnitureObject[] = [];
    let selectedObject: FurnitureObject | null = null;

    // Dragging State
    let isDragging = false;
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const offset = new THREE.Vector3();
    const intersection = new THREE.Vector3();

    function updateRoom() {
        roomGroup.clear();

        const preset = (document.getElementById('room-preset') as HTMLSelectElement).value as RoomPreset;
        const w = parseFloat((document.getElementById('room-width') as HTMLInputElement).value);
        const d = parseFloat((document.getElementById('room-depth') as HTMLInputElement).value);
        const h = parseFloat((document.getElementById('room-height') as HTMLInputElement).value);

        const material = new THREE.MeshPhongMaterial({
            color: 0x4facfe,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            wireframe: false
        });

        const wallMaterial = new THREE.MeshPhongMaterial({
            color: 0x4facfe,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });

        if (preset === 'square' || preset === 'rectangle') {
            // Floor
            const floorGeo = new THREE.PlaneGeometry(w, d);
            const floor = new THREE.Mesh(floorGeo, material);
            floor.rotation.x = -Math.PI / 2;
            roomGroup.add(floor);

            // Walls (simplified)
            const boxGeo = new THREE.BoxGeometry(w, h, d);
            const walls = new THREE.Mesh(boxGeo, wallMaterial);
            walls.position.y = h / 2;
            roomGroup.add(walls);
        } else if (preset === 'l-shape') {
            const lw = parseFloat((document.getElementById('room-l-width') as HTMLInputElement).value);
            const ld = parseFloat((document.getElementById('room-l-depth') as HTMLInputElement).value);

            // L-shape floor using Shape
            const shape = new THREE.Shape();
            shape.moveTo(-w / 2, -d / 2);
            shape.lineTo(w / 2, -d / 2);
            shape.lineTo(w / 2, d / 2 - ld);
            shape.lineTo(w / 2 - lw, d / 2 - ld);
            shape.lineTo(w / 2 - lw, d / 2);
            shape.lineTo(-w / 2, d / 2);
            shape.lineTo(-w / 2, -d / 2);

            const floorGeo = new THREE.ShapeGeometry(shape);
            const floor = new THREE.Mesh(floorGeo, material);
            floor.rotation.x = -Math.PI / 2;
            roomGroup.add(floor);

            // Walls (Extrude)
            const extrudeSettings = { depth: h, bevelEnabled: false };
            const wallGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const walls = new THREE.Mesh(wallGeo, wallMaterial);
            walls.rotation.x = -Math.PI / 2;
            walls.position.y = h;
            roomGroup.add(walls);
        }

        checkCollisions();
    }

    function addFurniture(width: number, depth: number, height: number, color = 0x00f2fe) {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshPhongMaterial({ color });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.y = height / 2;
        scene.add(mesh);

        const obj: FurnitureObject = {
            id: 'f-' + Math.random().toString(36).substr(2, 9),
            mesh,
            dimensions: { width, height, depth },
            color
        };
        furniture.push(obj);
        selectObject(obj);
        checkCollisions();
    }

    function selectObject(obj: FurnitureObject | null) {
        if (selectedObject) {
            (selectedObject.mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
        }
        selectedObject = obj;
        const info = document.getElementById('selected-info')!;
        if (obj) {
            info.classList.remove('hidden');
            document.getElementById('obj-name')!.textContent = `Object (${obj.dimensions.width}x${obj.dimensions.depth}m)`;
            (obj.mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0x333333);
            (document.getElementById('obj-rotate') as HTMLInputElement).value = (obj.mesh.rotation.y * 180 / Math.PI).toString();
        } else {
            info.classList.add('hidden');
        }
    }

    function checkCollisions() {
        // Simple AABB vs Room bounds (very basic for now)
        const preset = (document.getElementById('room-preset') as HTMLSelectElement).value as RoomPreset;
        const w = parseFloat((document.getElementById('room-width') as HTMLInputElement).value);
        const d = parseFloat((document.getElementById('room-depth') as HTMLInputElement).value);

        furniture.forEach(obj => {
            const mesh = obj.mesh;
            const mat = mesh.material as THREE.MeshPhongMaterial;

            // Check if within bounds (simplified for square/rect)
            let isOutside = false;

            if (preset !== 'l-shape') {
                const halfW = w / 2;
                const halfD = d / 2;
                const bounds = new THREE.Box3().setFromObject(mesh);

                if (bounds.min.x < -halfW || bounds.max.x > halfW ||
                    bounds.min.z < -halfD || bounds.max.z > halfD) {
                    isOutside = true;
                }
            } else {
                // For L-shape, we'd need more complex point-in-polygon or sub-boxes
                // For now, just basic rect bounds of the main area
                isOutside = false;
            }

            // Check overlap with other furniture
            let isOverlapping = false;
            furniture.forEach(other => {
                if (obj.id === other.id) return;
                const box1 = new THREE.Box3().setFromObject(mesh);
                const box2 = new THREE.Box3().setFromObject(other.mesh);
                if (box1.intersectsBox(box2)) {
                    isOverlapping = true;
                }
            });

            if (isOutside || isOverlapping) {
                mat.color.setHex(0xff4d4d);
            } else {
                mat.color.setHex(obj.color);
            }
        });
    }

    // --- Interaction ---
    function handleDragStart(clientX: number, clientY: number) {
        const rect = container3d.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / container3d.clientWidth) * 2 - 1;
        mouse.y = -((clientY - rect.top) / container3d.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(furniture.map(f => f.mesh));

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object as THREE.Mesh;
            const obj = furniture.find(f => f.mesh === hitMesh);
            if (obj) {
                selectObject(obj);
                isDragging = true;
                controls.enabled = false;

                if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
                    offset.copy(intersection).sub(hitMesh.position);
                }
            }
        } else {
            selectObject(null);
        }
    }

    function handleDragMove(clientX: number, clientY: number) {
        if (!isDragging || !selectedObject) return;

        const rect = container3d.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / container3d.clientWidth) * 2 - 1;
        mouse.y = -((clientY - rect.top) / container3d.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            selectedObject.mesh.position.copy(intersection.sub(offset));
            selectedObject.mesh.position.y = selectedObject.dimensions.height / 2; // Keep on floor
            checkCollisions();
        }
    }

    function endDrag() {
        isDragging = false;
        controls.enabled = true;
    }

    function onMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (target && target.closest('#selected-info')) {
            // Interactions with the selected object overlay should not affect selection
            return;
        }
        handleDragStart(event.clientX, event.clientY);
    }

    function onMouseMove(event: MouseEvent) {
        handleDragMove(event.clientX, event.clientY);
    }

    function onMouseUp() {
        endDrag();
    }

    function onTouchStart(event: TouchEvent) {
        const target = event.target as HTMLElement | null;
        if (target && target.closest('#selected-info')) {
            // Interactions with the selected object overlay should not affect selection
            return;
        }
        if (event.touches.length !== 1) return;
        event.preventDefault();
        const touch = event.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    }

    function onTouchMove(event: TouchEvent) {
        if (!isDragging || !selectedObject) return;
        if (event.touches.length !== 1) return;
        event.preventDefault();
        const touch = event.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    }

    function onTouchEnd() {
        if (!isDragging) return;
        endDrag();
    }

    // --- Event Listeners ---
    document.getElementById('update-room')!.addEventListener('click', updateRoom);
    document.getElementById('room-preset')!.addEventListener('change', (e) => {
        const val = (e.target as HTMLSelectElement).value;
        const extra = document.getElementById('l-shape-extra')!;
        if (val === 'l-shape') extra.classList.remove('hidden');
        else extra.classList.add('hidden');
        updateRoom();
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            if (type === 'cube') addFurniture(1, 1, 1, 0x00f2fe);
            else if (type === 'bed') addFurniture(1.6, 2, 0.4, 0x8e44ad);
            else if (type === 'desk') addFurniture(1.4, 0.7, 0.75, 0xd35400);
        });
    });

    document.getElementById('add-custom')!.addEventListener('click', () => {
        const w = parseFloat((document.getElementById('f-w') as HTMLInputElement).value);
        const d = parseFloat((document.getElementById('f-d') as HTMLInputElement).value);
        const h = parseFloat((document.getElementById('f-h') as HTMLInputElement).value);
        addFurniture(w, d, h);
    });

    document.getElementById('obj-rotate')!.addEventListener('input', (e) => {
        if (selectedObject) {
            const degrees = parseFloat((e.target as HTMLInputElement).value);
            selectedObject.mesh.rotation.y = degrees * Math.PI / 180;
            checkCollisions();
        }
    });

    const selectedInfoToggle = document.getElementById('selected-info-toggle');
    if (selectedInfoToggle) {
        selectedInfoToggle.addEventListener('click', () => {
            const panel = document.getElementById('selected-info');
            if (!panel) return;
            panel.classList.toggle('collapsed');
            const btn = selectedInfoToggle as HTMLButtonElement;
            const isCollapsed = panel.classList.contains('collapsed');
            btn.textContent = isCollapsed ? '+' : '−';
        });
    }

    document.getElementById('delete-obj')!.addEventListener('click', () => {
        if (selectedObject) {
            scene.remove(selectedObject.mesh);
            furniture = furniture.filter(f => f.id !== selectedObject!.id);
            selectObject(null);
            checkCollisions();
        }
    });

    container3d.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container3d.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // Initial Resize & Animation
    window.addEventListener('resize', () => {
        const w = container3d.clientWidth;
        const h = container3d.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
    updateRoom();
}
