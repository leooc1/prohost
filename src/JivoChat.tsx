import { useEffect } from "react";

const blockedRoutes = [
  "/assinar",
  "/relatorio",
  // "/assinar/forma-pagamento",
  // "/assinar/pix",
  // "/assinar/boleto",
  // "/assinar/credit-card",
  // "/reset-senha",
];

const JivoChat = () => {
  const location = window.location;

  useEffect(() => {
    if (blockedRoutes.some(route => location.pathname.startsWith(route))) {
      return;
    }

    const script = document.createElement("script");
    script.src = "//code.jivosite.com/widget/t3ZXsHzqJ1";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [location.pathname]);

  return null;
};

export default JivoChat;