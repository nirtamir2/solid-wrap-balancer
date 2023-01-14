import { unstable_clientOnly } from "solid-start";

const ClientOnlyPage = unstable_clientOnly(async () => {
  return await import("./react-wrap-balancer");
});
export default function ClientReactWrapBalancerPage() {
  return <ClientOnlyPage />;
}
