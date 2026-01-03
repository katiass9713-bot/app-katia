
// Simulação de banco de dados volátil para o protótipo
const simulationPaymentStorage = {
  isAwaiting: false,
  status: 'pending' as 'pending' | 'approved' | 'failed',
};

export const startInfinitePayCheckout = (url: string) => {
  window.open(url, '_blank');
  simulationPaymentStorage.isAwaiting = true;
  simulationPaymentStorage.status = 'pending';

  // Simulação de Webhook: Em 15 segundos, o status muda para aprovado automaticamente
  setTimeout(() => {
    simulationPaymentStorage.status = 'approved';
    console.log("Simulated Webhook: Payment Approved!");
  }, 15000);
};

export const checkPaymentStatus = async (): Promise<'pending' | 'approved' | 'failed'> => {
  // Simula uma chamada de API ao seu backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulationPaymentStorage.status);
    }, 500);
  });
};

export const forceApproveForTest = () => {
    simulationPaymentStorage.status = 'approved';
};
