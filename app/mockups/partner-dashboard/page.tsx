export default function PartnerDashboardMockup() {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'Cairo, sans-serif' }}>
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #FFCD11 0%, #FFD700 100%)',
        paddingTop: '20px',
        paddingBottom: '60px',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 8px 24px rgba(255, 205, 17, 0.15)',
        position: 'relative',
      }}>
        <div style={{ paddingLeft: '16px', paddingRight: '16px', maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px' }}>🚜</div>
            <button style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>☰</button>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1A1A1A', margin: '0 0 4px', lineHeight: 1.1 }}>
            أهلاً، شريك
          </h1>
          <p style={{ fontSize: '12px', color: '#1A1A1A', opacity: 0.7, margin: 0 }}>
            الأحد، 13 يوليو 2026
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '-40px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 10,
        }}>
          {[
            { label: 'إجمالي الدخل', value: '125,450', sub: '3 دورات', icon: '💰' },
            { label: 'صافي الأرباح', value: '98,200', sub: 'بعد المصاريف', icon: '📈' },
            { label: 'الدورات المفتوحة', value: '2', sub: 'قيد التشغيل', icon: '⏱️' },
            { label: 'السائقون النشطون', value: '8', sub: 'من 12', icon: '👥' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              border: '1px solid #E5E7EB',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {s.label}
                </p>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: '8px 0', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT OPERATIONS */}
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1A1A', marginBottom: '12px', marginTop: '0' }}>
          آخر العمليات
        </h2>

        {[
          { name: 'أحمد الراشد', desc: 'دخل من عملية', amount: '+5,250', type: 'income' },
          { name: 'محمد العتيبي', desc: 'مصروف صيانة', amount: '-850', type: 'expense' },
          { name: 'علي الدعيع', desc: 'تقدم راتب', amount: '-2,000', type: 'expense' },
        ].map((tx, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            marginBottom: '8px',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px' }}>
                {tx.name}
              </p>
              <p style={{ fontSize: '11px', color: '#A0A0A0', margin: 0 }}>
                {tx.desc}
              </p>
            </div>
            <div style={{ textAlign: 'end', flexShrink: 0, marginLeft: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: 900, color: tx.type === 'income' ? '#10B981' : '#EF4444', margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif", direction: 'ltr' }}>
                {tx.amount}
              </p>
              <p style={{ fontSize: '10px', color: '#A0A0A0', margin: 0 }}>ر.س</p>
            </div>
          </div>
        ))}

        {/* Quick Links */}
        <div style={{ marginBottom: '40px', marginTop: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px', marginTop: '0' }}>
            إجراءات سريعة
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button style={{ background: '#FFCD11', color: '#1A1A1A', padding: '12px 14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '12px', textAlign: 'center', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
              + دورة جديدة
            </button>
            <button style={{ background: '#FFFFFF', color: '#1A1A1A', padding: '12px 14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '12px', textAlign: 'center', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'transform 0.2s' }}>
              + إضافة سائق
            </button>
            <button style={{ background: '#FFFFFF', color: '#1A1A1A', padding: '12px 14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '12px', textAlign: 'center', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'transform 0.2s' }}>
              عرض الدورات
            </button>
            <button style={{ background: '#FFFFFF', color: '#1A1A1A', padding: '12px 14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '12px', textAlign: 'center', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'transform 0.2s' }}>
              الإعدادات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
