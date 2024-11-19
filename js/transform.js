class TransformManager {
  constructor(imageManager) {
    this.imageManager = imageManager;
    this.setupTransformControls();
  }

  setupTransformControls() {
    document.getElementById('rotateLeft').addEventListener('click', () => {
      const currentImage = this.imageManager.getCurrentImage();
      if (currentImage) {
        currentImage.rotation = (currentImage.rotation - 90) % 360;
        this.imageManager.displayImage();
      }
    });

    document.getElementById('rotateRight').addEventListener('click', () => {
      const currentImage = this.imageManager.getCurrentImage();
      if (currentImage) {
        currentImage.rotation = (currentImage.rotation + 90) % 360;
        this.imageManager.displayImage();
      }
    });

    document.getElementById('flipH').addEventListener('click', () => {
      const currentImage = this.imageManager.getCurrentImage();
      if (currentImage) {
        currentImage.flipH = !currentImage.flipH;
        this.imageManager.displayImage();
      }
    });

    document.getElementById('flipV').addEventListener('click', () => {
      const currentImage = this.imageManager.getCurrentImage();
      if (currentImage) {
        currentImage.flipV = !currentImage.flipV;
        this.imageManager.displayImage();
      }
    });
  }
}
