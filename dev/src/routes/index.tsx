import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Balancer } from "../../../src";

export default function HomePage() {
  const [ratio, setRatio] = createSignal(1);
  const [width, setWidth] = createSignal(339);
  const [text, setText] = createSignal(
    "The quick brown fox jumps over the lazy dog"
  );
  const widthString = () => `${width()}px`;

  return (
    <div class="flex h-screen w-full flex-col items-center justify-center gap-10">
      <div>
        <div>
          <label for="width-range">{widthString()}</label>
          <input
            id="width-range"
            type="range"
            min={100}
            max={500}
            value={width()}
            onInput={(e) => {
              setWidth(Number.parseInt(e.currentTarget.value));
            }}
          />
          <label for="ratio-range">{ratio().toFixed(2)}</label>

          <input
            id="ratio-range"
            type="range"
            min={0}
            step={0.1}
            max={1}
            value={ratio()}
            onInput={(e) => {
              setRatio(Number.parseFloat(e.currentTarget.value));
            }}
          />
          <label for="texteditor">Text</label>
          <textarea
            id="textEditor"
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
            <Balancer ratio={ratio()}>{text()}</Balancer>
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
