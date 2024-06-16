import Camera from "./Camera";

class OrbitControls {
    private camera: Camera;
    private canvas: HTMLCanvasElement | undefined;
    private isDragging: boolean;
    private lastMousePosition: { x: number; y: number };
    private rotationSpeed: number;
    private minZoom: number;
    private maxZoom: number;

    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;
        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.rotationSpeed = 0.25;
        this.minZoom = 0; // Minimum zoom value
        this.maxZoom = 360; // Maximum zoom value
    
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseleave', this.onMouseUp);
        this.canvas.addEventListener('wheel', this.onMouseWheel);
    }
  
    onMouseDown = (event: MouseEvent) => {
      this.isDragging = true;
      this.lastMousePosition = { x: event.clientX, y: event.clientY };

    };
  
    onMouseMove = (event: MouseEvent) => {
      if (!this.isDragging) return;
  
      const deltaY = event.clientX - this.lastMousePosition.x;
      const deltaX = event.clientY - this.lastMousePosition.y;
      this.camera.rotateX(deltaX*this.rotationSpeed);
      this.camera.rotateY(deltaY*this.rotationSpeed);  
      this.lastMousePosition = { x: event.clientX, y: event.clientY };
    };
  
    onMouseUp = () => {
      this.isDragging = false;
    };
    onMouseWheel = (event: WheelEvent) => {
      // Calculate new zoom value based on the scroll direction
      const zoomDirection = event.deltaY > 0 ? 1 : -1;
      let newZoom = this.camera.radius + zoomDirection * 0.5; // Change zoom by 10 units per scroll step

      // Clamp the zoom value between minZoom and maxZoom
      newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));

      // Set the new zoom value
      this.camera.zoom(newZoom);
    };
  
    dispose() {
        if (!this.canvas) return;
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mouseleave', this.onMouseUp);
      }
    }

export default OrbitControls;
