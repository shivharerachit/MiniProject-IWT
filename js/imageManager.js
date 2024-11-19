class ImageManager {
  constructor() {
    this.images = [];
    this.currentImageIndex = -1;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.imageListElement = document.querySelector('.image-list');

    this.setupImageInput();
  }

  setupImageInput() {
    const imageInput = document.getElementById('imageInput');
    imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
  }

  handleImageUpload(e) {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.images.push({
            image: img,
            filters: this.getDefaultFilters(),
            rotation: 0,
            flipH: false,
            flipV: false,
            texts: [],
          });

          if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
            this.displayImage();
          }

          this.updateImageList();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  getDefaultFilters() {
    return {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      blur: 0,
    };
  }

  updateImageList() {
    this.imageListElement.innerHTML = '';
    this.images.forEach((img, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `thumbnail ${
        index === this.currentImageIndex ? 'active' : ''
      }`;
      thumbnail.style.backgroundImage = `url(${img.image.src})`;
      thumbnail.addEventListener('click', () => {
        this.currentImageIndex = index;
        this.displayImage();
        document
          .querySelectorAll('.thumbnail')
          .forEach((t) => t.classList.remove('active'));
        thumbnail.classList.add('active');
      });
      this.imageListElement.appendChild(thumbnail);
    });
  }

  getCurrentImage() {
    return this.images[this.currentImageIndex];
  }

  displayImage() {
    if (this.currentImageIndex === -1) return;

    const imgData = this.getCurrentImage();
    const img = imgData.image;

    // Set canvas size
    this.canvas.width = img.width;
    this.canvas.height = img.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Hide placeholder and show canvas
    document.getElementById('placeholder').style.display = 'none';
    this.canvas.style.display = 'block';

    // Apply transformations
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate((imgData.rotation * Math.PI) / 180);
    if (imgData.flipH) this.ctx.scale(-1, 1);
    if (imgData.flipV) this.ctx.scale(1, -1);

    // Apply filters
    this.ctx.filter = this.getFilterString(imgData.filters);

    // Draw image
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // Draw texts
    imgData.texts.forEach((text) => {
      this.ctx.filter = 'none';
      this.ctx.font = `${text.size}px Arial`;
      this.ctx.fillStyle = text.color;
      this.ctx.fillText(
        text.content,
        text.x - img.width / 2,
        text.y - img.height / 2
      );
    });

    this.ctx.restore();
  }

  getFilterString(filters) {
    return `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturation}%)
          grayscale(${filters.grayscale}%)
          sepia(${filters.sepia}%)
          blur(${filters.blur}px)
      `;
  }
}
