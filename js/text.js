class TextManager {
  constructor(imageManager) {
    this.imageManager = imageManager;
    this.texts = [];
    this.selectedText = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.setupTextControls();
    this.setupTextOverlay();
  }

  setupTextOverlay() {
    this.textOverlay = document.getElementById('textOverlay');
    this.setupTextInteractions();
  }

  setupTextControls() {
    const textInput = document.getElementById('textInput');
    const addTextBtn = document.getElementById('addText');
    const textColor = document.getElementById('textColor');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const fontWeight = document.getElementById('fontWeight');

    addTextBtn.addEventListener('click', () => this.addText());
    textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addText();
    });
  }

  addText() {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    if (!text) return;

    const textElement = document.createElement('div');
    textElement.className = 'editable-text';
    textElement.contentEditable = true;
    textElement.innerHTML = text;
    textElement.style.color = document.getElementById('textColor').value;
    textElement.style.fontSize = document.getElementById('fontSize').value + 'px';
    textElement.style.fontFamily = document.getElementById('fontFamily').value;
    textElement.style.fontWeight = document.getElementById('fontWeight').value;

    // Position at center
    const containerRect = this.textOverlay.getBoundingClientRect();
    textElement.style.left = (containerRect.width / 2) + 'px';
    textElement.style.top = (containerRect.height / 2) + 'px';
    textElement.style.transform = 'translate(-50%, -50%)';

    this.textOverlay.appendChild(textElement);
    this.texts.push(textElement);
    
    textInput.value = '';
    this.setupTextElementInteractions(textElement);
  }

  setupTextElementInteractions(textElement) {
    let isEditing = false;

    textElement.addEventListener('mousedown', (e) => {
      if (!isEditing) {
        this.startDragging(e);
      }
    });

    textElement.addEventListener('dblclick', () => {
      isEditing = true;
      textElement.focus();
      textElement.style.cursor = 'text';
    });

    textElement.addEventListener('blur', () => {
      isEditing = false;
      textElement.style.cursor = 'move';
    });

    textElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      textElement.remove();
      this.texts = this.texts.filter(t => t !== textElement);
    });

    // Update text properties in real-time
    const updateTextStyle = (property, value) => {
      if (document.activeElement === textElement) {
        textElement.style[property] = value;
      }
    };

    document.getElementById('textColor').addEventListener('input', (e) => {
      updateTextStyle('color', e.target.value);
    });

    document.getElementById('fontSize').addEventListener('input', (e) => {
      updateTextStyle('fontSize', e.target.value + 'px');
    });

    document.getElementById('fontFamily').addEventListener('change', (e) => {
      updateTextStyle('fontFamily', e.target.value);
    });

    document.getElementById('fontWeight').addEventListener('change', (e) => {
      updateTextStyle('fontWeight', e.target.value);
    });
  }

  setupTextInteractions() {
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.drag(e);
      }
    });

    document.addEventListener('mouseup', () => {
      this.stopDragging();
    });

    // Touch events
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        const touch = e.touches[0];
        this.drag({
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        e.preventDefault();
      }
    });

    document.addEventListener('touchend', () => {
      this.stopDragging();
    });
  }

  startDragging(e) {
    if (e.target.classList.contains('editable-text')) {
      this.isDragging = true;
      this.selectedText = e.target;
      const rect = this.selectedText.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      this.selectedText.style.cursor = 'move';
    }
  }

  drag(e) {
    if (!this.isDragging || !this.selectedText) return;

    const containerRect = this.textOverlay.getBoundingClientRect();
    const x = Math.min(
      Math.max(e.clientX - this.dragOffset.x, 0),
      containerRect.width - this.selectedText.offsetWidth
    );
    const y = Math.min(
      Math.max(e.clientY - this.dragOffset.y, 0),
      containerRect.height - this.selectedText.offsetHeight
    );
    
    this.selectedText.style.left = x + 'px';
    this.selectedText.style.top = y + 'px';
    this.selectedText.style.transform = 'none';
  }

  stopDragging() {
    if (this.selectedText) {
      this.selectedText.style.cursor = 'move';
    }
    this.isDragging = false;
    this.selectedText = null;
  }

  applyTextsToCanvas() {
    const ctx = this.imageManager.ctx;
    this.texts.forEach(textElement => {
      const rect = textElement.getBoundingClientRect();
      const canvasRect = this.imageManager.canvas.getBoundingClientRect();
      
      const x = (rect.left - canvasRect.left) * (this.imageManager.canvas.width / canvasRect.width);
      const y = (rect.top - canvasRect.top + rect.height / 2) * (this.imageManager.canvas.height / canvasRect.height);
      
      ctx.font = `${textElement.style.fontWeight} ${textElement.style.fontSize} ${textElement.style.fontFamily}`;
      ctx.fillStyle = textElement.style.color;
      ctx.fillText(textElement.innerText, x, y);
    });
  }
}