class CropManager {
  constructor(imageManager) {
    this.imageManager = imageManager;
    this.isCropping = false;
    this.cropStart = { x: 0, y: 0 };
    this.cropEnd = { x: 0, y: 0 };
    this.isDragging = false;
    this.isResizing = false;
    this.activeHandle = null;
    this.dragOffset = { x: 0, y: 0 };
    this.setupCropControls();
  }

  setupCropControls() {
    const cropOverlay = document.getElementById('cropOverlay');
    const cropArea = cropOverlay.querySelector('.crop-area');
    const canvas = this.imageManager.canvas;

    document.getElementById('cropBtn').addEventListener('click', () => {
      this.startCropping();
    });

    document.getElementById('cancelCrop').addEventListener('click', () => {
      this.endCropping();
    });

    document.getElementById('applyCrop').addEventListener('click', () => {
      this.applyCrop();
      this.endCropping();
    });

    cropOverlay.addEventListener('mousedown', (e) => {
      if (!this.isCropping) return;

      const handle = e.target.closest('.resize-handle');
      const rect = canvas.getBoundingClientRect();

      if (handle) {
        this.startResizing(handle, e, rect);
      } else if (e.target === cropArea) {
        this.startDragging(e, rect);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isResizing) {
        this.resize(e, canvas.getBoundingClientRect());
      } else if (this.isDragging) {
        this.drag(e, canvas.getBoundingClientRect());
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isResizing = false;
      this.activeHandle = null;
    });

    // Touch events
    this.setupTouchEvents(cropOverlay, cropArea, canvas);
  }

  setupTouchEvents(cropOverlay, cropArea, canvas) {
    cropOverlay.addEventListener('touchstart', (e) => {
      if (!this.isCropping) return;

      const touch = e.touches[0];
      const handle = e.target.closest('.resize-handle');
      const rect = canvas.getBoundingClientRect();

      if (handle) {
        this.startResizing(handle, touch, rect);
      } else if (e.target === cropArea) {
        this.startDragging(touch, rect);
      }
      e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.isCropping) return;

      const touch = e.touches[0];
      if (this.isResizing) {
        this.resize(touch, canvas.getBoundingClientRect());
      } else if (this.isDragging) {
        this.drag(touch, canvas.getBoundingClientRect());
      }
      e.preventDefault();
    });

    document.addEventListener('touchend', () => {
      this.isDragging = false;
      this.isResizing = false;
      this.activeHandle = null;
    });
  }

  startCropping() {
    this.isCropping = true;
    const cropOverlay = document.getElementById('cropOverlay');
    const cropArea = cropOverlay.querySelector('.crop-area');
    cropOverlay.style.display = 'block';
    cropArea.style.display = 'block';
    document.getElementById('cropBtn').style.display = 'none';
    document.getElementById('applyCrop').style.display = 'inline';
    document.getElementById('cancelCrop').style.display = 'inline';

    const canvas = this.imageManager.canvas;
    const rect = canvas.getBoundingClientRect();
    const initialSize = Math.min(rect.width, rect.height) * 0.8;
    
    this.cropStart = {
      x: (rect.width - initialSize) / 2,
      y: (rect.height - initialSize) / 2
    };
    
    this.cropEnd = {
      x: this.cropStart.x + initialSize,
      y: this.cropStart.y + initialSize
    };

    this.updateCropArea(cropArea, rect);
  }

  startResizing(handle, e, canvasRect) {
    this.isResizing = true;
    this.activeHandle = handle;
    this.dragOffset = {
      x: e.clientX - handle.getBoundingClientRect().left,
      y: e.clientY - handle.getBoundingClientRect().top
    };
  }

  startDragging(e, canvasRect) {
    this.isDragging = true;
    const cropArea = document.querySelector('.crop-area');
    const cropRect = cropArea.getBoundingClientRect();
    
    this.dragOffset = {
      x: e.clientX - cropRect.left,
      y: e.clientY - cropRect.top
    };
  }

  resize(e, canvasRect) {
    if (!this.isResizing || !this.activeHandle) return;

    const x = e.clientX - canvasRect.left - this.dragOffset.x;
    const y = e.clientY - canvasRect.top - this.dragOffset.y;

    if (this.activeHandle.classList.contains('top-left')) {
      this.cropStart = { x, y };
    } else if (this.activeHandle.classList.contains('top-right')) {
      this.cropEnd.x = x + this.activeHandle.offsetWidth;
      this.cropStart.y = y;
    } else if (this.activeHandle.classList.contains('bottom-left')) {
      this.cropStart.x = x;
      this.cropEnd.y = y + this.activeHandle.offsetHeight;
    } else if (this.activeHandle.classList.contains('bottom-right')) {
      this.cropEnd = {
        x: x + this.activeHandle.offsetWidth,
        y: y + this.activeHandle.offsetHeight
      };
    }

    this.updateCropArea(document.querySelector('.crop-area'), canvasRect);
  }

  drag(e, canvasRect) {
    if (!this.isDragging) return;

    const x = e.clientX - canvasRect.left - this.dragOffset.x;
    const y = e.clientY - canvasRect.top - this.dragOffset.y;
    
    const width = this.cropEnd.x - this.cropStart.x;
    const height = this.cropEnd.y - this.cropStart.y;

    // Keep crop area within canvas bounds
    const newX = Math.max(0, Math.min(x, canvasRect.width - width));
    const newY = Math.max(0, Math.min(y, canvasRect.height - height));
    
    this.cropStart = { x: newX, y: newY };
    this.cropEnd = {
      x: newX + width,
      y: newY + height
    };

    this.updateCropArea(document.querySelector('.crop-area'), canvasRect);
  }

  updateCropArea(cropArea, canvasRect) {
    const left = Math.min(this.cropStart.x, this.cropEnd.x);
    const top = Math.min(this.cropStart.y, this.cropEnd.y);
    const width = Math.abs(this.cropEnd.x - this.cropStart.x);
    const height = Math.abs(this.cropEnd.y - this.cropStart.y);

    cropArea.style.left = `${left}px`;
    cropArea.style.top = `${top}px`;
    cropArea.style.width = `${width}px`;
    cropArea.style.height = `${height}px`;
  }

  endCropping() {
    this.isCropping = false;
    this.isDragging = false;
    this.isResizing = false;
    document.getElementById('cropOverlay').style.display = 'none';
    document.getElementById('cropBtn').style.display = 'inline';
    document.getElementById('applyCrop').style.display = 'none';
    document.getElementById('cancelCrop').style.display = 'none';
  }

  applyCrop() {
    const currentImage = this.imageManager.getCurrentImage();
    if (!currentImage) return;

    const canvas = this.imageManager.canvas;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const cropX = Math.min(this.cropStart.x, this.cropEnd.x) * scaleX;
    const cropY = Math.min(this.cropStart.y, this.cropEnd.y) * scaleY;
    const cropWidth = Math.abs(this.cropEnd.x - this.cropStart.x) * scaleX;
    const cropHeight = Math.abs(this.cropEnd.y - this.cropStart.y) * scaleY;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(
      canvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const croppedImage = new Image();
    croppedImage.onload = () => {
      currentImage.image = croppedImage;
      this.imageManager.displayImage();
    };
    croppedImage.src = tempCanvas.toDataURL();
  }
}