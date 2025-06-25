const r = require('raylib')


const fs = require('fs');
var obj = JSON.parse(fs.readFileSync('../src/data/hierarchy.json', 'utf8'));

const screenWidth = 1280
const screenHeight = 720

const camera = { a:0 }
camera.position = { x:10.0, y:10.0, z:10.0 }; // Camera position
camera.target = { x:0.0, y:0.0, z:0.0 };      // Camera looking at point
camera.up = { x:0.0, y:1.0, z:0.0 };          // Camera up vector (rotation towards target)
camera.fovy = 45.0;                                // Camera field-of-view Y
camera.projection = r.CAMERA_PERSPECTIVE; 

cubePosition = { x:0.0, y:0.0, z:0.0 };

function useFibonacciSpherePoints(n, radius) {

		const points = [];
		const goldenRatio = (1 + Math.sqrt(5)) / 2;
		const angleIncrement = 2 * Math.PI * goldenRatio;

		for (let i = 0; i < n; i++) {
			const t = i / n;
			const inclination = Math.acos(1 - 2 * t);
			const azimuth = angleIncrement * i;

			const x = radius * Math.sin(inclination) * Math.cos(azimuth);
			const y = radius * Math.sin(inclination) * Math.sin(azimuth);
			const z = radius * Math.cos(inclination);

			points.push({x:x, y:y, z:z});
		}

		return points;

}

r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window")
r.SetTargetFPS(60)
const nodes = []
const nodesYear = {};
function updateCustomCamera(cam) {
	const speed = 0.3;
	const rotSpeed = 0.003;
	const wheelZoomSpeed = 2.0;

	// Movement keys
	if (r.IsKeyDown(r.KEY_W)) r.CameraMoveForward(cam, speed, true);
	if (r.IsKeyDown(r.KEY_S)) r.CameraMoveForward(cam, -speed, true);
	if (r.IsKeyDown(r.KEY_A)) r.CameraMoveRight(cam, -speed, true);
	if (r.IsKeyDown(r.KEY_D)) r.CameraMoveRight(cam, speed, true);
	if (r.IsKeyDown(r.KEY_Q)) r.CameraMoveUp(cam, -speed);
	if (r.IsKeyDown(r.KEY_E)) r.CameraMoveUp(cam, speed);

	// Mouse look (when right-click held)
	if (r.IsMouseButtonDown(r.MOUSE_RIGHT_BUTTON)) {
		const delta = r.GetMouseDelta();
		r.CameraYaw(cam, -delta.x * rotSpeed, true);
		r.CameraPitch(cam, -delta.y * rotSpeed, true, true, false);
	}

	// Zoom with scroll wheel
	const scroll = r.GetMouseWheelMove();
	if (scroll !== 0) {
		r.CameraMoveForward(cam, scroll * wheelZoomSpeed, true);
	}
}
function getData(data, deep=0, parent = null)
{
	return data.map((node, i) => {
		const child = {
			id: node.id,
			species: node.species,
			genotype: node.genotype,
			year: node.year,
			parent: parent,
			children: [],
			position: {x:0, y:0, z: 0},
			size: {x: 1, y: 1, z: 1},
			boundingBox: {}
		}
		const year = child.year ?? 0;
		if (nodesYear[year])
		{
			nodesYear[year].push(child);
		}
		else
		{
			nodesYear[year] = [];
			nodesYear[year].push(child)
		}

		child.children = getData(node.children, deep + 1,  child);
		nodes.push(child);
		return child;
	})
}

const dat = getData(obj);
console.log(nodes.length);
function boundingBox(pos, size)
{
	return {
		min: { 
			x: pos.x - size.x/2,
			y: pos.y - size.y/2, 
			z: pos.z - size.z/2 },
		max: {
			x: pos.x + size.x/2,
			y: pos.y + size.y/2,
			z: pos.z + size.z/2 }}
}
function setPosition(){
	Object.keys(nodesYear).sort().map((nodeYears, u)=>{
		console.log(nodeYears)
		const points = useFibonacciSpherePoints(nodesYear[nodeYears].length, u * 6)
		nodesYear[nodeYears].forEach((a, i)=>{a.position = points[i];
			a.boundingBox = boundingBox(a.position, a.size) ;
		});
	})
}

setPosition();
function itIsMyAncestor(node, selected)
{
	if (!node.parent || !selected) return false;
	return node.parent === selected || itIsMyAncestor(node.parent, selected);
}

function itIsMyHeritage(node, selected)
{
	if (!node.children || !selected) return false;
	return node.children.some((n)=> n === selected || itIsMyHeritage(n, selected))
}

selectedNode = {};
 ray = {  };                    // Picking line ray
collision = { };
function gameLoop(){
while (!r.WindowShouldClose()) {

	// if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_RIGHT)) {
	// 	r.DisableCursor();
	// }


	r.UpdateCamera(camera, r.CAMERA_FREE);

	if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT))
	{
		collision.hit = false; selectedNode = null
		{
			ray = r.GetMouseRay(r.GetMousePosition(), camera);
				
			// Check collision between ray and box
			nodes.forEach((a)=>{
				collision = r.GetRayCollisionBox(ray, a.boundingBox);
				if (collision.hit)
				{
					selectedNode = a;
				}
			})
		}
	}

	//updateCustomCamera(camera);
    r.BeginDrawing();
		r.ClearBackground(r.RAYWHITE)
		r.BeginMode3D(camera);
		Object.keys(nodesYear).forEach((dd, u)=>{
		//	r.DrawSphere({x:0, y:0, z:0}, u * 6, { r: 130, g: 130, b: 130, a: 0 });
		})

		nodes.forEach((a)=>{
			if (a.parent)
			{
				const ancestor = itIsMyAncestor(a, selectedNode);
				const color = ancestor ? r.PINK : r.BLUE;
				const size = ancestor ? 0.1 : 0.01;
			/*	if (selectedNode && ancestor)
					r.DrawCylinderEx(a.position, a.parent.position, size, size, 10, color);
				else if (!selectedNode)*/
					r.DrawCylinderEx(a.position, a.parent.position, size, size, 10, color);
			}

			if (selectedNode)
			{
				const heritage = itIsMyHeritage(a, selectedNode)
				const color = heritage ? r.YELLOW : r.GREEN;
				const size = heritage ? 0.1 : 0.01;
				if (heritage)
					{
					a.children.forEach((d)=>{
						r.DrawCylinderEx(a.position, d.position, size, size, 10, color);
					}
					
					);
				}
				
			}

			r.DrawCube(a.position, 1.0, 1.0, 1.0, a === selectedNode ? r.PINK : r.RED);
			r.DrawCubeWires(a.position, 1.0, 1.0, 1.0, r.MAROON);
		})

		r.DrawGrid(10, 1.0);
		r.EndMode3D();
		r.DrawText("Congrats! You created your first node-raylib window!", 120, 200, 20, r.LIGHTGRAY)
    r.EndDrawing()
}
r.CloseWindow()
}

gameLoop();