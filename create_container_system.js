#!/usr/bin/env node
/**
 * نظام إدارة الحاويات - Container Management System
 * يقوم بإنشاء ملف Excel احترافي شامل مع:
 * - لوحة تحكم (Dashboard)
 * - نظام إدخال البيانات
 * - قاعدة بيانات منظمة
 * - نظام تصاريح متقدم
 * - التقارير والشهادات
 */

const XLSX = require('xlsx');

// ============================================================================
// إعدادات التصميم (Design Settings)
// ============================================================================

const COLORS = {
    dark_bg: '0D1B2A',      // أسود/رمادي داكن جداً
    header: '003D82',        // أزرق داكن عميق
    accent: '0066CC',        // أزرق لازوردي
    secondary: '1A4D99',     // أزرق فاتح
    text_white: 'FFFFFF',    // أبيض
    success: '27AE60',       // أخضر
    warning: 'E67E22',       // برتقالي
    danger: 'C0392B',        // أحمر
    light_gray: 'ECF0F1',    // رمادي فاتح
};

const COUNTRIES = ['السعودية', 'الإمارات', 'قطر', 'الكويت', 'البحرين', 'عمان'];
const COMPANIES = ['الراجحي', 'سابك', 'أرامكو', 'كهرباء السعودية', 'سوميتومو', 'الاتصالات'];
const CONTAINER_SIZES = ['20 قدم', '40 قدم', 'High Cube'];
const STATUS_OPTIONS = ['✅ يمكن إرسالها', '⏸️ محجوزة (انتظار تصريح)', '🔒 ممنوع الإرسال', '⚠️ موافقة مشروطة'];

// ============================================================================
// دوال مساعدة
// ============================================================================

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// توليد البيانات التجريبية
// ============================================================================

function generateSampleContainers() {
    const containers = [];
    const baseDate = new Date();

    for (let i = 0; i < 15; i++) {
        const arrivalDate = new Date(baseDate);
        arrivalDate.setDate(arrivalDate.getDate() - generateRandomNumber(1, 60));

        const approvalDate = new Date(baseDate);
        approvalDate.setDate(approvalDate.getDate() - generateRandomNumber(1, 30));

        const status = getRandomElement(STATUS_OPTIONS);
        let conditions = '';

        if (status.includes('مشروط')) {
            conditions = getRandomElement([
                'فحص إضافي مطلوب',
                'وثائق معلقة',
                'تصريح أمني',
                'معاينة طبية'
            ]);
        }

        containers.push({
            container_number: `CMAU${generateRandomNumber(100000, 999999)}`,
            size: getRandomElement(CONTAINER_SIZES),
            arrival_date: formatDate(arrivalDate),
            approval_date: formatDate(approvalDate),
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

// ============================================================================
// أنماط Excel
// ============================================================================

function createHeaderStyle(color = COLORS.header) {
    return {
        font: { name: 'Calibri', size: 12, bold: true, color: { rgb: COLORS.text_white } },
        fill: { fgColor: { rgb: color }, patternType: 'solid' },
        alignment: { horizontal: 'right', vertical: 'center', wrapText: true },
        border: {
            left: { style: 'thin', color: { rgb: COLORS.text_white } },
            right: { style: 'thin', color: { rgb: COLORS.text_white } },
            top: { style: 'thin', color: { rgb: COLORS.text_white } },
            bottom: { style: 'thin', color: { rgb: COLORS.text_white } },
        },
    };
}

function createDataStyle(isAlternate = false) {
    return {
        font: { name: 'Calibri', size: 11, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: isAlternate ? COLORS.light_gray : COLORS.text_white }, patternType: 'solid' },
        alignment: { horizontal: 'right', vertical: 'center', wrapText: true },
    };
}

// ============================================================================
// إنشاء الأوراق
// ============================================================================

function createDashboard(containers) {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    // العنوان
    ws['A1'] = { v: 'نظام إدارة الحاويات - لوحة التحكم', s: { ...createHeaderStyle(COLORS.dark_bg), font: { ...createHeaderStyle().font, size: 18 } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

    // KPI Cards
    const kpiLabels = ['الحاويات الموجودة', 'حاويات 40 قدم', 'حاويات 20 قدم', 'المحجوزة'];
    const kpiValues = [
        containers.length,
        containers.filter(c => c.size === '40 قدم').length,
        containers.filter(c => c.size === '20 قدم').length,
        containers.filter(c => c.status.includes('محجوزة')).length,
    ];

    for (let i = 0; i < kpiLabels.length; i++) {
        const col = XLSX.utils.encode_col(4 - i);
        ws[`${col}2`] = { v: kpiLabels[i], s: createHeaderStyle(COLORS.secondary) };
        ws[`${col}3`] = {
            v: kpiValues[i],
            s: {
                font: { name: 'Calibri', size: 16, bold: true, color: { rgb: COLORS.accent } },
                fill: { fgColor: { rgb: COLORS.light_gray }, patternType: 'solid' },
                alignment: { horizontal: 'center', vertical: 'center' },
            }
        };
    }

    // جدول البيانات
    const tableHeaders = ['الحالة', 'البلد', 'الشركة', 'المحتويات', 'رقم الحاوية'];
    for (let i = 0; i < tableHeaders.length; i++) {
        const col = XLSX.utils.encode_col(4 - i);
        ws[`${col}5`] = { v: tableHeaders[i], s: createHeaderStyle() };
    }

    // البيانات
    for (let row = 0; row < Math.min(5, containers.length); row++) {
        const c = containers[row];
        const data = [c.status, c.country, c.company, c.contents, c.container_number];
        for (let i = 0; i < data.length; i++) {
            const col = XLSX.utils.encode_col(4 - i);
            ws[`${col}${row + 6}`] = { v: data[i], s: createDataStyle(row % 2 === 0) };
        }
    }

    ws['!cols'] = [
        { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    return ws;
}

function createAddContainerSheet() {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    // العنوان
    ws['A1'] = { v: 'إضافة حاوية قادمة جديدة', s: { ...createHeaderStyle(COLORS.success), font: { ...createHeaderStyle().font, size: 16 } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

    const fields = [
        'رقم الحاوية',
        'حجم الحاوية',
        'تاريخ الوصول',
        'الشركة',
        'البلد',
        'المحتويات',
        'الوزن (طن)',
        'حالة التصريح',
        'الشروط (إن وجدت)',
        'ملاحظات إضافية'
    ];

    let row = 2;
    for (const field of fields) {
        ws[`A${row}`] = { v: field, s: createHeaderStyle() };
        ws[`B${row}`] = { s: { fill: { fgColor: { rgb: COLORS.light_gray }, patternType: 'solid' } } };
        row++;
    }

    ws['!cols'] = [{ wch: 30 }, { wch: 50 }];
    return ws;
}

function createCheckoutSheet() {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    ws['A1'] = { v: 'تسجيل خروج وتسليم الحاوية', s: { ...createHeaderStyle(COLORS.warning), font: { ...createHeaderStyle().font, size: 16 } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

    const fields = [
        'بحث عن رقم الحاوية',
        'رقم الحاوية (تلقائي)',
        'حجم الحاوية (تلقائي)',
        'تاريخ الوصول (تلقائي)',
        'الشركة (تلقائي)',
        'حالة التصريح (تلقائي)',
        'الشروط إن وجدت (تلقائي)',
        'تاريخ التسليم',
        'ملاحظات التسليم',
        'اسم المسلم',
    ];

    let row = 2;
    for (const field of fields) {
        ws[`A${row}`] = { v: field, s: createHeaderStyle(COLORS.secondary) };
        ws[`B${row}`] = { s: { fill: { fgColor: { rgb: COLORS.light_gray }, patternType: 'solid' } } };
        row++;
    }

    ws['!cols'] = [{ wch: 30 }, { wch: 50 }];
    return ws;
}

function createDatabaseSheet(containers) {
    const headers = [
        'رقم الحاوية', 'الحجم', 'تاريخ الوصول', 'تاريخ الموافقة',
        'الشركة', 'البلد', 'المحتويات', 'الوزن (طن)',
        'حالة التصريح', 'الشروط', 'الملاحظات', 'اسم المدخل'
    ];

    const data = containers.map(c => [
        c.container_number,
        c.size,
        c.arrival_date,
        c.approval_date,
        c.company,
        c.country,
        c.contents,
        c.weight_tons,
        c.status,
        c.conditions,
        c.notes,
        'النظام'
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    ws['!rtl'] = true;

    // تنسيق الرؤوس
    for (let i = 0; i < headers.length; i++) {
        const cell = XLSX.utils.encode_cell({ r: 0, c: i });
        ws[cell].s = createHeaderStyle();
    }

    ws['!cols'] = headers.map(() => ({ wch: 15 }));
    return ws;
}

function createReportsSheet(containers) {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    ws['A1'] = { v: 'التقارير والإحصائيات', s: { ...createHeaderStyle('8E44AD'), font: { ...createHeaderStyle().font, size: 16 } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

    const reports = [
        ['إجمالي الحاويات', containers.length],
        ['حاويات 40 قدم', containers.filter(c => c.size === '40 قدم').length],
        ['حاويات 20 قدم', containers.filter(c => c.size === '20 قدم').length],
        ['الحاويات المحجوزة', containers.filter(c => c.status.includes('محجوزة')).length],
        ['الحاويات الممنوعة', containers.filter(c => c.status.includes('ممنوع')).length],
        ['موافقة مشروطة', containers.filter(c => c.status.includes('مشروط')).length],
        ['الحاويات المجازة', containers.filter(c => c.status.includes('يمكن')).length],
        ['إجمالي الأطنان', containers.reduce((sum, c) => sum + parseFloat(c.weight_tons), 0).toFixed(1)],
    ];

    let row = 2;
    for (const [name, value] of reports) {
        ws[`A${row}`] = { v: name, s: createHeaderStyle() };
        ws[`B${row}`] = {
            v: value,
            s: {
                font: { name: 'Calibri', size: 12, bold: true, color: { rgb: COLORS.accent } },
                fill: { fgColor: { rgb: COLORS.light_gray }, patternType: 'solid' },
                alignment: { horizontal: 'center', vertical: 'center' },
            }
        };
        row++;
    }

    ws['!cols'] = [{ wch: 25 }, { wch: 20 }];
    return ws;
}

function createCertificatesSheet() {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    ws['A1'] = { v: 'شهادات الاستقبال والتسليم', s: { ...createHeaderStyle(COLORS.danger), font: { ...createHeaderStyle().font, size: 16 } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    let row = 2;

    // شهادة الاستقبال
    ws[`A${row}`] = { v: 'شهادة استقبال الحاوية', s: createHeaderStyle() };
    row += 2;

    const receiptFields = [
        'رقم الشهادة',
        'رقم الحاوية',
        'تاريخ الاستقبال',
        'الموقع (الميناء)',
        'المسؤول عن الاستقبال',
        'التوقيع والختم',
    ];

    for (const field of receiptFields) {
        ws[`A${row}`] = { v: field, s: createHeaderStyle(COLORS.secondary) };
        ws[`B${row}`] = { s: { border: { bottom: { style: 'thin', color: { rgb: '000000' } } } } };
        row++;
    }

    // شهادة التسليم
    row += 2;
    ws[`A${row}`] = { v: 'شهادة تسليم الحاوية', s: createHeaderStyle() };
    row += 2;

    const deliveryFields = [
        'رقم الشهادة',
        'رقم الحاوية',
        'تاريخ التسليم',
        'اسم المستقبل',
        'الشركة',
        'التوقيع والختم',
    ];

    for (const field of deliveryFields) {
        ws[`A${row}`] = { v: field, s: createHeaderStyle(COLORS.secondary) };
        ws[`B${row}`] = { s: { border: { bottom: { style: 'thin', color: { rgb: '000000' } } } } };
        row++;
    }

    ws['!cols'] = [{ wch: 30 }, { wch: 50 }];
    return ws;
}

function createSettingsSheet() {
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!rtl'] = true;

    // أحجام الحاويات
    ws['A1'] = { v: 'أحجام الحاويات', s: { font: { bold: true } } };
    CONTAINER_SIZES.forEach((size, idx) => {
        ws[`A${idx + 2}`] = { v: size };
    });

    // البلدان
    ws['D1'] = { v: 'البلدان', s: { font: { bold: true } } };
    COUNTRIES.forEach((country, idx) => {
        ws[`D${idx + 2}`] = { v: country };
    });

    // الشركات
    ws['F1'] = { v: 'الشركات', s: { font: { bold: true } } };
    COMPANIES.forEach((company, idx) => {
        ws[`F${idx + 2}`] = { v: company };
    });

    // حالات التصريح
    ws['H1'] = { v: 'حالات التصريح', s: { font: { bold: true } } };
    STATUS_OPTIONS.forEach((status, idx) => {
        ws[`H${idx + 2}`] = { v: status };
    });

    ws['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 20 }
    ];

    return ws;
}

// ============================================================================
// البرنامج الرئيسي
// ============================================================================

function main() {
    console.log('🚀 بدء إنشاء نظام إدارة الحاويات...');
    console.log();

    console.log('📦 توليد 15 حاوية تجريبية...');
    const containers = generateSampleContainers();

    console.log('📝 إنشاء ملف Excel...');
    const wb = XLSX.utils.book_new();
    wb.props = {
        title: 'نظام إدارة الحاويات',
        author: 'النظام',
        createdDate: new Date(),
    };

    console.log('📊 إنشاء لوحة التحكم...');
    XLSX.utils.book_append_sheet(wb, createDashboard(containers), '📊 لوحة التحكم');

    console.log('📥 إنشاء ورقة إضافة الحاوية...');
    XLSX.utils.book_append_sheet(wb, createAddContainerSheet(), '📥 إضافة حاوية');

    console.log('📤 إنشاء ورقة تسجيل الخروج...');
    XLSX.utils.book_append_sheet(wb, createCheckoutSheet(), '📤 تسجيل خروج');

    console.log('📁 إنشاء قاعدة البيانات...');
    XLSX.utils.book_append_sheet(wb, createDatabaseSheet(containers), '📁 قاعدة البيانات');

    console.log('📊 إنشاء ورقة التقارير...');
    XLSX.utils.book_append_sheet(wb, createReportsSheet(containers), '📊 التقارير');

    console.log('🖨️ إنشاء ورقة الشهادات...');
    XLSX.utils.book_append_sheet(wb, createCertificatesSheet(), '🖨️ الشهادات');

    console.log('⚙️ إنشاء ورقة الإعدادات...');
    XLSX.utils.book_append_sheet(wb, createSettingsSheet(), '⚙️ الإعدادات');

    const outputPath = 'نظام_إدارة_الحاويات.xlsx';
    console.log();
    console.log(`💾 حفظ الملف: ${outputPath}`);
    XLSX.writeFile(wb, outputPath);

    console.log();
    console.log('✅ تم إنشاء نظام إدارة الحاويات بنجاح!');
    console.log(`📍 الملف: ${outputPath}`);
    console.log();
    console.log('📊 الأوراق المُنشأة:');
    console.log('  1. 📊 لوحة التحكم');
    console.log('  2. 📥 إضافة حاوية قادمة');
    console.log('  3. 📤 تسجيل خروج');
    console.log('  4. 📁 قاعدة البيانات');
    console.log('  5. 📊 التقارير');
    console.log('  6. 🖨️ الشهادات');
    console.log('  7. ⚙️ الإعدادات');
    console.log();
    console.log('🎨 تصميم احترافي RTL عربي');
    console.log('💾 البيانات: 15 حاوية تجريبية');
    console.log('✨ جاهز للاستخدام الفوري!');
}

// تشغيل البرنامج
if (require.main === module) {
    try {
        main();
    } catch (err) {
        console.error('❌ خطأ:', err);
        process.exit(1);
    }
}

module.exports = { generateSampleContainers };
