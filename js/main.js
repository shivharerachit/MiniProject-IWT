// Initialize managers
const imageManager = new ImageManager();
const filterManager = new FilterManager(imageManager);
const transformManager = new TransformManager(imageManager);
const textManager = new TextManager(imageManager);
const cropManager = new CropManager(imageManager);

// Download functionality
document.getElementById('download').addEventListener('click', function () {
  const currentImage = imageManager.getCurrentImage();
  if (!currentImage) return;

  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = imageManager.canvas.toDataURL('image/png');
  link.click();
});
