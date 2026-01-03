
import React, { useState, useEffect } from 'react';
import { startInfinitePayCheckout, checkPaymentStatus } from '../services/paymentService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const checkoutUrl = "https://checkout.infinitepay.io/katia-souza-lopes/1kcbZuJfUb";

  useEffect(() => {
    let interval: any;
    if (isVerifying) {
      interval = setInterval(async () => {
        const status = await checkPaymentStatus();
        if (status === 'approved') {
          onSuccess();
          setIsVerifying(false);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isVerifying, onSuccess]);

  const handlePayClick = () => {
    startInfinitePayCheckout(checkoutUrl);
    setIsVerifying(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="ai-card w-full max-w-md p-10 relative overflow-hidden bg-black border-white/10">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isVerifying ? (
          <div className="space-y-10 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-header font-bold text-white">Finalizar Assinatura</h2>
              <p className="text-slate-500 text-sm">Acesso imediato após confirmação.</p>
            </div>

            <div className="bg-neutral-900/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Plano Elite Anual</span>
                <span className="text-white font-bold text-lg">R$ 29,90<span className="text-slate-500 text-xs font-normal">/mês</span></span>
              </div>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span> Questões Ilimitadas
                </li>
                <li className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span> Simulados Completos
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayClick}
                className="w-full ai-btn-primary py-5 text-base shadow-2xl shadow-white/5"
              >
                IR PARA O CHECKOUT
              </button>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Pagamento Seguro via InfinitePay</p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
              <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Verificando Pagamento</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Mantenha esta tela aberta. Estamos aguardando o sinal da rede bancária.
              </p>
            </div>
            <button
              onClick={() => setIsVerifying(false)}
              className="text-slate-600 text-xs font-bold hover:text-white transition-colors"
            >
              CANCELAR VERIFICAÇÃO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
