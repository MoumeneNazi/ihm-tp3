// Language system
let currentLang = 'en';

const translations = {
  en: {
    title: 'Text Editor',
    langBtn: 'العربية',
    placeholder: 'Start typing...',
    size: 'Size',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    huge: 'Huge',
    pdf: 'PDF',
    linkPrompt: 'Enter link URL:',
    imagePrompt: 'Enter image URL:',
    codePrompt: 'Enter code:',
    punctPrompt: 'Choose punctuation:\n1. « » (Guillemets)\n2. " " (Quotes)\n3. — (Em dash)\n4. … (Ellipsis)\n5. ؟ (Arabic question)',
    pdfSaving: 'Generating PDF...',
    pdfSuccess: 'PDF saved successfully!',
    pdfError: 'Error generating PDF'
  },
  ar: {
    title: 'محرر النصوص',
    langBtn: 'English',
    placeholder: 'ابدأ الكتابة...',
    size: 'الحجم',
    small: 'صغير',
    normal: 'عادي',
    large: 'كبير',
    huge: 'ضخم',
    pdf: 'PDF',
    linkPrompt: 'أدخل رابط URL:',
    imagePrompt: 'أدخل رابط الصورة:',
    codePrompt: 'أدخل الكود:',
    punctPrompt: 'اختر علامة الترقيم:\n1. « » (أقواس فرنسية)\n2. " " (علامات تنصيص)\n3. — (شرطة طويلة)\n4. … (نقاط حذف)\n5. ؟ (علامة استفهام)',
    pdfSaving: 'جاري إنشاء PDF...',
    pdfSuccess: 'تم حفظ PDF بنجاح!',
    pdfError: 'خطأ في إنشاء PDF'
  }
};

// Toggle language
document.getElementById('language-toggle').addEventListener('click', function() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  updateLanguage();
});

function updateLanguage() {
  const t = translations[currentLang];
  
  // Update page title
  document.getElementById('page-title').textContent = t.title;
  document.getElementById('language-toggle').textContent = t.langBtn;
  
  // Update editor placeholder
  document.getElementById('editor').setAttribute('placeholder', t.placeholder);
  
  // Update select options
  const sizeSelect = document.getElementById('font-size');
  sizeSelect.options[0].text = t.size;
  sizeSelect.options[1].text = t.small;
  sizeSelect.options[2].text = t.normal;
  sizeSelect.options[3].text = t.large;
  sizeSelect.options[4].text = t.huge;
  
  // Update PDF button text
  document.querySelector('#save-pdf span').textContent = t.pdf;
  
  // Set document direction for Arabic
  if (currentLang === 'ar') {
    document.body.setAttribute('dir', 'rtl');
  } else {
    document.body.removeAttribute('dir');
  }
}

// Basic formatting commands
document.querySelectorAll('[data-cmd]').forEach(button => {
  button.addEventListener('click', () => {
    let command = button.getAttribute('data-cmd');
    document.execCommand(command, false, null);
  });
});

// Font size
document.getElementById("font-size").addEventListener("change", function () {
  document.execCommand("fontSize", false, this.value);
});

// Text color
document.getElementById("text-color").addEventListener("change", function () {
  document.execCommand("foreColor", false, this.value);
});

// Highlight color
document.getElementById("highlight-color").addEventListener("change", function () {
  document.execCommand("hiliteColor", false, this.value);
});

// Insert link
document.getElementById("insert-link").addEventListener("click", function () {
  const t = translations[currentLang];
  const url = prompt(t.linkPrompt);
  if (url) document.execCommand("createLink", false, url);
});

// Insert image
document.getElementById("insert-image").addEventListener("click", function () {
  const t = translations[currentLang];
  const url = prompt(t.imagePrompt);
  if (url) document.execCommand("insertImage", false, url);
});

// Insert code
document.getElementById("insert-code").addEventListener("click", function () {
  const t = translations[currentLang];
  const code = prompt(t.codePrompt);
  if (code) {
    const html = "<pre><code>" + code.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></pre>";
    document.execCommand("insertHTML", false, html);
  }
});

// NEW: Insert special punctuation
document.getElementById("insert-punctuation").addEventListener("click", function () {
  const t = translations[currentLang];
  const choice = prompt(t.punctPrompt);
  
  let punctuation = '';
  switch(choice) {
    case '1':
      punctuation = '« »';
      break;
    case '2':
      punctuation = '" "';
      break;
    case '3':
      punctuation = '—';
      break;
    case '4':
      punctuation = '…';
      break;
    case '5':
      punctuation = '؟';
      break;
  }
  
  if (punctuation) {
    document.execCommand("insertText", false, punctuation);
  }
});

// NEW: Insert alphabetical list
document.getElementById("insert-alpha-list").addEventListener("click", function () {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Split by lines and create alphabetical list
      const lines = selectedText.split('\n').filter(line => line.trim());
      let listHTML = '<ol style="list-style-type: lower-alpha; margin-left: 20px;">';
      lines.forEach(line => {
        listHTML += '<li>' + line.trim() + '</li>';
      });
      listHTML += '</ol>';
      
      document.execCommand("insertHTML", false, listHTML);
    } else {
      // Insert empty alphabetical list
      const listHTML = '<ol style="list-style-type: lower-alpha; margin-left: 20px;"><li><br></li></ol>';
      document.execCommand("insertHTML", false, listHTML);
    }
  }
});

// NEW: Save as PDF
document.getElementById("save-pdf").addEventListener("click", function () {
  const t = translations[currentLang];
  const editor = document.getElementById('editor');
  
  // Show loading message
  const originalContent = this.innerHTML;
  this.innerHTML = '⏳ ' + t.pdfSaving;
  this.disabled = true;
  
  // PDF options
  const opt = {
    margin: 10,
    filename: 'text-editor-document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };
  
  // Generate PDF
  html2pdf().set(opt).from(editor).save().then(() => {
    // Reset button
    this.innerHTML = originalContent;
    this.disabled = false;
    alert(t.pdfSuccess);
  }).catch(err => {
    console.error('PDF Error:', err);
    this.innerHTML = originalContent;
    this.disabled = false;
    alert(t.pdfError);
  });
});

// Initialize with English
updateLanguage();