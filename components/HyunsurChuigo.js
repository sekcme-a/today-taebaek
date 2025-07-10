import { useEffect, useState } from "react";

const HyunsurChuigo = () => {
  const [fxList, setFxList] = useState([]);

  useEffect(() => {
    let id = 0;

    const spawnFx = () => {
      const fxId = id++;
      const top = Math.random() * 80 + 10;
      const left = Math.random() * 80 + 10;
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      const color = getRandomColor();
      const size = Math.random() * 1.5 + 1; // 1.0 ~ 2.5배

      const newFx = {
        id: fxId,
        top,
        left,
        dirX,
        dirY,
        color,
        size,
      };

      setFxList((prev) => [...prev, newFx]);

      setTimeout(() => {
        setFxList((prev) => prev.filter((f) => f.id !== fxId));
      }, 3000);

      const nextDelay = Math.random() * 5000 + 5000;
      setTimeout(spawnFx, nextDelay);
    };

    const getRandomColor = () => {
      const colors = [
        "#f87171", // red
        "#fb923c", // orange
        "#facc15", // yellow
        "#4ade80", // green
        "#38bdf8", // blue
        "#a78bfa", // purple
        "#f472b6", // pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    spawnFx();
  }, []);

  return (
    <>
      {fxList.map((fx) => (
        <span
          key={fx.id}
          className="absolute animate-fly font-extrabold"
          style={{
            top: `${fx.top}%`,
            left: `${fx.left}%`,
            "--dir-x": fx.dirX,
            "--dir-y": fx.dirY,
            color: fx.color,
            fontSize: `${fx.size}rem`,
          }}
        >
          현서 최고
        </span>
      ))}
    </>
  );
};

export default HyunsurChuigo;
