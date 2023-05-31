import { SetStateAction, useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import doguinho from "../../public/Dachshund11.webp";
import Image from "next/image";

const Card = () => {
  const hcaptchaRef = useRef(null);
  const [hcaptchaToken, setHcaptchaToken] = useState("");

  const handleHcaptchaVerify = (token: SetStateAction<string>) => {
    setHcaptchaToken(token);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (hcaptchaToken) {
      try {
        const response = await fetch("/api/hello", {
          method: "POST",
          body: JSON.stringify({ token: hcaptchaToken }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    } else {
      alert("Por favor, verifique o hCaptcha antes de enviar o formulário.");
    }
  };

  useEffect(() => {
    if (hcaptchaToken) {
      // Realize ações adicionais se o token do hCaptcha estiver disponível
    }
  }, [hcaptchaToken]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen flex flex-col items-center gap-5 bg-slate-950"
    >
      <div className="w-[340px] mt-5 p-5 flex flex-col gap-5 bg-sky-500 rounded text-white">
        <Image src={doguinho} alt="" className="w-[300px] rounded" />
        <h1 className="font-bold text-3xl text-center">Beno</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit magnam
          ei deserunt laboriosam in commodi et corrupti. Dolores, impedit
          corporis.
        </p>
        <button type="submit" className="px-3 py-1 bg-white rounded text-black">
          votar
        </button>
      </div>
      <HCaptcha
        ref={hcaptchaRef}
        sitekey="7f7e4173-cf27-4e66-8934-028186885398"
        onVerify={handleHcaptchaVerify}
      />
    </form>
  );
};

export default Card;
