function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>Júlia & Gabriel</h1>
      <h2>09.09.16 - ♾️</h2>
      <audio controls>
        <source src="/songbird.mp3" />
      </audio>
      <img
        src="https://i.redd.it/wrgxqesjz8ze1.gif"
        style={{ width: "400px", height: "auto" }}
      />
      <span>Te amo ontem, hoje e amanhã, guriazinha.</span>
    </div>
  );
}

function teste() {
  console.log("identacao errada");
}

export default Home;
