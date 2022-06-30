import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundView({
  className = "",
}: {
  className?: string;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <div className={`${className}`}></div>;
}
