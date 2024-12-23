import { useEffect } from "react";

const JivoChat = () => {
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