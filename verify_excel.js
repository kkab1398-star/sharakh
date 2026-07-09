const XLSX = require('xlsx');
const wb = XLSX.readFile('نظام_إدارة_الحاويات.xlsx');

console.log('📊 معلومات ملف Excel:');
console.log('');
console.log(`الملف: نظام_إدارة_الحاويات.xlsx`);
console.log(`عدد الأوراق: ${wb.SheetNames.length}`);
console.log('');
console.log('📋 قائمة الأوراق:');

wb.SheetNames.forEach((sheetName, idx) => {
    const ws = wb.Sheets[sheetName];
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    const rows = range.e.r + 1;
    const cols = range.e.c + 1;
    console.log(`  ${idx + 1}. ${sheetName} (${rows} صف، ${cols} عمود)`);
});

console.log('');
console.log('✅ الملف جاهز للاستخدام!');
