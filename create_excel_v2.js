#!/usr/bin/env node
/**
 * نظام إدارة الحاويات - النسخة المحسّنة
 * استخدام مكتبة ExcelJS للحصول على جودة أعلى
 */

const ExcelJS = require('exceljs');
const path = require('path');

// ============================================================================
// البيانات
// ============================================================================

const COLORS = {
    dark_bg: '0D1B2A',
    header: '003D82',
    accent: '0066CC',
    success: '27AE60',
    warning: 'E67E22',
    danger: 'C0392B',
    light_gray: 'ECF0F1',
};

const COUNTRIES = ['السعودية', 'الإمارات', 'قطر', 'الكويت', 'البحرين', 'عمان'];
const COMPANIES = ['الراجحي', 'سابك', 'أرامكو', 'كهرباء السعودية', 'سوميتومو', 'الاتصالات'];
const CONTAINER_SIZES = ['20 قدم', '40 قدم', 'High Cube'];
const STATUS_OPTIONS = ['✅ يمكن إرسالها', '⏸️ محجوزة (انتظار تصريح)', '🔒 ممنوع الإرسال', '⚠️ موافقة مشروطة'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function generateSampleContainers() {
    const containers = [];
    const baseDate = new Date();

    for (let i = 0; i < 15; i++) {
        const arrivalDate = new Date(baseDate);
        arrivalDate.setDate(arrivalDate.getDate() - Math.floor(Math.random() * 60 + 1));

        const status = getRandomElement(STATUS_OPTIONS);
        let conditions = '';

        if (status.includes('مشروط')) {
            conditions = getRandomElement(['فحص إضافي مطلوب', 'وثائق معلقة', 'تصريح أمني', 'معاينة طبية']);
        }

        containers.push({
            container_number: `CMAU${Math.floor(Math.random() * 900000 + 100000)}`,
            size: getRandomElement(CONTAINER_SIZES),
            arrival_date: formatDate(arrivalDate),
            company: getRandomElement(COMPANIES),
            country: getRandomElement(COUNTRIES),
            contents: getRandomElement(['مكائن', 'مواد خام', 'قطع غيار', 'منتجات', 'أجهزة']),
            weight_tons: (Math.random() * 20 + 5).toFixed(1),
            notes: Math.random() > 0.7 ? 'حاوية جديدة' : 'مراجعة روتينية',
            status: status,
            conditions: conditions,
        });
    }

    return containers;
}

async function createExcelFile() {
    console.log('🚀 بدء إنشاء النسخة المحسّنة...');

    const workbook = new ExcelJS.Workbook();
    workbook.properties.title = 'نظام إدارة الحاويات';

    const containers = generateSampleContainers();

    // ========== الورقة 1: لوحة التحكم ==========
    console.log('📊 إنشاء لوحة التحكم...');
    const dashboard = workbook.addWorksheet('📊 لوحة التحكم');
    dashboard.views = [{ rightToLeft: true }];

    // العنوان الرئيسي
    const titleCell = dashboard.getCell('A1');
    titleCell.value = 'نظام إدارة الحاويات - لوحة التحكم';
    titleCell.font = { name: 'Calibri', size: 18, bold: true, color: { rgb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.dark_bg } };
    titleCell.alignment = { horizontal: 'right', vertical: 'center', wrapText: true };
    dashboard.mergeCells('A1:F1');
    dashboard.getRow(1).height = 30;

    // KPI Cards
    const kpiLabels = ['الحاويات الموجودة', 'حاويات 40 قدم', 'حاويات 20 قدم', 'المحجوزة'];
    const kpiValues = [
        containers.length,
        containers.filter(c => c.size === '40 قدم').length,
        containers.filter(c => c.size === '20 قدم').length,
        containers.filter(c => c.status.includes('محجوزة')).length,
    ];

    for (let i = 0; i < kpiLabels.length; i++) {
        const col = 6 - i; // من اليمين لليسار

        // Label
        const labelCell = dashboard.getCell(2, col);
        labelCell.value = kpiLabels[i];
        labelCell.font = { name: 'Calibri', size: 12, bold: true, color: { rgb: 'FFFFFF' } };
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.secondary } };
        labelCell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
        dashboard.getColumn(col).width = 18;

        // Value
        const valueCell = dashboard.getCell(3, col);
        valueCell.value = kpiValues[i];
        valueCell.font = { name: 'Calibri', size: 16, bold: true, color: { rgb: COLORS.accent } };
        valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.light_gray } };
        valueCell.alignment = { horizontal: 'center', vertical: 'center' };
    }

    dashboard.getRow(2).height = 25;
    dashboard.getRow(3).height = 30;

    // جدول البيانات
    const tableHeaders = ['الحالة', 'البلد', 'الشركة', 'المحتويات', 'رقم الحاوية'];
    for (let i = 0; i < tableHeaders.length; i++) {
        const col = 6 - i;
        const cell = dashboard.getCell(5, col);
        cell.value = tableHeaders[i];
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { rgb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
        cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    }

    for (let row = 0; row < Math.min(5, containers.length); row++) {
        const c = containers[row];
        const data = [c.status, c.country, c.company, c.contents, c.container_number];
        const excelRow = 6 + row;

        for (let i = 0; i < data.length; i++) {
            const col = 6 - i;
            const cell = dashboard.getCell(excelRow, col);
            cell.value = data[i];
            cell.font = { name: 'Calibri', size: 11 };
            cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };

            // تلوين حسب الحالة
            if (data[i].includes('✅')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'D5F4E6' } };
            } else if (data[i].includes('🔒')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'FADBD8' } };
            } else if (data[i].includes('⏸️')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'FCF3CF' } };
            } else {
                const bgColor = row % 2 === 0 ? COLORS.light_gray : 'FFFFFF';
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: bgColor } };
            }
        }
        dashboard.getRow(excelRow).height = 20;
    }

    // ========== الورقة 2: قاعدة البيانات ==========
    console.log('📁 إنشاء قاعدة البيانات...');
    const database = workbook.addWorksheet('📁 قاعدة البيانات');
    database.views = [{ rightToLeft: true }];

    const headers = [
        'رقم الحاوية', 'الحجم', 'تاريخ الوصول',
        'الشركة', 'البلد', 'المحتويات', 'الوزن (طن)',
        'حالة التصريح', 'الشروط', 'الملاحظات', 'اسم المدخل'
    ];

    // كتابة الرؤوس
    for (let i = 0; i < headers.length; i++) {
        const cell = database.getCell(1, i + 1);
        cell.value = headers[i];
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
        cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
        database.getColumn(i + 1).width = 14;
    }

    database.getRow(1).height = 25;

    // كتابة البيانات
    for (let row = 0; row < containers.length; row++) {
        const c = containers[row];
        const data = [
            c.container_number,
            c.size,
            c.arrival_date,
            c.company,
            c.country,
            c.contents,
            c.weight_tons,
            c.status,
            c.conditions,
            c.notes,
            'النظام'
        ];

        const excelRow = row + 2;
        for (let i = 0; i < data.length; i++) {
            const cell = database.getCell(excelRow, i + 1);
            cell.value = data[i];
            cell.font = { name: 'Calibri', size: 10 };
            cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };

            // تلوين حسب الحالة
            if (c.status.includes('✅')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'D5F4E6' } };
            } else if (c.status.includes('🔒')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'FADBD8' } };
            } else if (c.status.includes('⏸️')) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'FCF3CF' } };
            } else {
                const bgColor = row % 2 === 0 ? COLORS.light_gray : 'FFFFFF';
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: bgColor } };
            }
        }
        database.getRow(excelRow).height = 20;
    }

    // ========== الورقة 3: التقارير ==========
    console.log('📊 إنشاء ورقة التقارير...');
    const reports = workbook.addWorksheet('📊 التقارير');
    reports.views = [{ rightToLeft: true }];

    const reportTitle = reports.getCell('A1');
    reportTitle.value = 'التقارير والإحصائيات';
    reportTitle.font = { name: 'Calibri', size: 16, bold: true, color: { rgb: 'FFFFFF' } };
    reportTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
    reportTitle.alignment = { horizontal: 'right', vertical: 'center' };
    reports.mergeCells('A1:B1');
    reports.getRow(1).height = 25;

    const reportData = [
        ['إجمالي الحاويات', containers.length],
        ['حاويات 40 قدم', containers.filter(c => c.size === '40 قدم').length],
        ['حاويات 20 قدم', containers.filter(c => c.size === '20 قدم').length],
        ['الحاويات المحجوزة', containers.filter(c => c.status.includes('محجوزة')).length],
        ['الحاويات الممنوعة', containers.filter(c => c.status.includes('ممنوع')).length],
        ['موافقة مشروطة', containers.filter(c => c.status.includes('مشروط')).length],
        ['الحاويات المجازة', containers.filter(c => c.status.includes('يمكن')).length],
    ];

    for (let i = 0; i < reportData.length; i++) {
        const row = i + 3;
        const cell1 = reports.getCell(row, 1);
        const cell2 = reports.getCell(row, 2);

        cell1.value = reportData[i][0];
        cell2.value = reportData[i][1];

        cell1.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        cell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.secondary } };
        cell1.alignment = { horizontal: 'right', vertical: 'center' };

        cell2.font = { name: 'Calibri', size: 12, bold: true, color: { rgb: COLORS.accent } };
        cell2.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.light_gray } };
        cell2.alignment = { horizontal: 'center', vertical: 'center' };

        reports.getRow(row).height = 20;
    }

    reports.getColumn(1).width = 25;
    reports.getColumn(2).width = 15;

    // ========== الورقة 4: إضافة حاوية ==========
    console.log('📥 إنشاء ورقة إضافة حاوية...');
    const addContainer = workbook.addWorksheet('📥 إضافة حاوية');
    addContainer.views = [{ rightToLeft: true }];

    const addTitle = addContainer.getCell('A1');
    addTitle.value = 'إضافة حاوية قادمة جديدة';
    addTitle.font = { name: 'Calibri', size: 16, bold: true, color: { rgb: 'FFFFFF' } };
    addTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.success } };
    addTitle.alignment = { horizontal: 'right', vertical: 'center' };
    addContainer.mergeCells('A1:B1');
    addContainer.getRow(1).height = 25;

    const fields = [
        'رقم الحاوية', 'حجم الحاوية', 'تاريخ الوصول', 'الشركة', 'البلد',
        'المحتويات', 'الوزن (طن)', 'حالة التصريح', 'الشروط (إن وجدت)', 'ملاحظات إضافية'
    ];

    for (let i = 0; i < fields.length; i++) {
        const row = i + 3;
        const labelCell = addContainer.getCell(row, 1);
        const inputCell = addContainer.getCell(row, 2);

        labelCell.value = fields[i];
        labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
        labelCell.alignment = { horizontal: 'right', vertical: 'center' };

        inputCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.light_gray } };
        inputCell.alignment = { horizontal: 'right', vertical: 'top', wrapText: true };

        addContainer.getRow(row).height = fields[i] === 'ملاحظات إضافية' ? 60 : 20;
    }

    addContainer.getColumn(1).width = 25;
    addContainer.getColumn(2).width = 50;

    // ========== الورقة 5: تسجيل الخروج ==========
    console.log('📤 إنشاء ورقة تسجيل الخروج...');
    const checkout = workbook.addWorksheet('📤 تسجيل خروج');
    checkout.views = [{ rightToLeft: true }];

    const checkoutTitle = checkout.getCell('A1');
    checkoutTitle.value = 'تسجيل خروج وتسليم الحاوية';
    checkoutTitle.font = { name: 'Calibri', size: 16, bold: true, color: { rgb: 'FFFFFF' } };
    checkoutTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.warning } };
    checkoutTitle.alignment = { horizontal: 'right', vertical: 'center' };
    checkout.mergeCells('A1:B1');
    checkout.getRow(1).height = 25;

    const checkoutFields = [
        'بحث عن رقم الحاوية', 'رقم الحاوية (تلقائي)', 'حجم الحاوية (تلقائي)',
        'تاريخ الوصول (تلقائي)', 'الشركة (تلقائي)', 'حالة التصريح (تلقائي)',
        'الشروط إن وجدت (تلقائي)', 'تاريخ التسليم', 'ملاحظات التسليم', 'اسم المسلم'
    ];

    for (let i = 0; i < checkoutFields.length; i++) {
        const row = i + 3;
        const labelCell = checkout.getCell(row, 1);
        const inputCell = checkout.getCell(row, 2);

        labelCell.value = checkoutFields[i];
        labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.secondary } };
        labelCell.alignment = { horizontal: 'right', vertical: 'center' };

        inputCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.light_gray } };
        inputCell.alignment = { horizontal: 'right', vertical: 'top', wrapText: true };

        checkout.getRow(row).height = 20;
    }

    checkout.getColumn(1).width = 25;
    checkout.getColumn(2).width = 50;

    // ========== الورقة 6: الشهادات ==========
    console.log('🖨️ إنشاء ورقة الشهادات...');
    const certificates = workbook.addWorksheet('🖨️ الشهادات');
    certificates.views = [{ rightToLeft: true }];

    const certTitle = certificates.getCell('A1');
    certTitle.value = 'شهادات الاستقبال والتسليم';
    certTitle.font = { name: 'Calibri', size: 16, bold: true, color: { rgb: 'FFFFFF' } };
    certTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.danger } };
    certTitle.alignment = { horizontal: 'right', vertical: 'center' };
    certificates.mergeCells('A1:B1');
    certificates.getRow(1).height = 25;

    let certRow = 3;

    // شهادة الاستقبال
    const receiptTitle = certificates.getCell(certRow, 1);
    receiptTitle.value = 'شهادة استقبال الحاوية';
    receiptTitle.font = { name: 'Calibri', size: 12, bold: true, color: { rgb: 'FFFFFF' } };
    receiptTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
    certificates.mergeCells(`A${certRow}:B${certRow}`);
    certRow += 2;

    const receiptFields = [
        'رقم الشهادة', 'رقم الحاوية', 'تاريخ الاستقبال', 'الموقع (الميناء)',
        'المسؤول عن الاستقبال', 'التوقيع والختم'
    ];

    for (const field of receiptFields) {
        const labelCell = certificates.getCell(certRow, 1);
        const signCell = certificates.getCell(certRow, 2);

        labelCell.value = field;
        labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.secondary } };
        labelCell.alignment = { horizontal: 'right', vertical: 'center' };

        signCell.border = {
            bottom: { style: 'thin', color: { rgb: '000000' } }
        };

        certificates.getRow(certRow).height = 20;
        certRow++;
    }

    certRow += 2;

    // شهادة التسليم
    const deliveryTitle = certificates.getCell(certRow, 1);
    deliveryTitle.value = 'شهادة تسليم الحاوية';
    deliveryTitle.font = { name: 'Calibri', size: 12, bold: true, color: { rgb: 'FFFFFF' } };
    deliveryTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.header } };
    certificates.mergeCells(`A${certRow}:B${certRow}`);
    certRow += 2;

    const deliveryFields = [
        'رقم الشهادة', 'رقم الحاوية', 'تاريخ التسليم', 'اسم المستقبل',
        'الشركة', 'التوقيع والختم'
    ];

    for (const field of deliveryFields) {
        const labelCell = certificates.getCell(certRow, 1);
        const signCell = certificates.getCell(certRow, 2);

        labelCell.value = field;
        labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { rgb: 'FFFFFF' } };
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: COLORS.secondary } };
        labelCell.alignment = { horizontal: 'right', vertical: 'center' };

        signCell.border = {
            bottom: { style: 'thin', color: { rgb: '000000' } }
        };

        certificates.getRow(certRow).height = 20;
        certRow++;
    }

    certificates.getColumn(1).width = 25;
    certificates.getColumn(2).width = 50;

    // ========== الورقة 7: الإعدادات ==========
    console.log('⚙️ إنشاء ورقة الإعدادات...');
    const settings = workbook.addWorksheet('⚙️ الإعدادات');
    settings.views = [{ rightToLeft: true }];

    let settingsRow = 1;

    // الأحجام
    const sizesTitle = settings.getCell(settingsRow, 1);
    sizesTitle.value = 'أحجام الحاويات';
    sizesTitle.font = { name: 'Calibri', size: 11, bold: true };
    settingsRow++;

    for (const size of CONTAINER_SIZES) {
        settings.getCell(settingsRow, 1).value = size;
        settingsRow++;
    }

    settingsRow = 1;

    // البلدان
    const countriesTitle = settings.getCell(settingsRow, 3);
    countriesTitle.value = 'البلدان';
    countriesTitle.font = { name: 'Calibri', size: 11, bold: true };
    settingsRow++;

    for (const country of COUNTRIES) {
        settings.getCell(settingsRow, 3).value = country;
        settingsRow++;
    }

    settingsRow = 1;

    // الشركات
    const companiesTitle = settings.getCell(settingsRow, 5);
    companiesTitle.value = 'الشركات';
    companiesTitle.font = { name: 'Calibri', size: 11, bold: true };
    settingsRow++;

    for (const company of COMPANIES) {
        settings.getCell(settingsRow, 5).value = company;
        settingsRow++;
    }

    settings.getColumn(1).width = 15;
    settings.getColumn(3).width = 15;
    settings.getColumn(5).width = 15;

    // ========== حفظ الملف ==========
    const outputPath = path.join(__dirname, 'public', 'نظام_إدارة_الحاويات.xlsx');
    await workbook.xlsx.writeFile(outputPath);

    console.log();
    console.log('✅ تم إنشاء الملف بنجاح!');
    console.log(`📍 المسار: ${outputPath}`);
    console.log();
    console.log('📊 الأوراق:');
    console.log('  1. 📊 لوحة التحكم');
    console.log('  2. 📁 قاعدة البيانات');
    console.log('  3. 📊 التقارير');
    console.log('  4. 📥 إضافة حاوية');
    console.log('  5. 📤 تسجيل خروج');
    console.log('  6. 🖨️ الشهادات');
    console.log('  7. ⚙️ الإعدادات');
    console.log();
    console.log('✨ جاهز للاستخدام الفوري!');
}

createExcelFile().catch(err => {
    console.error('❌ خطأ:', err.message);
    process.exit(1);
});
