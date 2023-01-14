# Animated.div cause problems in SSR

I could do

```tsx
import { unstable_clientOnly } from "solid-start";

interface Props {}

const ClientOnlyPage = unstable_clientOnly(async () => {
  return await import("./react-wrap-balancer");
});
export default function B() {
  return <ClientOnlyPage />;
}
```

## island mode
