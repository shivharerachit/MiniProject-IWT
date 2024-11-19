class FilterManager {
  constructor(imageManager) {
    this.imageManager = imageManager;
    this.setupFilterControls();
  }

  setupFilterControls() {
    const filterInputs = [
      'brightness',
      'contrast',
      'saturation',
      'grayscale',
      'sepia',
      'blur',
    ];

    filterInputs.forEach((filter) => {
      const input = document.getElementById(filter);
      input.addEventListener('input', () => {
        const currentImage = this.imageManager.getCurrentImage();
        if (currentImage) {
          currentImage.filters[filter] = input.value;
          this.imageManager.displayImage();
        }
      });
    });

    // Reset button
    document.getElementById('reset').addEventListener('click', () => {
      const currentImage = this.imageManager.getCurrentImage();
      if (currentImage) {
        currentImage.filters = this.imageManager.getDefaultFilters();
        currentImage.rotation = 0;
        currentImage.flipH = false;
        currentImage.flipV = false;
        currentImage.texts = [];

        // Reset all input values
        filterInputs.forEach((filter) => {
          const input = document.getElementById(filter);
          input.value =
            filter === 'blur'
              ? 0
              : filter === 'grayscale' || filter === 'sepia'
              ? 0
              : 100;
        });

        this.imageManager.displayImage();
      }
    });
  }
}
