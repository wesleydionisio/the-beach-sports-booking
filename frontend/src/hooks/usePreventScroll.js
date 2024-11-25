import { useEffect } from 'react';

const usePreventScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Previne o scroll apenas no body
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // evita o jump do scroll
      
      return () => {
        // Restaura o scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);
};

export default usePreventScroll; 