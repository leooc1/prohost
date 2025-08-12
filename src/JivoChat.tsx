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

  if (blockedRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.jivosite.com/widget/BbNBy6XPgg";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default JivoChat;