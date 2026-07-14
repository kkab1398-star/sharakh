export default function DriverDashboardMockup() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'Cairo, sans-serif', paddingBottom: '100px' }}>
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #FFCD11 0%, #FFD700 100%)',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(255, 205, 17, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>🚜</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>أحمد الراشد</div>
          </div>
          <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>☰</button>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 16px',
        margin: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E5E7EB',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          رصيدك
        </p>
        <p style={{ fontSize: '48px', fontWeight: 900, color: '#1A1A1A', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, marginBottom: '4px', direction: 'ltr' }}>
          12,450
        </p>
        <p style={{ fontSize: '12px', color: '#A0A0A0', fontFamily: "'Barlow Condensed', sans-serif" }}>
          ر.س
        </p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 16px', marginBottom: '16px' }}>
        {[
          { label: 'الدخل', value: '+45,200', type: 'income' },
          { label: 'المصاريف', value: '-8,500', type: 'expense' },
          { label: 'التقدمات', value: '-5,000', type: 'advance' },
          { label: 'الصافي', value: '+31,700', type: 'net' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            border: '1px solid #E5E7EB',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', marginBottom: '8px' }}>
              {s.label}
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: 900,
              fontFamily: "'Barlow Condensed', sans-serif",
              lineHeight: 1,
              marginBottom: '4px',
              direction: 'ltr',
              color: s.type === 'income' ? '#10B981' : s.type === 'expense' ? '#EF4444' : s.type === 'advance' ? '#F59E0B' : '#1A1A1A',
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: '9px', color: '#A0A0A0' }}>ر.س</p>
          </div>
        ))}
      </div>

      {/* RECENT TRANSACTIONS */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#1A1A1A', marginBottom: '12px' }}>
          آخر العمليات
        </h2>

        {[
          { date: 'اليوم - 02:45 م', desc: 'نقل حي الملز', amount: '+850', type: 'income' },
          { date: 'اليوم - 01:15 م', desc: 'وقود', amount: '-120', type: 'expense' },
          { date: 'أمس - 04:30 م', desc: 'نقل الروضة', amount: '+1,250', type: 'income' },
        ].map((tx, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E5E7EB',
            marginBottom: '8px',
          }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>
                {tx.date}
              </p>
              <p style={{ fontSize: '10px', color: '#A0A0A0' }}>
                {tx.desc}
              </p>
            </div>
            <div style={{ textAlign: 'end', marginLeft: '12px' }}>
              <p style={{
                fontSize: '13px',
                fontWeight: 900,
                fontFamily: "'Barlow Condensed', sans-serif",
                direction: 'ltr',
                color: tx.type === 'income' ? '#10B981' : '#EF4444',
              }}>
                {tx.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}>
        {[
          { icon: '🏠', label: 'الرئيسية', active: true },
          { icon: '📊', label: 'الإحصائيات' },
          { icon: '', label: '' },
          { icon: '💰', label: 'الأرصدة' },
          { icon: '⚙️', label: 'الإعدادات' },
        ].map((item, i) => (
          <button
            key={i}
            style={{
              display: item.label ? 'flex' : 'opacity: 0',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              flex: 1,
              background: 'none',
              border: 'none',
              color: item.active ? '#FFCD11' : '#A0A0A0',
              fontWeight: 700,
            }}
          >
            {item.label && (
              <>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            )}
          </button>
        ))}
      </nav>

      {/* FAB BUTTON */}
      <button style={{
        position: 'fixed',
        bottom: '64px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '56px',
        height: '56px',
        background: '#FFCD11',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        boxShadow: '0 4px 16px rgba(255, 205, 17, 0.4)',
        cursor: 'pointer',
        zIndex: 45,
        border: 'none',
      }}>
        +
      </button>
    </div>
  );
}
