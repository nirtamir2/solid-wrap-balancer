import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Balancer } from "../../../src";

export default function HomePage() {
  const [width, setWidth] = createSignal(339);
  const [text, setText] = createSignal(
    "The quick brown fox jumps over the lazy dog"
  );
  const widthString = () => `${width()}px`;

  return (
    <div class="flex h-screen w-full flex-col items-center justify-center gap-10">
      <div>
        <div>
          <div class="p-2">{widthString()}</div>
          <input
            type="range"
            min={100}
            max={500}
            value={width()}
            onInput={(e) => {
              setWidth(Number.parseInt(e.currentTarget.value));
            }}
          />
          <input
            type="text"
            value={text()}
            onInput={(e) => {
              setText(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <div class="flex w-full justify-center gap-10">
        <div>
          <h3>Balancer</h3>
          <div style={{ width: widthString() }} class="border text-xl">
            <Balancer>{text()}</Balancer>
          </div>
        </div>
        <div>
          <h3>Regular</h3>
          <div style={{ width: widthString() }} class="border text-xl">
            <span>{text()}</span>
          </div>
        </div>
      </div>
      <A href="/react-wrap-balancer">Docs WIP</A>
    </div>
  );
}
