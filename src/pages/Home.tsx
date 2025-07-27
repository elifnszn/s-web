import { Link } from "react-router-dom";
import yaziImg from "../assets/yazi.png";
import mine from "../assets/mine.png";
import heart from "../assets/heart.png";
import catImg from "../assets/cat.png";

export default function Home() {
  return (
    <div
      className="w-screen h-screen bg-[#272624] relative overflow-hidden"
      style={{
        minWidth: "800px",
        minHeight: "600px",
      }}
    >
      {/* Yazı */}
      <img
        src={yaziImg}
        alt="Selam Canım"
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          top: "24px",
          width: "800px",
          height: "auto",
        }}
      />

      {/* Butonlar */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        style={{ top: "180px", gap: "32px" }}
      >
        <Link to="/game" className="inline-block">
          <img src={mine} alt="Mine Button" style={{ width: "146px", height: "146px" }} />
        </Link>
        <Link to="/message" className="inline-block">
          <img src={heart} alt="Heart Button" style={{ width: "166px", height: "166px" }} />
        </Link>
      </div>

      {/* Kedi görseli */}
      <img
        src={catImg}
        alt="Cat"
        className="absolute bottom-0 left-0"
        style={{ width: "300px", height: "auto" }}
      />
    </div>
  );
}
