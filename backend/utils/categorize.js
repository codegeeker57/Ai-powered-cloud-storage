const path = require('path');

const categorizeFile = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  
  const categories = {
    'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'],
    'Documents': ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
    'Spreadsheets': ['.xls', '.xlsx', '.csv', '.ods'],
    'Presentations': ['.ppt', '.pptx', '.odp'],
    'Videos': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
    'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma'],
    'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
    'Code': ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.json', '.xml', '.yaml', '.yml']
  };

  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) {
      return category;
    }
  }

  return 'Other';
};

module.exports = { categorizeFile };