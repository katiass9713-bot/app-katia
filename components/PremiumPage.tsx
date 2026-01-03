
import React from 'react';

interface Props {
  onBack: () => void;
  onSubscribe: () => void;
}

const PremiumPage: React.FC<Props> = ({ onBack, onSubscribe }) => {
  const plans = [
    {
      name: "EnfQ® Elite",
      price: "R$ 29,90",
      period: "mensal",
      features: [
        "Questões Ilimitadas",
        "Modo Simulado Completo",
        "Resumos Diários Estratégicos",
        "Bancas ENARE, FGV, CEBRASPE",
        "Conteúdo Protocolos 2025",
        "Análise de Desempenho Real",
        "Acesso em 2 aparelhos (Ex: Celular e PC)"
      ],
      isPopular: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 animate-fadeIn">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="text-slate-500 text-sm font-medium hover:text-white transition-colors">← Voltar</button>
        <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Acesso Elite
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-header font-bold text-white mb-4">Sua Aprovação é o Investimento</h2>
        <p className="text-slate-500 text-lg">As melhores ferramentas para sua carreira em um só lugar.</p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, idx) => (
          <div key={idx} className="bg-neutral-900 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest">
                Recomendado
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-header font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 font-medium">/{plan.period}</span>
                </div>
              </div>
              <button 
                onClick={onSubscribe}
                className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-transform"
              >
                Assinar agora
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-8 border-t border-white/5">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Aviso de Segurança Explícito */}
            <div className="mt-10 p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
              <div className="flex gap-4">
                <div className="text-rose-500 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-rose-400 text-xs font-bold uppercase tracking-widest">Aviso Importante de Segurança</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Sua assinatura é pessoal e intransferível. O acesso é permitido em até <strong>2 dispositivos simultâneos</strong> (ex: seu celular e seu computador). O compartilhamento de login ou a venda do acesso resultará no <strong>bloqueio imediato e permanente da conta</strong>, sem direito a estorno, sendo necessário uma nova assinatura com outro e-mail para retomar os estudos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center space-y-4">
        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">Pagamento Seguro via InfinitePay</p>
        <div className="flex justify-center gap-8 opacity-20 grayscale">
          <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" className="h-4" alt="Visa" />
          <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo.png" className="h-6" alt="Mastercard" />
          <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-logo.png" className="h-6" alt="Pix" />
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
