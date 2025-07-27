import { Link } from "react-router-dom";
import catImg from "../assets/cat.png";
import ballonImg from "../assets/ballon.png";
import zarfImg from "../assets/zarf.png";
import homeImg from "../assets/home.png";

export default function Message() {
  return (
    <div
      className="w-screen h-screen bg-[#272624] relative overflow-hidden"
      style={{
        minWidth: "800px",
        minHeight: "600px",
      }}
    >
      {/* Kedi */}
      <img
        src={catImg}
        alt="Cat"
        className="absolute bottom-0 left-0"
        style={{ width: "300px", height: "auto" }}
      />

      {/* Konuşma Balonu */}
      <img
        src={ballonImg}
        alt="Speech Bubble"
        className="absolute"
        style={{
          top: "40px",
          left: "300px",
          width: "450px",
          height: "450px",
        }}
      />

      {/* Zarf Butonu */}
      <a
        href="/message-card/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute"
        style={{
          top: "120px",
          left: "430px",
        }}
      >
        <img
          src={zarfImg}
          alt="Envelope"
          style={{
            width: "200px",
            height: "200px",
            display: "block",
          }}
        />
      </a>

      {/* Home Sayfasına Dön Butonu */}
      <Link
        to="/"
        className="absolute"
        style={{
          bottom: "24px",
          right: "24px",
        }}
      >
        <img
          src={homeImg}
          alt="Go Home"
          style={{
            width: "68px",
            height: "68px",
            display: "block",
          }}
        />
      </Link>
    </div>
  );
}
