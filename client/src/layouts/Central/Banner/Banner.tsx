import "./Banner.style.scss";

function Banner() {
  return (
    <div className="Banner">
      <img src="/hogwartslogo.png" alt="logo" />
      <div className="Banner__seperator"></div>
      <div className="Banner__title">Hogwarts School of Witchcraft and Wizardry</div>
    </div>
  );
}

export default Banner;
