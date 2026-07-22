import { redirect } from "next/navigation";

// Step 1: there are no real pages yet. Send visitors to the design system
// preview so the components can be verified. This will be replaced with the
// real homepage in a later step.
export default function Home() {
  redirect("/design-system");
}
