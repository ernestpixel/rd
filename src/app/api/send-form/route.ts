import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function formatEntry(question: string, answer: string | string[]) {
  if (Array.isArray(answer)) {
    answer = answer.filter(Boolean).join(', ');
  }
  return `<div style='margin-bottom:16px;'><strong>${question}</strong><br/><span style='color:#3028b2;'>&rarr;</span> ${answer || '-'}</div>`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const html = `
      <h2>Formular Website Factory</h2>
      ${formatEntry('Care este domeniul principal de activitate al afacerii tale?', data.activity)}
      ${formatEntry('Câte persoane lucrează în compania ta?', data.employees)}
      ${formatEntry('Ai deja un website activ?', data.hasWebsite)}
      ${data.hasWebsite === 'Da' ? formatEntry('Platforma pe care e construit website-ul', data.websitePlatform) : ''}
      ${formatEntry('Care sunt cele mai consumatoare de timp activități administrative sau repetitive în afacerea ta?', data.timeConsuming)}
      ${formatEntry('Folosești în prezent vreun tool pentru automatizare?', data.usesAutomation)}
      ${data.usesAutomation === 'Da' ? formatEntry('Ce tool-uri folosești?', data.automationTools) : ''}
      ${formatEntry('Ce tip de soluții ai considera utile pentru afacerea ta?', data.usefulSolutions)}
      ${formatEntry('Care sunt cele mai mari provocări digitale cu care te confrunți acum?', data.digitalChallenges)}
      ${formatEntry('Ai fi interesat să testezi GRATUIT un instrument digital personalizat pentru afacerea ta?', data.interested)}
      ${formatEntry('Cum preferi să fii contactat pentru idei sau propuneri de tool-uri?', data.contactMethods)}
    `;
    const { error } = await resend.emails.send({
      from: 'Website Factory <office@websitefactory.ro>',
      to: 'office@websitefactory.ro',
      subject: 'Formular completat Website Factory',
      html,
    });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'A apărut o eroare la trimitere.' }, { status: 500 });
  }
} 