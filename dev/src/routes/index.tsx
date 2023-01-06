import { A } from "@solidjs/router";
import { Suspense, createSignal } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { createRouteData, useRouteData } from "solid-start";
import { Balancer } from "../../../src";
import GithubIcon from "~/assets/github.svg";
import SolidIcon from "~/assets/solid.svg";
import { Counter } from "~/components/Counter";
import { client } from "~/utils/trpc";


export function routeData(_: RouteDataArgs) {
  return createRouteData(async () => {
    return await client.hello.query({ name: "World" });
  });
}

export default function Home() {
  const greeting = useRouteData<typeof routeData>();
  const [width, setWidth] = createSignal(339);
  const [text, setText] = createSignal(
    "The quick brown fox jumps over the lazy dog"
  );
  const widthString = () => `${width()}px`;

  return (
    <div class="flex h-screen flex-col items-center justify-center gap-4">
      <h1 class="text-center text-4xl font-bold text-gray-900">
        Solid Start Starter
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div class="text-center text-2xl font-bold text-gray-500">
          {greeting()}
        </div>
      </Suspense>

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
      </div>

      <SolidIcon height={200} width={200} />

      <Counter />
      <A
        href="https://github.com/nirtamir2/solid-start-starter"
        class="flex items-center gap-2 text-gray-500"
      >
        <GithubIcon height={24} width={24} />
        <span>solid-start-starter</span>
      </A>
    </div>
  );
}
